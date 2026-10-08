# Reviewed content archive

Only reviewed source content belongs under `articles/`. JSON is authoritative; each revision has a deterministic Markdown companion. Use `npm run content:archive -- reviewed-input.json` (add `--update` for an explicit higher revision) rather than overwriting files manually. Then review and commit the Git diff under the user's publication authorization.

New articles use publication-date / collision-resistant identity / revision directories. Existing root-level legacy pairs remain readable. All revision pairs are verified before the latest revision per ID enters the optional SQLite index.

The current checked-in article is original synthetic development content. No formal daily a16z article has been accepted. Never place user learning state, credentials or raw private conversations here.

See [the workflow](../docs/knowledge-workflow.md) and [the standard import contract](../docs/import-schema.md).
