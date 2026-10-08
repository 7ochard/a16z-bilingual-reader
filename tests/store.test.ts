import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { backup, DatabaseSync } from "node:sqlite";
import { openDatabase, migrations } from "../server/database.js";
import { Store } from "../server/store.js";
import type { ImportBatch } from "../shared/types.js";
const fixture = (): ImportBatch =>
  JSON.parse(
    readFileSync(
      new URL("../fixtures/synthetic-library.json", import.meta.url),
      "utf8",
    ),
  );
function setup() {
  const db = openDatabase(":memory:");
  return { db, store: new Store(db, () => new Date("2026-10-01T12:00:00Z")) };
}
function save(store: Store) {
  return store.saveWord({
    article_id: "synthetic-small-bets",
    segment_id: "opening",
    term: "forecast",
    meaning_zh: "预测",
  });
}
test("batch validation rejects unknown schema, broken links, impossible dates, unknown rights and duplicates before writes", () => {
  for (const change of [
    (b: any) => (b.schema_version = "2.0"),
    (b: any) => (b.articles[1].published_at = "2026-02-30"),
    (b: any) => (b.articles[1].vocabulary[0].segment_id = "missing"),
    (b: any) => (b.articles[1].source.rights = "unknown"),
    (b: any) => b.articles.push(b.articles[0]),
    (b: any) => b.articles[0].segments.push(b.articles[0].segments[0]),
    (b: any) => (b.articles[0].revision = 1.5),
  ]) {
    const { db, store } = setup(),
      b = fixture();
    change(b);
    assert.throws(() => store.import(b));
    assert.equal(store.articles().length, 0);
    db.close();
  }
});
test("idempotent import and higher revisions preserve read/favorite, saved context and learning progress", () => {
  const { db, store } = setup(),
    b = fixture();
  store.import(b);
  const first = save(store);
  store.patchArticle(b.articles[0].id, { read: true, favorite: true });
  store.patchWord(first.id, { favorite: true });
  const reviewed = store.review(first.id, {
    event_id: randomUUID(),
    rating: 3,
    expected_revision: 0,
  });
  store.import(b);
  assert.equal(store.articles().length, 2);
  b.articles[0].revision = 2;
  b.articles[0].segments[0].en =
    "The forecast changed, but saved source context is immutable.";
  store.import(b);
  const w = store.word(first.id);
  assert.equal(w.context_en, first.context_en);
  assert.deepEqual(w.progress, reviewed.progress);
  assert.equal(w.favorite, true);
  assert.equal(store.article(b.articles[0].id).read, true);
  assert.equal(store.article(b.articles[0].id).favorite, true);
  db.close();
});
test("same revision conflict and downgrade reject and transaction rolls back earlier article update", () => {
  const { db, store } = setup(),
    b = fixture();
  store.import(b);
  const changed = fixture();
  changed.articles[0].revision = 2;
  changed.articles[0].title = "Should roll back";
  changed.articles[1].title = "Conflict";
  assert.throws(() => store.import(changed), /higher revision/);
  assert.equal(store.article(b.articles[0].id).title, b.articles[0].title);
  b.articles[1].revision = 2;
  store.import(b);
  assert.throws(() => store.import(fixture()), /older/);
  db.close();
});
test("duplicate word save is normalized/idempotent and saving never counts as reviewing", () => {
  const { db, store } = setup();
  store.import(fixture());
  const first = save(store);
  const again = store.saveWord({
    article_id: first.article_id,
    segment_id: first.segment_id,
    term: "FORECAST",
    meaning_zh: "Do not overwrite",
  });
  assert.equal(first.id, again.id);
  assert.equal(again.meaning_zh, "预测");
  assert.equal(first.progress.reps, 0);
  assert.equal(store.stats().reviewed_today, 0);
  assert.equal(store.words().length, 1);
  assert.throws(
    () =>
      store.saveWord({
        article_id: first.article_id,
        segment_id: "opening",
        term: "absent word",
        meaning_zh: "不存在",
      }),
    /must occur/,
  );
  db.close();
});
test("review exactly-once, collision rejection, stale revisions and not-due cards", () => {
  const { db, store } = setup();
  store.import(fixture());
  const word = save(store),
    input = {
      event_id: randomUUID(),
      rating: 3 as const,
      expected_revision: 0,
    };
  const result = store.review(word.id, input);
  assert.equal(result.progress.reps, 1);
  assert.ok(result.progress.due > word.progress.due);
  assert.deepEqual(store.review(word.id, input), result);
  assert.equal(store.stats().reviewed_today, 1);
  assert.throws(
    () => store.review(word.id, { ...input, rating: 4 }),
    /different request/,
  );
  assert.throws(
    () => store.review(word.id, { ...input, event_id: randomUUID() }),
    /changed/,
  );
  assert.throws(
    () =>
      store.review(word.id, {
        ...input,
        event_id: randomUUID(),
        expected_revision: 1,
      }),
    /not due/,
  );
  db.close();
});
test("all four ratings use ts-fsrs and record logs", () => {
  for (const rating of [1, 2, 3, 4] as const) {
    const { db, store } = setup();
    store.import(fixture());
    const word = save(store);
    const result = store.review(word.id, {
      event_id: randomUUID(),
      rating,
      expected_revision: 0,
    });
    assert.equal(result.progress.reps, 1);
    assert.equal(result.revision, 1);
    assert.ok(Number.isFinite(result.progress.stability));
    assert.equal(
      (db.prepare("SELECT COUNT(*) AS n FROM review_events").get() as any).n,
      1,
    );
    db.close();
  }
});
test("injected database failure rolls back review card and event as one unit", () => {
  const { db, store } = setup();
  store.import(fixture());
  const word = save(store);
  db.exec(
    "CREATE TRIGGER reject_review BEFORE INSERT ON review_events BEGIN SELECT RAISE(ABORT, 'simulated write failure'); END;",
  );
  assert.throws(
    () =>
      store.review(word.id, {
        event_id: randomUUID(),
        rating: 3,
        expected_revision: 0,
      }),
    /simulated/,
  );
  assert.deepEqual(store.word(word.id).progress, word.progress);
  assert.equal(store.word(word.id).revision, 0);
  db.close();
});
test("durable SQLite reopen and consistent backup retain content, favorite and reviewed card", async () => {
  const dir = mkdtempSync(join(tmpdir(), "reader-test-")),
    path = join(dir, "reader.sqlite"),
    copy = join(dir, "backup.sqlite");
  try {
    let db = openDatabase(path);
    let store = new Store(db);
    store.import(fixture());
    const w = save(store);
    store.patchWord(w.id, { favorite: true });
    const next = store.review(w.id, {
      event_id: randomUUID(),
      rating: 4,
      expected_revision: 0,
    });
    await backup(db, copy);
    db.close();
    db = openDatabase(path);
    store = new Store(db);
    assert.deepEqual(store.word(w.id).progress, next.progress);
    assert.equal(store.word(w.id).favorite, true);
    db.close();
    db = openDatabase(copy);
    assert.deepEqual(new Store(db).word(w.id).progress, next.progress);
    assert.equal(
      (db.prepare("PRAGMA integrity_check").get() as any).integrity_check,
      "ok",
    );
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("newer database version fails safely without migration", () => {
  const dir = mkdtempSync(join(tmpdir(), "reader-version-")),
    path = join(dir, "reader.sqlite");
  try {
    const db = new DatabaseSync(path);
    db.exec("PRAGMA user_version=999");
    db.close();
    assert.throws(() => openDatabase(path), /newer/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("library filters and export roundtrip are source-only and accurate", () => {
  const { db, store } = setup();
  store.import(fixture());
  assert.equal(store.articles({ q: "quiet" }).length, 1);
  assert.equal(store.articles({ topic: "Design" }).length, 1);
  assert.equal(store.articles({ from: "2026-09-25" }).length, 1);
  assert.equal(store.articles({ to: "2026-09-25" }).length, 1);
  const exported = store.export();
  const next = setup();
  next.store.import(exported);
  assert.deepEqual(next.store.export(), exported);
  next.db.close();
  db.close();
});

test("v1 to v2 migration preserves existing source-linked vocabulary, card and review records", () => {
  const dir = mkdtempSync(join(tmpdir(), "reader-migrate-")),
    path = join(dir, "reader.sqlite");
  try {
    const raw = new DatabaseSync(path);
    raw.exec(migrations[0]);
    raw.exec("PRAGMA user_version=1");
    const store = new Store(raw);
    store.import(fixture());
    const word = save(store);
    const next = store.review(word.id, {
      event_id: randomUUID(),
      rating: 4,
      expected_revision: 0,
    });
    raw.close();
    const db = openDatabase(path);
    const migrated = new Store(db);
    assert.equal(migrated.word(word.id).context_kind, "source_paragraph");
    assert.deepEqual(migrated.word(word.id).progress, next.progress);
    assert.equal(
      (db.prepare("PRAGMA user_version").get() as any).user_version,
      2,
    );
    assert.equal(db.prepare("PRAGMA foreign_key_check").all().length, 0);
    db.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("archive import validates all files and rolls back the entire collection on conflict", () => {
  const { db, store } = setup(),
    b = fixture();
  store.import(b);
  const first = {
    ...b,
    articles: [
      { ...b.articles[0], revision: 2, title: "Roll back this change" },
    ],
  };
  const second = {
    ...b,
    articles: [{ ...b.articles[1], title: "Same revision conflict" }],
  };
  assert.throws(() => store.importMany([first, second]), /higher revision/);
  assert.equal(store.article(b.articles[0].id).title, b.articles[0].title);
  assert.throws(
    () => store.importMany([first, first]),
    /Duplicate article IDs across/,
  );
  assert.throws(() =>
    store.importMany([first, { ...second, schema_version: "unknown" }]),
  );
  assert.equal(store.article(b.articles[0].id).revision, 1);
  assert.equal(
    store.importMany([
      { ...b, articles: [b.articles[0]] },
      { ...b, articles: [b.articles[1]] },
    ]).imported,
    2,
  );
  db.close();
});
