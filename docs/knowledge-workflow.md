# ChatGPT → GitHub content archive → optional local index

The current goal is a stable GitHub content archive. The existing reader, SQLite, vocabulary review and architecture remain intact. No public deployment, account system, cross-device access, scraper, scheduled collection or ChatGPT prompt change is part of this work.

ChatGPT supplies reviewed bilingual content; `content/articles/` preserves JSON and readable Markdown; Git records accepted changes. SQLite is an optional local index and private learning store. There is no real a16z article in this repository yet. Wait for the first formal daily output before claiming production compatibility.

## Standard input and safe workflow

1. Keep the complete generated article unchanged. The current observed `schema_version: "1.0.0"` producer shape is primary; the earlier `1.0` example remains supported. See [the import contract](import-schema.md), `schema/chatgpt-article.v1.0.0.schema.json` and the fully synthetic `fixtures/synthetic-upstream-1.0.0.json`. The producer schema attachment itself has not been recovered, so local compatibility limits are not claimed as upstream requirements.
2. Keep local review metadata separate: `revision`, explicit `rights`, optional translated title/extensions. Run `npm run content:prepare -- raw-article.json local-review.json new-wrapper.json`; it selects `format:"chatgpt-upstream-1.0.0"` or the legacy wrapper and leaves the producer file untouched. Do not infer a license from `copyright_mode`. For unlicensed third-party sources use only original summaries/paraphrases and independent analysis with `summary_only` and the source URL; legacy `1.0` also requires its existing matching provenance metadata. The adapter deliberately does not accept a full-text or quotation mode. Any limited excerpts must be separately reviewed for copyright compliance; labels cannot verify what text was actually copied. Do not relabel a copied full article as a paraphrase. Keep author, publication date, original URL, copyright notice and permission note.
3. Validate, then stage a review copy without changing the accepted archive or SQLite:

```sh
npm run content:validate -- fixtures/synthetic-upstream-1.0.0.json
npm run content:stage -- fixtures/synthetic-upstream-1.0.0.json
```

Staging prints an ignored directory containing `articles/` and review instructions. No commit, push, import, collection or network call occurs. Staging refuses to replace an existing destination. Source content is plain text; Markdown escapes prose and exposes complete source provenance, including the unchanged source JSON values. It is a derived reading view, not the original response Markdown bytes. Still use safe Markdown renderers downstream.

4. After reviewing the entire output and publication rights, accept the reviewed input through the safe archive command. Do not manually copy pairs over existing files:

```sh
npm run content:archive -- reviewed-daily-article.json
```

This command writes local files only. First acceptance produces:

```text
content/articles/YYYY-MM-DD/<readable-id>--<full-sha256-of-id>/r0000000001/article.json
content/articles/YYYY-MM-DD/<readable-id>--<full-sha256-of-id>/r0000000001/article.md
```

The date is the first accepted revision's publication date. Later corrections keep this history directory even if the publication date is corrected. The latest actual `published_at` remains in each JSON and is used for date queries. Same-day different articles have separate identities and paths. The full identity hash and bounded prefix avoid case-fold, punctuation and long-ID filename collisions.

5. An identical same-ID, same-revision payload is a true no-op, including when JSON object keys are reordered. Arrays and source string whitespace remain significant. A content change requires a higher revision plus explicit update authorization:

```sh
npm run content:archive -- reviewed-revision.json --update
```

Existing pairs are never overwritten. A new immutable revision directory is added; older revisions cannot replace newer content. IDs are exact, case-sensitive upstream article identities. Deduplication is by ID and revision, not fuzzy title matching or URL matching: two IDs for the same URL are different articles. Keep the ID stable upstream; do not mint a new ID just to avoid a revision conflict.

6. Review every changed file and make an authorized normal Git commit/push:

```sh
git status --short
git diff -- content/articles
git add content/articles
git diff --cached -- content/articles
git commit -m "Archive reviewed article <stable-id> revision <n>"
# git push only when publication is authorized
```

A local acceptance is not a Git commit or a remote backup. Each accepted addition/correction should have its own reviewable Git change. A Git clone plus the archive can reconstruct the content index; private progress is separate. Never add credentials, `.staging/`, `data/`, SQLite, private learning state or raw personal conversations. Do not edit/delete old revision files to make a validation error disappear. Git history records deliberate maintenance.

7. Optionally rebuild/query the local index:

```sh
npm run content:import
npm run content:query -- --from 2026-10-01 --to 2026-10-31
npm run content:query -- experiment --topic Learning
```

The importer validates every historical JSON/Markdown pair and rejects missing/orphaned/tampered pairs, wrong paths, duplicate revisions and symlinks before opening SQLite. It selects the highest valid revision per ID and imports all selected articles in one transaction. Existing root-level legacy pairs remain supported and must match the deterministic Markdown renderer. Removing a file does not delete a previously imported SQLite article. Search covers source text, bilingual segments, analysis, vocabulary, dates and metadata. Date filters use publication date; all date values can also be found by text search.

## Filesystem reliability and recovery

- Each JSON/Markdown pair is fully written and fsynced in a temporary directory, then published by one same-filesystem directory rename. Readers never accept half a published pair. Exact serialized limits are 5 MiB JSON and 20 MiB Markdown per article revision; oversized output fails before any publication.
- The full batch is validated and conflict-checked before publication. Ordinary caught write failures remove only newly created revision directories; existing history is unchanged. Private learning state is not accessed during acceptance.
- An exclusive `.archive.lock` directory serializes cooperating archive writers. A lock after interruption is never automatically broken. Confirm that no writer is running, review `.pending-*` work and complete revision directories, then manually remove only the stale lock/pending work before retrying. A hard process kill or power failure can leave a subset of complete batch revisions; retrying the same input is safe and finishes the missing ones. Batch-wide crash atomicity is not claimed.
- Readers ignore uncommitted `.pending-*` directories. They validate only complete published pairs. Directory trees and files must not be symlinks. Use a trusted private checkout: the tool does not claim protection against a hostile process concurrently renaming filesystem ancestors. Do not use a shared attacker-writable archive directory.

## First formal daily article

When the actual JSON/Markdown attachments arrive, preserve and review them in full. Validate the observed shape, inspect any mismatch and adjust the downstream adapter to the producer before acceptance. Do not rewrite the producer to satisfy the old reader contract. Extra upstream fields already survive in the source snapshot; incompatible known fields still require an explicit compatibility decision. Never silently trim an unknown section, infer missing paragraph links, or flatten deep analysis into a single summary to make import pass. Domain-opportunity research remains separate from learning JSON. A `1.0` → `1.0.0` change under an existing ID needs a higher revision and `--update`, preserving all history and private learning state. Only after that compatibility and rights review should the first real article be accepted and committed.

## Backup boundary

Git history protects committed knowledge content; a verified push makes that content available in the repository. It never substitutes for private learning-state backups. Use `npm run backup -- /private/backup.sqlite` for a consistent SQLite backup. Repository clones and source exports cannot restore review history.
