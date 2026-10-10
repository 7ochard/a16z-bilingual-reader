# Upstream-first ChatGPT import contracts

The primary producer format is the observed **`schema_version: "1.0.0"`** described below. The earlier `1.0` sample remains a separately supported legacy adapter. Local reader fields and import wrappers are implementation details; the producer does not need to rewrite its content to match them.

## Current upstream 1.0.0

This adapter follows the visible producer contract, not a recovered official JSON Schema attachment. The actual attachment, its `required` list, source child schema and array item types (including authors) were not available for verification. The generated schema documents this repository's observed-shape compatibility and local acceptance limits; it must not be described as the producer's official validator. No formal article has been imported. All fixtures are original synthetic text.

Observed fields: `schema_version`, stable `id`, object `source`, `title`, ordered array `author`, `published_at`, `selected_at`, `url`, `topics`, `selection_reason`, ordered `{id,en,zh}` segments, `analysis`, `vocabulary`, and `copyright_mode: "original_summary_only"`. There is no required segment `type`, `title_zh`, invented pronunciation, or invented source child field.

Analysis retains `core_thesis`, `supporting_evidence`, `industry_significance`, `limitations`, and `independent_judgment`. The three middle list fields remain arrays in the original snapshot. Their item types were not established, so bounded JSON items, including richer objects, are preserved. Source child fields and additional producer fields at article, segment, analysis and vocabulary levels are retained without reinterpretation. Optional producer `meta` is retained as opaque JSON. Domain-opportunity research remains a separate deliverable and is not added to learning JSON by this adapter.

The complete wrapped example is [`fixtures/synthetic-upstream-1.0.0.json`](../fixtures/synthetic-upstream-1.0.0.json), with three synthetic bilingual segments, two authors, twelve vocabulary entries, rich analysis objects, extra fields and a null phonetic. Prefer the versioned schemas:

- [`schema/chatgpt-article.v1.0.0.schema.json`](../schema/chatgpt-article.v1.0.0.schema.json): direct producer shape accepted by this adapter
- [`schema/upstream-wrapper.v1.0.0.schema.json`](../schema/upstream-wrapper.v1.0.0.schema.json): local review/import envelope

### Local review without producer changes

Keep the upstream JSON untouched. Put local acceptance metadata in a separate `local-review.json` object containing `revision`, `rights:{rights,copyright,permission_note}`, and optional `title_zh` or `extensions`. Do not put `article` or `format` overrides in that file. For example, a synthetic test review can declare `rights:"summary_only"` and explicitly say that the material is original synthetic summaries and analysis, with no third-party full-text permission claimed. Real content needs its own truthful, reviewed declarations.

```sh
npm run content:prepare -- raw-article.json local-review.json new-review-wrapper.json
npm run content:validate -- new-review-wrapper.json
npm run content:stage -- new-review-wrapper.json
# Only after review and acceptance:
npm run content:archive -- new-review-wrapper.json
```

Preparation chooses `format:"chatgpt-upstream-1.0.0"` for current articles or the legacy format for `1.0`, validates before writing, refuses to overwrite an existing output, and leaves raw input JSON values unchanged. It does not accept an article, touch SQLite, fetch anything, commit or push. Its output is a local wrapper, not a new producer contract. The existing import dialog likewise accepts a raw article and gathers explicit rights/revision locally.

The summary marker is a content declaration, **not a license or import authorization**. The wrapper still requires explicit rights, copyright attribution and a permission note. Current `summary_only` accepts the producer's `original_summary_only` mode plus its original URL; it does not require adding legacy `meta` fields. Reader segments must match that snapshot, with the same IDs, count and original bilingual text apart from surrounding display whitespace. Full-text copyright modes remain rejected. These are checks on declarations and consistency, not a legal or copying detector.

### Lossless original values, normalized reading view

- `upstream_snapshot` is the complete validated original JSON object, including unknown supplied fields, array order, empty/null values and source whitespace. It survives archive JSON, SQLite export/reimport and the Markdown provenance appendix. Serialization whitespace, original object-key order and original response Markdown bytes are not promised. Markdown is generated from the preserved JSON; it is not a recovered original Markdown attachment.
- All authors are joined in their supplied order for the existing reader. Because author item schemas were not recovered, bounded JSON author items are accepted: strings are displayed directly; objects use a supplied nonblank `name` string when present, otherwise their complete JSON representation. Nested author metadata remains exact in the snapshot. An empty author array displays “未提供作者”; the snapshot remains empty. `source.name` is used for display only when it is a suitable supplied string, otherwise the original URL hostname is shown. No source child field is required or invented.
- `core_thesis` projects to `summary_zh`; each evidence entry projects separately to `key_points`; every significance item and the independent judgment project to `discussion`; limitation items project to `limitations` with separators. Structured entries use their complete JSON representation for the existing text-only UI. Nothing is reduced to a new short summary. The original rich arrays and any additional analysis remain authoritative in the snapshot and Markdown appendix.
- Missing, empty or null phonetics remain unchanged upstream and are omitted from display. No pronunciation is generated. Vocabulary IDs use the existing deterministic identity algorithm and paragraph links are never inferred.
- Local safety limits include a 5 MiB upstream object, depth 16, 100,000 visited values, 1,000 keys per object, 2,000 array entries and 20,000-character strings; unsafe prototype keys and non-JSON values are rejected before parsing. Opaque source/meta, the author list and each analysis list have the tighter bounded-JSON checks described below (64 KiB, depth 8). Core field/date/ID/reference limits are local acceptance limits, not claims about the unavailable upstream attachment.

