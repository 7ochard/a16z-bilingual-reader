import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { parseContent, articleMarkdown } from "../server/content.js";
import { upstreamSchemaV100, upstreamImportSchemaV100 } from "../server/schema.js";
import { archiveArticles, readArchive } from "../server/archive.js";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
const fixture = () => JSON.parse(readFileSync(new URL("../fixtures/synthetic-upstream-1.0.0.json", import.meta.url), "utf8"));
const legacy = () => JSON.parse(readFileSync(new URL("../fixtures/synthetic-daily-article.json", import.meta.url), "utf8"));
function sandbox(fn: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "reader-v100-"));
  try { fn(root); } finally { rmSync(root, { recursive: true, force: true }); }
}
test("current 1.0.0 shape is primary and retains all source values, authors, rich arrays and null phonetics", () => {
  const input = fixture(), a = parseContent(input).articles[0];
  assert.deepEqual(upstreamSchemaV100.parse(input.article), input.article);
  assert.deepEqual(a.upstream_snapshot, input.article);
  assert.equal(a.author, "Ada Example, Lin Example");
  assert.deepEqual((a.upstream_snapshot!.author as any[])[1], input.article.author[1]);
  assert.equal(a.source.name, input.article.source.name);
  assert.equal(a.upstream_title_zh, input.title_zh);
  assert.equal(a.analysis.summary_zh, input.article.analysis.core_thesis.trim());
  assert.equal(a.analysis.key_points.length, input.article.analysis.supporting_evidence.length);
  assert.equal(a.analysis.discussion.length, input.article.analysis.industry_significance.length + 1);
  assert.match(a.analysis.limitations!, /没有真实样本/);
  assert.equal(a.vocabulary[0].phonetic, undefined);
  assert.equal(a.upstream_snapshot!.vocabulary[0].phonetic, null);
  assert.equal(a.segments[0].order, 0);
  assert.equal(a.vocabulary.length, 12);
  assert.ok(a.vocabulary.every((word) => word.segment_id === null));
  const markdown = articleMarkdown(a);
  for (const value of ["commercial_significance", "额外的分析章节", "producer_note", "producer_extra", "pronunciation_source", '"phonetic": null']) assert.ok(markdown.includes(value), value);
});
test("opaque source object and empty author list require no invented producer fields", () => {
  const input = fixture(); input.article.source = {}; input.article.author = [];
  delete input.article.meta;
  const a = parseContent(input).articles[0];
  assert.deepEqual(a.upstream_snapshot!.source, {});
  assert.equal(a.source.name, "example.com");
  assert.equal(a.author, "未提供作者");
  assert.deepEqual(a.upstream_snapshot!.author, []);
  assert.equal(a.meta, undefined);
  input.article.author = [{ display_name: "Alternative author metadata", affiliations: ["Synthetic lab"] }];
  const structured = parseContent(input).articles[0];
  assert.deepEqual(structured.upstream_snapshot!.author, input.article.author);
  assert.match(structured.author, /Alternative author metadata/);
});
test("1.0.0 import requires local rights and never manufactures a license or legacy provenance", () => {
  const input = fixture(), result = parseContent(input);
  assert.throws(() => parseContent(input.article));
  assert.equal(result.articles[0].source.rights, "summary_only");
  assert.equal(result.articles[0].source.permission_note, input.rights.permission_note);
  assert.deepEqual(result.articles[0].upstream_snapshot, input.article);
  for (const mutate of [
    (s: any) => delete s.rights, (s: any) => delete s.rights.permission_note,
    (s: any) => { s.rights.rights = "unverified"; },
    (s: any) => { s.article.copyright_mode = "full_text"; },
    (s: any) => { s.article.schema_version = "1.0"; },
    (s: any) => { s.article.source = "publisher"; },
    (s: any) => { s.article.author = "author"; },
  ]) { const copy = fixture(); mutate(copy); assert.throws(() => parseContent(copy)); }
  for (const mutate of [
    (a: any) => delete a.upstream_snapshot,
    (a: any) => { a.upstream_snapshot.id = "unrelated"; },
    (a: any) => { a.source.url = "https://example.com/unrelated"; },
    (a: any) => { a.segments[0].en = "Unrelated full text"; },
    (a: any) => { a.segments[0].kind = "quote"; },
  ]) { const copy = structuredClone(result); mutate(copy.articles[0]); assert.throws(() => parseContent(copy), /summary_only/); }
});
test("current producer unknown fields are retained but unsafe JSON, duplicate IDs and false links are rejected", () => {
  for (const mutate of [
    (s: any) => { s.article.extra = JSON.parse('{"nested":{"__proto__":{"x":1}}}'); },
    (s: any) => { s.article.analysis.extra = { constructor: "unsafe" }; },
    (s: any) => { s.article.segments[0].extra = Infinity; },
    (s: any) => { s.article.analysis.supporting_evidence = [{ ["prototype"]: "unsafe" }]; },
    (s: any) => { s.article.segments.push(s.article.segments[0]); },
    (s: any) => { s.article.vocabulary.push(s.article.vocabulary[0]); },
    (s: any) => { s.article.vocabulary[0].segment_id = "missing"; },
    (s: any) => { s.article.published_at = "2026-02-30"; },
    (s: any) => { s.article.url = "https://name:secret@example.com/"; },
  ]) { const input = fixture(); mutate(input); assert.throws(() => parseContent(input)); }
  const input = fixture(); input.article.vocabulary[0].segment_id = "s01";
  input.article.vocabulary[0].term = "hypothesis";
  assert.equal(parseContent(input).articles[0].vocabulary[0].segment_id, "s01");
});
test("1.0.0 archive is append-only and canonical-idempotent, without duplicate daily content", () => sandbox((root) => {
  const input = fixture();
  archiveArticles(input, root);
  const original = readArchive(root).records[0], before = readFileSync(original.jsonPath);
  input.article.source = Object.fromEntries(Object.entries(input.article.source).reverse());
  assert.equal(archiveArticles(input, root).unchanged, 1);
  input.article.selected_at = "2026-10-11";
  assert.throws(() => archiveArticles(input, root), /higher revision/);
  input.revision = 2;
  assert.throws(() => archiveArticles(input, root), /explicit --update/);
  archiveArticles(input, root, { update: true });
  assert.deepEqual(readFileSync(original.jsonPath), before);
  assert.equal(readArchive(root).latest.length, 1);
  assert.equal(readArchive(root).records.length, 2);
  assert.deepEqual(readArchive(root).latest[0].upstream_snapshot, input.article);
}));
test("legacy-to-1.0.0 migration keeps stable IDs and requires a revision; SQLite learning state survives", () => sandbox((root) => {
  const old = legacy(), current = fixture();
  current.article.id = old.article.id;
  const db = openDatabase(":memory:");
  try {
    const store = new Store(db); store.import(old); archiveArticles(old, root);
    store.patchArticle(old.article.id, { read: true, favorite: true });
    const v = store.article(old.article.id).vocabulary.find((word) => word.segment_id === null)!;
    const saved = store.saveWord({ article_id: old.article.id, segment_id: null, vocabulary_id: v.id, term: v.term, meaning_zh: v.meaning_zh });
    assert.throws(() => store.import(current), /higher revision/);
    assert.throws(() => archiveArticles(current, root), /higher revision/);
    current.revision = 2; store.import(current); archiveArticles(current, root, { update: true });
    const article = store.article(old.article.id);
    assert.equal(article.read, true); assert.equal(article.favorite, true);
    assert.deepEqual(store.word(saved.id), saved);
    assert.deepEqual(article.upstream_snapshot, current.article);
    const exported = store.export(); store.import(exported); assert.deepEqual(store.export(), exported);
    assert.equal(store.articles({ q: "额外的分析章节" }).length, 1);
    assert.equal(readArchive(root).records.length, 2);
    assert.equal(readArchive(root).latest.length, 1);
  } finally { db.close(); }
}));
test("raw CLI preparation adds explicit local review metadata without changing producer JSON or accepting content", () => sandbox((root) => {
  const input = fixture(), raw = join(root, "raw.json"), review = join(root, "review.json"), output = join(root, "prepared.json");
  writeFileSync(raw, JSON.stringify(input.article));
  writeFileSync(review, JSON.stringify({ revision: input.revision, rights: input.rights, title_zh: input.title_zh }));
  const run = () => spawnSync(process.execPath, ["--import", "tsx", "scripts/prepare-upstream.ts", raw, review, output], { encoding: "utf8" });
  assert.equal(run().status, 0);
  assert.deepEqual(JSON.parse(readFileSync(output, "utf8")), input);
  assert.equal(run().status, 1); // Never replace a review copy.
  const badOutput = join(root, "bad.json"); writeFileSync(review, JSON.stringify({ revision: 1 }));
  const bad = spawnSync(process.execPath, ["--import", "tsx", "scripts/prepare-upstream.ts", raw, review, badOutput]);
  assert.notEqual(bad.status, 0); assert.equal(existsSync(badOutput), false);
  assert.deepEqual(JSON.parse(readFileSync(raw, "utf8")), input.article);
}));
test("current upstream structural schemas match validators while legacy direct schemas remain available", async () => {
  const { z } = await import("zod");
  for (const [name, schema] of [["chatgpt-article.v1.0.0", upstreamSchemaV100], ["upstream-wrapper.v1.0.0", upstreamImportSchemaV100]] as const)
    assert.deepEqual(JSON.parse(readFileSync(`schema/${name}.schema.json`, "utf8")), z.toJSONSchema(schema, { io: "input" }));
  assert.equal(parseContent(legacy()).articles[0].upstream_snapshot!.schema_version, "1.0");
});
