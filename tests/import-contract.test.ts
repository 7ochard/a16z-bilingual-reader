import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseContent } from "../server/content.js";
import { adaptUpstream } from "../server/upstream-adapter.js";
import { upstreamSchema, extensionsSchema } from "../server/schema.js";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
const fixture = () => JSON.parse(readFileSync(new URL("../fixtures/synthetic-daily-article.json", import.meta.url), "utf8"));
const simple = () => JSON.parse(readFileSync(new URL("../fixtures/synthetic-upstream-wrapper.json", import.meta.url), "utf8"));

test("rich synthetic daily fixture preserves full analysis, metadata, extensions and the observed core", () => {
  const source = fixture();
  assert.ok(source.article.segments.length >= 2);
  assert.ok(source.article.vocabulary.length >= 10 && source.article.vocabulary.length <= 15);
  const a = parseContent(source).articles[0];
  assert.deepEqual(a.upstream_snapshot, source.article);
  for (const key of ["claims", "evidence", "industry_implications", "independent_judgment", "limitations", "discussion", "extensions"])
    assert.deepEqual((a.analysis as any)[key], source.article.analysis[key]);
  assert.deepEqual(a.meta, source.article.meta);
  assert.deepEqual(a.extensions, source.article.extensions);
  assert.deepEqual(a.upstream_wrapper_extensions, source.extensions);
  assert.deepEqual(a.source.extensions, source.rights.extensions);
  assert.deepEqual(a.segments[0].extensions, source.article.segments[0].extensions);
  assert.deepEqual(a.vocabulary[0].extensions, source.article.vocabulary[0].extensions);
  assert.equal(parseContent(simple()).articles.length, 1);
});

test("snapshot preserves every upstream source string exactly, including whitespace and empty phonetics", () => {
  const source = fixture();
  source.title_zh = "  原始标题空格  ";
  source.article.title = "  A title with original spacing  ";
  source.article.segments[0].en = `\n ${source.article.segments[0].en} \n`;
  source.article.analysis.summary = ` ${source.article.analysis.summary} `;
  source.article.analysis.limitations = "  \n";
  source.article.vocabulary[2].phonetic = "   ";
  source.article.vocabulary[2].example_en = ` ${source.article.vocabulary[2].example_en}  `;
  const a = parseContent(source).articles[0];
  assert.deepEqual(a.upstream_snapshot, source.article);
  assert.equal(a.title, source.article.title.trim());
  assert.equal(a.upstream_title_zh, source.title_zh);
  assert.equal(a.title_zh, source.title_zh.trim());
  assert.equal(a.segments[0].en, source.article.segments[0].en.trim());
  assert.equal(a.vocabulary[2].phonetic, undefined);
  assert.equal(a.upstream_snapshot?.vocabulary[2].phonetic, "   ");
});

test("strict fields reject typos at every supported record level instead of stripping data", () => {
  for (const target of [
    (s: any) => s, (s: any) => s.rights, (s: any) => s.article,
    (s: any) => s.article.segments[0], (s: any) => s.article.analysis,
    (s: any) => s.article.analysis.claims[0], (s: any) => s.article.analysis.evidence[0],
    (s: any) => s.article.vocabulary[0], (s: any) => s.article.meta,
  ]) {
    const source = fixture();
    target(source).undeclared = "must not be lost";
    assert.throws(() => parseContent(source), /Unrecognized key/);
  }
});

test("vocabulary IDs survive reordering, explicit IDs persist, and automatic associations never appear", () => {
  const source = fixture();
  const original = adaptUpstream(source).articles[0].vocabulary;
  source.article.vocabulary.reverse();
  const reordered = adaptUpstream(source).articles[0].vocabulary;
  for (const v of original) assert.equal(reordered.find((w) => w.term === v.term)?.id, v.id);
  assert.equal(original.find((v) => v.term === "pilot")?.id, "v-pilot");
  assert.equal(original.find((v) => v.term === "pilot")?.segment_id, "context");
  // The word occurs once, but no association was supplied by the producer.
  assert.equal(original.find((v) => v.term === "hypothesis")?.segment_id, null);
  assert.equal(original.find((v) => v.term === "momentum")?.segment_id, null);
});

test("duplicate explicit, derived, normalized-identity and cross-namespace vocabulary IDs fail deterministically", () => {
  for (const change of [
    (s: any) => { s.article.vocabulary[1].id = s.article.vocabulary[0].id; },
    (s: any) => { s.article.vocabulary.push({ ...s.article.vocabulary[1] }); },
    (s: any) => { s.article.vocabulary.push({ ...s.article.vocabulary[1], id: "different-explicit-id", term: " BASELINE " }); },
    (s: any) => { s.article.vocabulary[0].id = adaptUpstream(s).articles[0].vocabulary[1].id; },
  ]) {
    const source = fixture(); change(source);
    assert.throws(() => parseContent(source), /Duplicate upstream vocabulary/);
  }
});

