# ChatGPT → GitHub knowledge archive → local SQLite

The intended division of work: an existing ChatGPT task collects and structures bilingual material; the reviewed JSON becomes a versioned GitHub knowledge archive; this project validates, stores, queries, and presents it. Future delivery channels can call the same content/API layer. No Feishu integration or scheduled remote collection is implemented.

## Safe, explicit workflow

1. Obtain the generated JSON. Verify the summary/paraphrase, source, permissions and bilingual alignment. Do not treat a generated copyright label as a license or publish unauthorized full text.
2. If it is the observed raw upstream example, add the explicit rights/revision wrapper described in `import-schema.md`, or use the local UI's raw-upstream import form. UI import writes only SQLite; it does not publish GitHub content.
3. Validate without changing any database or remote repository:

```sh
npm run content:validate -- fixtures/synthetic-upstream-wrapper.json
```

4. Prepare a reviewable JSON/Markdown pair in an ignored staging folder:

```sh
npm run content:stage -- fixtures/synthetic-upstream-wrapper.json
```

The command prints its staging directory, derived from a hash of the validated content. It refuses to overwrite an existing directory. It does not commit, push or import. Each JSON file is a single-article internal envelope; original upstream fields are preserved as provenance. Derived Markdown escapes imported HTML and Markdown link/image syntax so source text is not treated as trusted markup. Downstream renderers should still use safe/sanitized rendering.

5. After explicit acceptance of content and publication rights, copy the reviewed `.json`/`.md` pairs into `content/articles/`, using stable article filenames. Increase article `revision` for changed content. Review `git diff` for unexpected data, then make an authorized normal Git commit. Never copy `.staging`, `data/`, private learning state, credentials, or raw personal conversations into Git.
6. Build/rebuild the local knowledge index from the tracked archive:

```sh
npm run content:import
npm run content:query -- experiment
```

The import validates every file before applying all article updates in one SQLite transaction; duplicate article IDs across files or revision conflicts roll back the whole archive import. Existing read flags, saved context snapshots, cards and review events are retained. Removing a file from Git does not delete it from SQLite in the MVP. Query results are JSON and can feed a future delivery adapter.

## Initial repository content

`content/articles/synthetic-small-bets.json` and `.md` demonstrate the format with original synthetic text. `fixtures/` additionally includes test-only synthetic library and observed-upstream samples. No actual October 8 article or other real a16z content has been fetched, translated, imported or republished.

## Backup boundary

Git history protects accepted knowledge content after an authorized commit/push. It does not contain private learning progress. Keep consistent SQLite backups for personal state (`npm run backup -- /private/backup.sqlite`). A source JSON export or repository clone alone cannot restore review history.
