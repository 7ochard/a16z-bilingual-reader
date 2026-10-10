# Versioned JSON Schemas

Generated from the runtime Zod input validators with `npm run schema:generate`.

Primary observed producer format:

- `chatgpt-article.v1.0.0.schema.json`: current direct article shape, with object source, author array, rich analysis arrays and nullable phonetic
- `upstream-wrapper.v1.0.0.schema.json`: local review envelope with explicit rights and revision; the upstream article does not need rewriting

These current schemas describe local compatibility and safety bounds. The producer's original schema attachment was not recovered; its source child fields, required list and array item schemas are not claimed. Bounded extra producer fields are preserved in the snapshot rather than dropped. The complete example `fixtures/synthetic-upstream-1.0.0.json` is synthetic only.

Backward-compatible files:

- `chatgpt-article.v1.0.schema.json`: legacy reduced example plus existing optional archive extensions
- `observed-upstream-wrapper.v1.0.schema.json`: legacy rights-aware wrapper
- `reader-import.v1.0.schema.json`: existing internal reader marker, extended to retain either source version

Each legacy file keeps its unversioned alias; these aliases are not silently retargeted to the new producer shape. Old direct/wrapper schemas and archived content remain unchanged. A direct producer schema validates shape; importing still requires local rights/revision metadata. `npm run content:prepare -- raw.json local-review.json new-wrapper.json` adds that metadata without changing the raw source file.

JSON Schema describes structure. Runtime semantic checks additionally enforce real dates, duplicate IDs/orders, references, term occurrence for explicit links, safe URLs, JSON size/depth/unsafe keys, summary-only body consistency, revision conflicts, archive paths and pair integrity. Declarations cannot verify permission or originality. See `docs/import-schema.md` for mapping, limits and migration rules.
