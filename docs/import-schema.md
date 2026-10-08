# Frozen observed ChatGPT 1.0 import contract

The archive freezes the **observed ChatGPT `schema_version: "1.0"` core**, with explicitly declared optional rich-analysis and metadata fields. It does not claim compatibility with an unseen universal ChatGPT schema. The original simple wrapper remains valid. The complete synthetic daily example is [`fixtures/synthetic-daily-article.json`](../fixtures/synthetic-daily-article.json): three bilingual segments, twelve vocabulary entries, linked claims/evidence, limitations and independent judgment. All its writing is synthetic; it contains no real a16z article text.

The machine-enforced contract lives in `server/schema.ts`; exported types live in `shared/types.ts`. All objects reject undeclared fields. Use the documented `extensions` object for additional JSON; never depend on an unknown field being discarded.

## Entry points and schema files

The preferred archive/import envelope remains:

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

The corresponding unversioned filenames are compatibility aliases. Regenerate all six using `npm run schema:generate`. Tests compare the committed files with the validators. JSON Schema describes structure; runtime validation additionally enforces real calendar dates, HTTP(S) URLs without credentials, reference integrity, occurrence checks, duplicate identities, bounded extensions, and `summary_only` restrictions.

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

For `summary_only`, the upstream `meta.content_origin` must be `third_party_paraphrase`, and `meta.source_url` must exactly match the article's original `url`. The normal `bilingual_paraphrase` and segment `paraphrase` restrictions still apply. Keep the original copyright attribution in `rights.copyright` and explicitly explain in `permission_note` that the imported material is independently written paraphrase/analysis with no full-text permission claimed.

The internal reader form additionally requires a matching `upstream_snapshot`, including article ID, original source URL and that provenance metadata. Reader segments must correspond exactly to the snapshot's paraphrases (apart from projected leading/trailing whitespace), with the same segment count and IDs; their kind must be `paragraph`. An unrelated snapshot cannot authorize replacement body text. Removing the snapshot or relabeling segments as quotes fails validation.

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
