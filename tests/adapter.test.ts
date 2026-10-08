import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { adaptUpstream } from "../server/upstream-adapter.js";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
const example = () =>
  JSON.parse(
    readFileSync(
      new URL("../fixtures/synthetic-upstream-wrapper.json", import.meta.url),
      "utf8",
    ),
  );
test("observed upstream 1.0 adapter preserves original fields and derives deterministic IDs/order", () => {
  const source = example(),
    a = adaptUpstream(source),
    b = adaptUpstream(source);
  assert.deepEqual(a, b);
  assert.deepEqual(a.articles[0].upstream_snapshot, source.article);
  assert.equal(a.articles[0].segments[0].order, 0);
  assert.equal(a.articles[0].vocabulary[0].segment_id, null);
  assert.equal(a.articles[0].vocabulary[1].segment_id, null);
  assert.equal(a.articles[0].vocabulary[0].phonetic, undefined);
});
test("unlinked and ambiguous article-level vocabulary save supplied examples without invented paragraph associations", () => {
  const source = example();
  source.article.segments.push({ ...source.article.segments[0], id: "s002" });
  const db = openDatabase(":memory:");
  try {
    const store = new Store(db);
    store.import(source);
    const a = store.article(source.article.id);
    assert.equal(a.vocabulary[0].segment_id, null);
    const suggestion = a.vocabulary[1];
    const w = store.saveWord({
      article_id: a.id,
      segment_id: null,
      vocabulary_id: suggestion.id,
      term: suggestion.term,
      meaning_zh: suggestion.meaning_zh,
    });
    assert.equal(w.context_kind, "supplied_example");
    assert.equal(w.context_en, suggestion.example_en);
    assert.equal(w.segment_id, null);
    assert.equal(
      store.saveWord({
        article_id: a.id,
        segment_id: null,
        vocabulary_id: suggestion.id,
        term: suggestion.term,
        meaning_zh: suggestion.meaning_zh,
      }).id,
      w.id,
    );
    assert.throws(
      () =>
        store.saveWord({
          article_id: a.id,
          segment_id: null,
          term: "invented",
          meaning_zh: "无",
        }),
      /vocabulary_id/,
    );
  } finally {
    db.close();
  }
});
test("adapter rejects unknown schemas, unsupported fulltext modes and missing rights declaration atomically", () => {
  for (const mutate of [
    (v: any) => (v.article.schema_version = "2.0"),
    (v: any) => (v.article.copyright_mode = "full_text"),
    (v: any) => delete v.rights,
    (v: any) => v.article.segments.push(v.article.segments[0]),
  ]) {
    const source = example();
    mutate(source);
    const db = openDatabase(":memory:");
    try {
      const store = new Store(db);
      assert.throws(() => store.import(source));
      assert.equal(store.articles().length, 0);
    } finally {
      db.close();
    }
  }
});

test("only explicit links associate vocabulary; full-width and punctuation-delimited words match safely", () => {
  const source = example();
  source.article.vocabulary = [
    {
      term: "AI",
      part_of_speech: "noun",
      meaning_zh: "人工智能",
      example_en: "AI is a technology.",
      example_zh: "人工智能是一项技术。",
    },
  ];
  assert.equal(
    adaptUpstream(source).articles[0].vocabulary[0].segment_id,
    null,
  );
  source.article.vocabulary[0].segment_id = "s001";
  assert.throws(() => adaptUpstream(source), /must occur/);
  source.article.segments[0].en =
    "We consider ＡＩ, and a useful AI-based experiment.";
  assert.equal(
    adaptUpstream(source).articles[0].vocabulary[0].segment_id,
    "s001",
  );
  const db = openDatabase(":memory:");
  try {
    const store = new Store(db);
    store.import(example());
    assert.throws(
      () =>
        store.saveWord({
          article_id: example().article.id,
          segment_id: "s001",
          term: "AI",
          meaning_zh: "人工智能",
        }),
      /must occur/,
    );
  } finally {
    db.close();
  }
});
test("committed JSON Schemas stay in sync with structural Zod input validators", async () => {
  const { z } = await import("zod");
  const { batchSchema, upstreamImportSchema, upstreamSchema } = await import(
    "../server/schema.js"
  );
  for (const [name, schema] of [
    ["reader-import", batchSchema],
    ["observed-upstream-wrapper", upstreamImportSchema],
    ["chatgpt-article", upstreamSchema],
  ] as const) {
    for (const suffix of ["", ".v1.0"]) assert.deepEqual(
      JSON.parse(
        readFileSync(
          new URL(`../schema/${name}${suffix}.schema.json`, import.meta.url),
          "utf8",
        ),
      ),
      z.toJSONSchema(schema, { io: "input" }),
    );
  }
});

test("derived Markdown escapes source HTML and link/image syntax", async () => {
  const { articleMarkdown } = await import("../server/content.js");
  const article = adaptUpstream(example()).articles[0];
  article.title = "<img src=x onerror=alert(1)> [click](https://evil.example)";
  article.segments[0].en =
    "<script>danger()</script> ![track](https://evil.example/x)";
  const markdown = articleMarkdown(article);
  assert.ok(!markdown.includes("<img"));
  assert.ok(!markdown.includes("<script"));
  assert.ok(markdown.includes("&lt;script&gt;"));
  assert.ok(markdown.includes("\\!\\[track\\]"));
});
