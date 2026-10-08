import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, rmSync, mkdirSync, writeFileSync, symlinkSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { archiveArticles, readArchive, articleDirectory } from "../server/archive.js";
import { parseContent, articleMarkdown } from "../server/content.js";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
import type { ImportBatch } from "../shared/types.js";
const example = (): ImportBatch => JSON.parse(readFileSync(new URL("../fixtures/synthetic-library.json", import.meta.url), "utf8"));
function sandbox(fn: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "reader-archive-"));
  try { fn(root); } finally { rmSync(root, { recursive: true, force: true }); }
}
const one = (id = "synthetic-one"): ImportBatch => {
  const batch = example(); batch.articles = [batch.articles[0]]; batch.articles[0].id = id; return batch;
};
test("dated archive creates one JSON/Markdown pair per article, keeps same-day distinct IDs and no-ops exact repeats", () => sandbox((root) => {
  const batch = example(); batch.articles[1].published_at = batch.articles[0].published_at;
  const first = archiveArticles(batch, root);
  assert.equal(first.archived, 2);
  assert.ok(first.paths.every((path) => path.startsWith(batch.articles[0].published_at + "/")));
  assert.deepEqual(readArchive(root).latest, parseContent(batch).articles.sort((a, b) => a.id.localeCompare(b.id)));
  const path = readArchive(root).records[0].jsonPath, before = statSync(path).mtimeMs;
  assert.deepEqual(archiveArticles(batch, root), { archived: 0, unchanged: 2, paths: [] });
  assert.equal(statSync(path).mtimeMs, before);
  assert.equal(existsSync(join(root, ".archive.lock")), false);
}));
test("higher revisions require explicit update, never overwrite history, and keep initial date anchor", () => sandbox((root) => {
  const batch = one(); archiveArticles(batch, root);
  const original = readArchive(root).records[0], originalJSON = readFileSync(original.jsonPath, "utf8");
  batch.articles[0].title = "Changed";
  assert.throws(() => archiveArticles(batch, root), /higher revision/);
  batch.articles[0].revision = 2; batch.articles[0].published_at = "2026-10-08";
  assert.throws(() => archiveArticles(batch, root), /explicit --update/);
  archiveArticles(batch, root, { update: true });
  const result = readArchive(root);
  assert.equal(result.records.length, 2); assert.equal(result.latest[0].revision, 2);
  assert.equal(new Set(result.records.map((r) => r.anchorDate)).size, 1);
  assert.equal(readFileSync(original.jsonPath, "utf8"), originalJSON);
  assert.throws(() => archiveArticles(one(), root, { update: true }), /older revision/);
}));
test("whole-batch preflight and runtime failure leave existing history untouched and no partial pairs", () => sandbox((root) => {
  const initial = one(); archiveArticles(initial, root);
  const mixed = example(); mixed.articles[1] = { ...initial.articles[0], title: "Unversioned change" };
  assert.throws(() => archiveArticles(mixed, root), /higher revision/);
  assert.equal(readArchive(root).latest.length, 1);
  assert.throws(() => archiveArticles(example(), root, { beforePublish(index) { if (index === 1) throw new Error("injected write failure"); } }), /injected/);
  assert.equal(readArchive(root).latest.length, 1);
  assert.ok(!readdirSync(root).some((name) => name.startsWith(".")));
}));
test("article ID punctuation, case and maximum length cannot collide or traverse archive paths", () => sandbox((root) => {
  const ids = ["Case", "case", "a:b", "a-b", "a.b", "a" + ":".repeat(119)];
  assert.equal(new Set(ids.map(articleDirectory)).size, ids.length);
  for (const id of ids) archiveArticles(one(id), root);
  assert.equal(readArchive(root).latest.length, ids.length);
  for (const id of ["../escape", "a/b", "a\\b", ".hidden"]) assert.throws(() => archiveArticles(one(id), root));
}));
test("archive rejects root, ancestor, nested and final-file symlinks without writing through them", () => sandbox((base) => {
  const outside = join(base, "outside"); mkdirSync(outside);
  const link = join(base, "link"); symlinkSync(outside, link, "dir");
  assert.throws(() => archiveArticles(one(), link), /Symlink/);
  assert.throws(() => archiveArticles(one(), join(link, "nested")), /Symlink/);
  const root = join(base, "archive"); archiveArticles(one(), root);
  symlinkSync(outside, join(root, "nested"), "dir"); assert.throws(() => readArchive(root), /Symlink/);
  rmSync(join(root, "nested"));
  const record = readArchive(root).records[0]; rmSync(record.markdownPath);
  symlinkSync(join(outside, "article.md"), record.markdownPath);
  assert.throws(() => readArchive(root), /Symlink/);
  assert.deepEqual(readdirSync(outside), []);
}));
test("archive detects missing, orphaned, mismatched, relocated and duplicate historical pairs", () => {
  for (const mode of ["missing", "orphan", "modified", "wrongrevision", "duplicaterevision"]) sandbox((root) => {
    archiveArticles(one(), root); const record = readArchive(root).records[0];
    if (mode === "missing") rmSync(record.markdownPath);
    if (mode === "orphan") writeFileSync(join(root, "orphan.md"), "orphan");
    if (mode === "modified") writeFileSync(record.markdownPath, "modified");
    if (mode === "wrongrevision") {
      const batch = one(); batch.articles[0].revision = 2;
      writeFileSync(record.jsonPath, JSON.stringify(batch)); writeFileSync(record.markdownPath, articleMarkdown(batch.articles[0]));
    }
    if (mode === "duplicaterevision") {
      writeFileSync(join(root, "synthetic-one.json"), readFileSync(record.jsonPath));
      writeFileSync(join(root, "synthetic-one.md"), readFileSync(record.markdownPath));
    }
    assert.throws(() => readArchive(root), /Missing|Orphan|differs|identity|Duplicate/);
  });
});
test("existing archive lock blocks acceptance; stale work directories never appear as complete content", () => sandbox((root) => {
  mkdirSync(join(root, ".archive.lock"));
  assert.throws(() => archiveArticles(one(), root), /locked/);
  rmSync(join(root, ".archive.lock"), { recursive: true });
  mkdirSync(join(root, ".pending-interrupted")); writeFileSync(join(root, ".pending-interrupted", "article.json"), "{");
  assert.equal(readArchive(root).latest.length, 0);
}));
test("oversized serialized pair is rejected before publication and archive stays readable", () => sandbox((root) => {
  const batch = one(); batch.articles[0].vocabulary = [];
  batch.articles[0].segments = Array.from({ length: 300 }, (_, index) => ({ id: `s${index}`, order: index, kind: "paragraph", en: "a".repeat(10000), zh: "b".repeat(10000) }));
  assert.throws(() => archiveArticles(batch, root), /exceeds/);
  assert.equal(readArchive(root).latest.length, 0);
  assert.ok(!readdirSync(root).some((name) => name.startsWith(".")));
}));
test("nested extension key reorder is a true archive and SQLite no-op", () => sandbox((root) => {
  const batch = one(); batch.articles[0].extensions = { outer: { z: 1, a: [1, 2] }, a: "x" };
  archiveArticles(batch, root);
  const db = openDatabase(":memory:");
  try {
    const store = new Store(db); store.import(batch);
    // A trigger establishes that an equivalent reimport performs no source UPDATE.
    db.exec("CREATE TRIGGER reject_noop BEFORE UPDATE ON articles BEGIN SELECT RAISE(ABORT, 'no-op updated source'); END;");
    batch.articles[0].extensions = { a: "x", outer: { a: [1, 2], z: 1 } };
    assert.equal(archiveArticles(batch, root).unchanged, 1); store.import(batch);
  } finally { db.close(); }
}));
test("archive CLI imports latest revisions transactionally and queries date, analysis, vocabulary and metadata", () => sandbox((root) => {
  const archive = join(root, "archive"), database = join(root, "private.sqlite"), input = one();
  archiveArticles(input, archive);
  input.articles[0].revision = 2; input.articles[0].published_at = "2026-10-08";
  input.articles[0].analysis.discussion.push("distinctive-analysis-marker");
  input.articles[0].extensions = { note: "distinctive-meta-marker" };
  archiveArticles(input, archive, { update: true });
  const run = (script: string, args: string[]) => spawnSync(process.execPath, ["--import", "tsx", script, ...args], { encoding: "utf8", env: { ...process.env, DATABASE_PATH: database } });
  const imported = run("scripts/import-archive.ts", [archive]); assert.equal(imported.status, 0, imported.stderr);
  for (const query of ["distinctive-analysis-marker", "distinctive-meta-marker"]) {
    const result = run("scripts/query.ts", [query, "--from", "2026-10-08", "--to", "2026-10-08"]);
    assert.equal(result.status, 0, result.stderr); assert.equal(JSON.parse(result.stdout).length, 1);
  }
  assert.equal(JSON.parse(run("scripts/query.ts", ["--to", "2026-10-07"]).stdout).length, 0);
  assert.notEqual(run("scripts/query.ts", ["--from", "2026-02-30"]).status, 0);
}));
test("checked-in archive pairs validate and contain source data only", () => {
  const archive = readArchive("content/articles"); assert.ok(archive.records.length > 0);
  for (const { jsonPath } of archive.records) {
    const text = readFileSync(jsonPath, "utf8");
    for (const key of ["saved_at", "learning_progress", "review_events", "favorite", "is_read"]) assert.ok(!text.includes(`"${key}"`));
  }
});

test("search indexes source values across whitespace without matching private state field names", () => {
  const db = openDatabase(":memory:");
  try {
    const batch = one(); batch.articles[0].segments[0].en = "A reading\nhabit grows from a forecast.";
    const store = new Store(db); store.import(batch);
    assert.equal(store.articles({ q: "reading habit" }).length, 1);
    assert.equal(store.articles({ q: "false" }).length, 0);
  } finally { db.close(); }
});
