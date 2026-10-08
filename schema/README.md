# Versioned JSON Schemas

Generated from the authoritative Zod input validators with `npm run schema:generate`:

- `chatgpt-article.v1.0.schema.json`: frozen observed ChatGPT article core plus explicit optional rich-analysis/provenance/extension fields
- `observed-upstream-wrapper.v1.0.schema.json`: rights-aware import wrapper with revision and the full article
- `reader-import.v1.0.schema.json`: existing internal reader batch marker, retained for compatibility

Each has an identical unversioned `.schema.json` compatibility alias. The complete synthetic wrapped example is `fixtures/synthetic-daily-article.json`; no real article has been accepted. The direct article schema validates the producer's article shape, but raw unwrapped articles are not accepted by the importer because they lack the explicit rights/revision envelope.

These are structural schemas for this observed contract, not a claim of universal ChatGPT compatibility. Runtime semantic checks also enforce real calendar dates, duplicate IDs/orders, analysis/vocabulary references, actual term occurrence for explicit vocabulary links, source URL safety, extension depth/size/unsafe keys, summary-only provenance, revision conflicts, archive paths and pair integrity. Always run `npm run content:validate -- input.json` before review/acceptance. Schemas and declarations cannot verify the truth of a permission claim or the originality of text.

See `docs/import-schema.md` for the exact standard and version-change rules.