Stable supplied article IDs remain identity keys; `selected_at` is never used to mint a duplicate daily article. A legacy `1.0` article changing to `1.0.0` under the same ID is a content revision, requiring an increased `revision` and explicit archive `--update`. Old archive pairs remain unchanged, the original publication-date directory stays anchored, and SQLite read/favorite state, saved contexts and FSRS progress remain intact. Do not assign a fresh ID to evade a same-revision conflict.

## Legacy observed 1.0 compatibility


The legacy adapter freezes the **observed ChatGPT `schema_version: "1.0"` core**, with explicitly declared optional rich-analysis and metadata fields. It does not claim compatibility with an unseen universal ChatGPT schema. The original simple wrapper remains valid. The complete synthetic daily example is [`fixtures/synthetic-daily-article.json`](../fixtures/synthetic-daily-article.json): three bilingual segments, twelve vocabulary entries, linked claims/evidence, limitations and independent judgment. All its writing is synthetic; it contains no real a16z article text.

The machine-enforced contract lives in `server/schema.ts`; exported types live in `shared/types.ts`. Legacy objects and local wrappers reject undeclared fields; current 1.0.0 producer extras are preserved as described above. Use the documented `extensions` object for additional JSON; never depend on an unknown field being discarded.

## Entry points and schema files

The legacy archive/import envelope remains:

```json
{
  "format": "chatgpt-observed-1.0",
  "revision": 1,
  "rights": {
    "rights": "owned",
    "copyright": "Original synthetic writing.",
    "permission_note": "The supplied material was written for this project."
  },
  "title_zh": "Optional translated title",
  "article": { "schema_version": "1.0", "...": "See the complete fixture" }
}
```

This abbreviated illustration is not valid article data. `title_zh` and wrapper `extensions` are optional. `revision` is a positive integer up to 2,147,483,647. The wrapper requires its rights declaration: `copyright_mode` alone is not evidence of permission. A raw article can be validated against the direct authoring schema but cannot be imported without a wrapper and revision.

Frozen structural JSON Schema files:

- [`schema/chatgpt-article.v1.0.schema.json`](../schema/chatgpt-article.v1.0.schema.json): direct ChatGPT article object, suitable for authoring/producer validation
- [`schema/observed-upstream-wrapper.v1.0.schema.json`](../schema/observed-upstream-wrapper.v1.0.schema.json): import wrapper with revision and rights
- [`schema/reader-import.v1.0.schema.json`](../schema/reader-import.v1.0.schema.json): internal reader batch

The corresponding unversioned filenames are compatibility aliases. Regenerate all versioned files and legacy aliases using `npm run schema:generate`. Tests compare the committed files with the validators. JSON Schema describes structure; runtime validation additionally enforces real calendar dates, HTTP(S) URLs without credentials, reference integrity, occurrence checks, duplicate identities, bounded extensions, and `summary_only` restrictions.

## Required direct article core

The required observed core has not changed:

- `schema_version`: exactly `"1.0"`
- `id`: stable article ID, 1–120 ASCII characters; first character alphanumeric, remaining characters letters, digits, `_`, `.`, `:`, `-`
- `source`, `title`, `author`: nonblank source strings, at most 200, 500, and 200 characters respectively
- `published_at`, `selected_at`: real calendar dates formatted `YYYY-MM-DD`
- `url`: original source HTTP(S) URL, at most 2,000 characters, without username/password
- `topics`: 1–20 nonblank strings, each at most 100 characters
- `selection_reason`: nonblank string, at most 2,000 characters
- `segments`: 1–1,000 objects, each `{id, en, zh, type:"paraphrase"}`; IDs must be unique and bilingual text nonblank, at most 20,000 characters per language
- `analysis`: required `summary` (nonblank, at most 10,000 characters), `key_findings` (0–30 nonblank strings, at most 3,000 each), and `limitations` (at most 10,000 characters; may be empty)
- `vocabulary`: 0–2,000 objects, described below
- `copyright_mode`: exactly `"bilingual_paraphrase"`

