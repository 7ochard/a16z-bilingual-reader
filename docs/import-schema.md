# Provisional import contract

The exact upstream `schema_version: "1.0"` definition was not supplied when this MVP began. This app therefore requires an explicit marker that prevents accidental acceptance of a different schema merely because it shares the version string:

```json
{"contract":"bilingual-reader.provisional","schema_version":"1.0","articles":["see fixtures/synthetic-library.json for complete Article objects"]}
```

The above illustrates the envelope only; the fixture is the actual valid example. Machine-enforced types and bounds live in `server/schema.ts`; TypeScript types are in `shared/types.ts`. Generated structural JSON Schemas are in `schema/`; regenerate with `npm run schema:generate`. Cross-record and semantic rules still require the app validator. No claim of full upstream compatibility is made.

## Article fields

- `id`: stable source ID, 1–120 characters, letters/digits followed by letters/digits/underscore/dot/colon/hyphen
- `revision`: positive integer; increase whenever source content changes
- `title`, `title_zh`, `author`, `summary`: nonempty text
- `published_at`: real calendar date, exactly YYYY-MM-DD
- `topics`: 1–20 nonempty strings
- `source`: `name`, HTTP(S) `url` without credentials, `rights`, `copyright`, `permission_note`
- `source.rights`: one of `owned`, `licensed`, `public_domain`, `permission_granted`; all require an explanatory `permission_note`
- `segments`: 1–1,000 ordered objects, each with unique `id`, unique integer `order`, `kind` (`paragraph`, `heading`, `quote`), nonempty `en` and `zh`
- `vocabulary`: 0–2,000 suggestions with unique `id`, valid `segment_id` or null for an article-level supplied example, `term`, `meaning_zh`, optional `meaning_en` and `phonetic`
- `analysis`: `summary_zh`, `key_points` string array, `discussion` string array

Unknown fields are rejected rather than silently discarded. Strings have size bounds. A batch contains 1–100 articles; the HTTP body limit is 5 MB. Foreign paragraph references, duplicate IDs/orders, malformed dates, unsupported rights and schema versions reject the whole batch.

## Import semantics

Stable article IDs identify the source entity. Reimport of the same validated payload is safe. JSON object key order is normalized by schema parsing; whitespace around text is trimmed. Array order is significant. Changed source with the same revision is a conflict (409); increase revision. Older revisions cannot overwrite newer content.

All article writes are one transaction. Any error leaves the previous library unchanged. Personal read/favorite flags, saved words, context snapshots, cards, and review events are never overwritten by source import. There is no import-time deletion of absent articles.

The import does not fetch source URLs, translate prose, check a site's license, or validate the truth of permission claims. Do not import third-party full text without permission. Export contains only the source envelope; use SQLite backup for full recovery.

## Upstream adapter and migrations

Once the real upstream specification/sample is available, add an explicit source adapter that maps source IDs, segment order/alignment, vocabulary relations, analysis and rights metadata to this internal representation. Reject lossy or ambiguous cases, test synthetic fixtures that match the observed shape, and retain source version provenance. Never silently rename the accepted contract marker or call a guessed mapping verified.

Content-contract versioning and database migrations are distinct. SQLite migration hooks reject a newer `user_version`; add each future migration as a forward-only step with backup/restore tests. FSRS upgrades need serialized-card and review-log compatibility tests, not just a package bump.

## Observed ChatGPT example adapter (added during implementation)

A simplified upstream example was inspected after implementation began. Its shape is `schema_version: "1.0"`, article-level `id/source/title/author/published_at/selected_at/url/topics/selection_reason`, `segments[{id,en,zh,type:"paraphrase"}]`, `analysis{summary,key_findings,limitations}`, `vocabulary[{term,phonetic?,part_of_speech,meaning_zh,example_en,example_zh}]`, and `copyright_mode:"bilingual_paraphrase"`. This is a known example, not a complete published JSON Schema or verification of a full daily export.

A narrow adapter now accepts the wrapper in `fixtures/synthetic-upstream-wrapper.json` at the normal import endpoint (or via the UI JSON import). The wrapper contains `format:"chatgpt-observed-1.0"`, a positive `revision`, `rights:{rights,copyright,permission_note}`, and `article` containing the upstream object. Optional `title_zh` supplies a translated title; otherwise the original title is retained as a fallback, not machine-translated. Raw unwrapped upstream data is rejected because it lacks the explicit rights declaration and source revision. This is deliberate; `copyright_mode` alone is not proof of authorization.

The CLI can convert the same wrapper to the internal envelope:

```sh
npm run adapt -- fixtures/synthetic-upstream-wrapper.json /tmp/reader-adapted.json
```

The adapter derives ordered paragraph positions from array order and deterministic vocabulary IDs from index, term, and example. A unique normalized Unicode-aware whole-word/phrase match associates a word with one source paragraph; no match or multiple matches leaves `segment_id:null`. Article-level entries retain the supplied bilingual example and part of speech. Saving one requires its `vocabulary_id`, stores `context_kind:"supplied_example"`, and never labels that example as a quotation from a paragraph. Empty/missing phonetics are accepted and omitted. Suggested IDs can change if the upstream list is reordered; saved learning state has its own stable identity and is unaffected.

All original upstream fields, including selection reason, date, analysis limitations, part of speech and examples, remain in `upstream_snapshot` for provenance and future adapters. Only `bilingual_paraphrase`/`paraphrase` modes are accepted by this observed adapter. Unknown keys/versions fail loudly. The complete production schema and representative daily data remain a compatibility follow-up.
