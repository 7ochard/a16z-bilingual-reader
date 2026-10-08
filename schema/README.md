# JSON Schemas

Generated from the authoritative Zod input validators by `npm run schema:generate`:

- `reader-import.schema.json`: internal provisional batch envelope
- `observed-upstream-wrapper.schema.json`: rights-aware wrapper for the actually observed simplified ChatGPT example

These are machine-readable structural schemas, not a claim about a complete upstream formal specification. JSON Schema alone does not encode custom calendar validity, duplicate ID/order checks, vocabulary-to-segment cross-references, source URL credential/protocol restrictions, source revision conflicts, rights truthfulness or transaction rules. Always run the app validator (`npm run content:validate -- file.json`) before acceptance/import.