Optional top-level fields are `meta` and `extensions`. Segment order is the array order; no segments are added, translated, or inferred.

## Rich analysis, with explicit references

The following optional analysis fields are part of this archive contract. They may be omitted by the original simple producer.

- `claims`: up to 100 objects `{id, statement, evidence_ids?, extensions?}`. `statement` is nonblank, at most 10,000 characters. `evidence_ids` contains up to 100 IDs of evidence records in the same analysis.
- `evidence`: up to 100 objects `{id, description, source_url?, segment_ids?, kind?, extensions?}`. `description` is nonblank, at most 10,000 characters. `source_url` follows the source URL rules. `segment_ids` contains up to 100 IDs of real article segments. `kind` is `reported`, `observation`, `inference`, or `synthetic`.
- `industry_implications`: up to 50 nonblank strings, each at most 10,000 characters
- `independent_judgment`: nonblank string, at most 20,000 characters
- `discussion`: up to 30 nonblank strings, each at most 3,000 characters
- `extensions`: additional bounded JSON

Claim and evidence IDs must each be unique within their respective collections. Unresolved evidence/segment references reject the entire import. These references express what the producer supplied; they do not certify that a claim is true. Use distinct claims and evidence descriptions to preserve uncertainty, counterevidence, and independent judgment. Additional bilingual reasoning, structured limitations, methodology, or confidence data belongs in named extension keys rather than undeclared fields.

## Vocabulary identity and context

The required observed vocabulary fields remain `term`, `part_of_speech`, `meaning_zh`, `example_en`, and `example_zh`. Optional fields are `id`, `segment_id`, `meaning_en`, `phonetic`, and `extensions`.

Bounds: term/part of speech/phonetic at most 200 characters; meanings at most 2,000; examples at most 20,000. Required strings must contain non-whitespace text. `phonetic` may be missing, empty, or whitespace-only. Its original value stays in the snapshot; empty phonetics are omitted from the reader projection.

Identity and association rules:

1. A supplied `id` is retained exactly and must follow the same ID syntax as article IDs.
2. Otherwise, the derived ID is `up-` plus the first 24 hex digits of SHA-256 over the JSON string array `[term, part_of_speech, example_en]`, each NFKC-normalized, trimmed, whitespace-collapsed, and lowercased with `en-US`. Array position is not included. Reordering the vocabulary list cannot change IDs. Changing an identity field can change a derived ID; supply explicit IDs when that continuity matters.
3. Duplicate effective IDs, including collisions between explicit and derived IDs, are rejected. Duplicate normalized identities are rejected even if different explicit IDs are supplied. Different senses may use different supplied examples.
4. Missing or null `segment_id` always stays null. A word appearing once in a paragraph does **not** cause an inferred association.
5. An explicit non-null `segment_id` must identify a real segment, and the term must occur in that segment's English text using normalized Unicode-aware whole-word/phrase matching. No substring matching such as `AI` inside `maintain`.
6. Article-level entries preserve their supplied bilingual examples. They do not cause synthetic paragraphs to be invented. Saving such a word requires its `vocabulary_id` and stores `context_kind:"supplied_example"`; it is never described as a source quotation.

## Provenance metadata and extensions

Optional `meta` is a strict object with these optional fields:

- `content_origin`: `synthetic`, `original`, or `third_party_paraphrase`
- `source_url`: original HTTP(S) source URL without credentials
- `generated_at`: ISO 8601 timestamp with UTC or an explicit offset
- `generator`: nonblank text, at most 200 characters
- `prompt_version`, `source_language`: nonblank text, at most 100 characters each
- `notes`: up to 30 nonblank strings, at most 3,000 characters each
- `extensions`: additional bounded JSON

`extensions` is supported at wrapper, article, rights/source, meta, analysis, segment, vocabulary, claim, and evidence levels. It is a JSON object, retained without coercing scalars or trimming strings. Each extension object has a maximum serialized size of 64 KiB (UTF-8), a maximum nesting depth of 8 (root at zero), and at most 5,000 visited values including the root. Any object has at most 100 keys; arrays at most 1,000 items; strings at most 20,000 characters. Keys are nonempty and at most 120 characters. The keys `__proto__`, `prototype`, and `constructor` are rejected at every depth before parsing can discard them. Non-JSON values, non-finite numbers, and cycles are rejected.

The extension namespace intentionally allows producer-specific fields. Importers do not execute it or interpret it as permissions, HTML, scripts, instructions, or proof of copyright. Declared core fields cannot be overridden by an extension. Structural JSON Schema permits JSON extension values; runtime validation enforces these extra resource/security limits.