test("explicit vocabulary and rich analysis references require real records and actual vocabulary occurrence", () => {
  for (const change of [
    (s: any) => { s.article.vocabulary[0].segment_id = "missing"; },
    (s: any) => { s.article.vocabulary[0].segment_id = "judgment"; },
    (s: any) => { s.article.analysis.claims[0].evidence_ids = ["missing"]; },
    (s: any) => { s.article.analysis.evidence[0].segment_ids = ["missing"]; },
    (s: any) => { s.article.analysis.evidence.push(s.article.analysis.evidence[0]); },
    (s: any) => { s.article.analysis.claims.push(s.article.analysis.claims[0]); },
    (s: any) => { s.article.analysis.evidence[0].source_url = "https://user:secret@example.com/path"; },
    (s: any) => { s.article.url = "javascript:alert(1)"; },
  ]) { const source = fixture(); change(source); assert.throws(() => parseContent(source)); }
});

test("summary_only is a bounded original-paraphrase declaration, never permission for third-party full text", () => {
  const source = fixture();
  source.rights = {
    rights: "summary_only", copyright: "The original publisher retains all rights.",
    permission_note: "Only original paraphrase and independent analysis are included. No license or full-text permission is claimed.",
  };
  source.article.meta.content_origin = "third_party_paraphrase";
  const accepted = parseContent(source);
  assert.equal(accepted.articles[0].source.rights, "summary_only");
  assert.equal(accepted.articles[0].source.copyright, source.rights.copyright);
  for (const change of [
    (s: any) => { delete s.article.meta; },
    (s: any) => { s.article.meta.content_origin = "original"; },
    (s: any) => { s.article.meta.source_url = "https://example.com/different-source"; },
    (s: any) => { s.article.copyright_mode = "full_text"; },
    (s: any) => { s.article.segments[0].type = "quotation"; },
    (s: any) => { s.rights.copyright = ""; },
    (s: any) => { delete s.rights.permission_note; },
  ]) { const copy = structuredClone(source); change(copy); assert.throws(() => parseContent(copy)); }
  for (const change of [
    (a: any) => { delete a.upstream_snapshot; },
    (a: any) => { a.segments[0].en = "Unrelated replacement text."; },
    (a: any) => { a.source.url = "https://example.com/unrelated"; },
  ]) { const copy = structuredClone(accepted); change(copy.articles[0]); assert.throws(() => parseContent(copy), /summary_only/); }
});

test("extensions are JSON-only, bounded, and retain nested values without reinterpretation", () => {
  const extension = { scalar: 3, nested: { blank: "  ", false: false, null: null, array: [{ en: " hello " }, 1] } };
  assert.deepEqual(extensionsSchema.parse(extension), extension);
  for (const invalid of [
    { absent: undefined }, { not_json: new Date() }, { not_finite: Infinity },
    { long: "x".repeat(20001) }, { large: Array.from({ length: 1001 }, () => 1) },
    Object.fromEntries(Array.from({ length: 101 }, (_, i) => [`k${i}`, i])),
    { bytes: Array.from({ length: 5 }, () => "中".repeat(5000)) },
    JSON.parse('{"unsafe":{"__proto__":{"x":1}}}'),
  ]) assert.throws(() => extensionsSchema.parse(invalid));
  let deep: any = "value";
  for (let i = 0; i < 10; i++) deep = { deep };
  assert.throws(() => extensionsSchema.parse(deep));
});

test("rich source survives import/export/reimport and source contract errors are atomic", () => {
  const db = openDatabase(":memory:");
  try {
    const store = new Store(db), source = fixture();
    store.import(source);
    const exported = store.export();
    store.import(exported);
    assert.deepEqual(store.export(), exported);
    assert.deepEqual(store.article(source.article.id).upstream_snapshot, source.article);
    const rejected = fixture(); rejected.revision = 2; rejected.article.analysis.unrecognized = "would be lost";
    assert.throws(() => store.import(rejected));
    assert.deepEqual(store.export(), exported);
  } finally { db.close(); }
});

test("direct ChatGPT schema validates authoring data but unwrapped content is not an authorized import", () => {
  const article = fixture().article;
  assert.deepEqual(upstreamSchema.parse(article), article);
  assert.throws(() => parseContent(article));
});

test("generated extension input schema remains a JSON object after raw prevalidation", async () => {
  const { z } = await import("zod");
  const schema = z.toJSONSchema(extensionsSchema, { io: "input" });
  assert.equal(schema.type, "object");
  assert.ok(schema.additionalProperties && typeof schema.additionalProperties === "object");
  assert.ok(schema.propertyNames && typeof schema.propertyNames === "object");
  assert.ok(schema.$defs && Object.keys(schema.$defs).length > 0);
});