## Rights and third-party summaries

Every wrapper requires `rights:{rights,copyright,permission_note}`. `copyright` and `permission_note` are nonblank, at most 1,000 characters each, and are retained as supplied. Optional rights `extensions` also survives import.

Accepted rights categories are:

- `owned`, `licensed`, `public_domain`, `permission_granted`: explicit declarations about the imported material; the note must explain the basis
- `summary_only`: original paraphrase and analysis about a third-party source, with the original publisher's copyright preserved. This does **not** claim a license, permission to reproduce full text, or ownership of the publisher's article.

For the legacy `1.0` adapter's `summary_only`, the upstream `meta.content_origin` must be `third_party_paraphrase`, and `meta.source_url` must exactly match the article's original `url`. The normal `bilingual_paraphrase` and segment `paraphrase` restrictions still apply. Keep the original copyright attribution in `rights.copyright` and explicitly explain in `permission_note` that the imported material is independently written paraphrase/analysis with no full-text permission claimed.

The internal reader form additionally requires a matching `upstream_snapshot`, including article ID and original source URL; legacy `1.0` also requires that provenance metadata. Reader segments must correspond exactly to the snapshot's paraphrases (apart from projected leading/trailing whitespace), with the same segment count and IDs; their kind must be `paragraph`. An unrelated snapshot cannot authorize replacement body text. Removing the snapshot or relabeling segments as quotes fails validation.

The validator does not fetch URLs, determine whether actual prose is copied, establish a legal right, or verify permission claims. A declaration cannot convert copied third-party full text into a lawful paraphrase. Third-party full text is outside this observed contract; `full_text`, `quotation`, and alternate copyright modes fail validation. Treat summary-only content as independently written summaries and analysis, never as a mechanism to archive a publisher's complete article.

## Internal reader projection and lossless source retention

The existing internal marker remains unchanged for compatibility:

```json
{"contract":"bilingual-reader.provisional","schema_version":"1.0","articles":[]}
```

The example shows only the marker; a valid import has 1–100 complete articles. Existing reader fields remain `id`, `revision`, `title`, `title_zh`, `author`, `published_at`, `topics`, `source`, `summary`, `segments`, `vocabulary`, and `analysis`. Segment IDs and integer orders must be unique. Articles without an upstream snapshot remain supported for the other rights categories.

The adapter preserves the entire validated direct source object in `upstream_snapshot`. Source strings are never trimmed or rewritten there, including whitespace and empty optional strings. This is exact JSON-value preservation, not preservation of serialization bytes, indentation, or object-key ordering. The source archive retains its own source JSON; consumers must not treat a normalized reader projection as the original producer file.

Reader display fields can trim leading/trailing whitespace. `title_zh` uses the supplied wrapper title, falling back to the original title without machine translation. Array position defines paragraph order. Required analysis core maps to `summary_zh`, `key_points`, `limitations`; optional rich analysis and supplied discussion are retained. `meta`, article and nested `extensions` are retained in the projection as well as the snapshot. Wrapper extensions survive under `Article.upstream_wrapper_extensions`, and the exact supplied wrapper `title_zh` survives under `Article.upstream_title_zh` (when provided), so both survive SQLite export/reimport. The internal batch envelope itself has no arbitrary extension slot.

The exact source snapshot is authoritative for original producer content. Reader JSON retains every supported field for querying or future projections. Markdown is a derived reading view; structured JSON remains authoritative for exact nested extension values and metadata.

## Validation, revision and import semantics

```sh
npm run content:validate -- fixtures/synthetic-daily-article.json
npm run adapt -- fixtures/synthetic-daily-article.json /tmp/reader-adapted.json
```

Validation never fetches or translates source URLs. Unknown schema versions, undeclared keys, duplicate IDs, invalid dates, broken references and unsupported rights reject the input before writes. The HTTP body limit remains 5 MB. Keep extensions and batches within their resource bounds.

Stable article IDs identify source entities; increase `revision` when the source changes. Identical validated content is safe to reimport; changed content at the same revision conflicts; older revisions cannot overwrite newer ones. Arrays retain order. Upstream whitespace is preserved and therefore counts as source content when comparing revisions. Exact producer object key ordering is not a durable identity guarantee; archive tooling compares content canonically.

All database article writes in an import are transactional. Errors leave the previous library unchanged. Source reimport never deletes absent articles or overwrites personal read/favorite flags, saved word/context snapshots, cards, or review events. Export contains source content, not a full learning-state backup; use SQLite backup for complete recovery.

Future required-field or semantic changes need a new explicit contract version/adapter. Database migrations and FSRS serialized-card compatibility remain separate from the source contract. The frozen core and original simple fixture stay covered by regression tests.
