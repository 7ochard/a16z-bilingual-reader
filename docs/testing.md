# Verification

All test material is original synthetic content. No live a16z article, credentials, paid service or user learning data is used.

## Commands

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
```

If a compatible system Chromium is already installed, use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. The E2E server runs on loopback port 3101 with an in-memory database, completely separate from `data/reader.sqlite`.

## Automated coverage

The 19 Node test cases exercise:

- Whole-batch input rejection: unsupported schema, duplicate IDs/order, invalid segment reference, invalid calendar date, unsupported rights, invalid revision
- Atomic rollback on late source conflict; idempotent import; revision downgrade rejection
- Preservation of personal read/favorite state, saved context and FSRS after source replacement
- Normalized duplicate saves; saving not counted as a review
- All four ts-fsrs ratings, stored logs, replayed event IDs, conflicting ID reuse, stale revision, not-yet-due rejection
- Forced database write failure rolling back both a review event and card
- Durable reopen, consistent SQLite backup and restored card/favorite state
- Forward migration v1→v2 with existing cards/review events; refusal of a newer DB schema
- HTTP security headers, malicious Host/Origin rejection, required mutation header, malformed JSON/input, filters and not-found behavior
- Observed-upstream mapping, source-provenance preservation, missing/empty phonetics, article-level examples, ambiguous matches, whole-word Unicode matching (AI must not match maintain), rejection of unsupported full-text modes and missing rights
- Multi-file knowledge import validating everything first and atomically rolling back conflicts

Browser tests run the same four flows at desktop 1440×1000 and mobile 375×812:

1. English/Chinese/bilingual reading, manual paragraph save with blank optional fields, read/favorite persistence, reveal and review, library search
2. Invalid file recovery, raw-upstream rights form, article-level supplied example, analysis limitations
3. Selected-text save dialog, Cancel/Escape, Back navigation, refresh, absence of unintended saves
4. Hostile HTML-looking text displayed literally without script/image/event-handler execution

Screenshots and traces are generated under ignored `test-results/`. No test browser state is committed.

## Executed results (2026-10-08 UTC)

- TypeScript: passed
- Node unit/API/integration tests: 19/19 passed
- Synthetic validate/stage/import CLI workflow: passed
- Independent acceptance review: 20 additional scenario groups passed across API/store security, process restart/backup/restore, and archive privacy/atomicity
- Dependency audit after upgrading Vite/Playwright and removing an unnecessary dev runner: 0 reported vulnerabilities
- Production build: passed after the documented tree-shaking workaround
- Local browser attempt: 8 cases authored; 0 browser flows exercised locally. Chromium failed before launch because the authoring environment denied its singleton Unix socket. Default and approved escalated launches both failed.
- GitHub Actions browser verification: **8/8 passed** in Chromium (4 desktop + 4 mobile cases; 8.9 seconds), closing the local execution gap. This is automated functional browser verification, not a manual screenshot or visual-design review.

### Published CI evidence

[Check run 37726034804](https://github.com/7ochard/a16z-bilingual-reader/actions/runs/37726034804) completed successfully on 2026-10-08 at 04:09:16 UTC for code commit [`21471c9a4a53dd924f97f629d10e840344840b2e`](https://github.com/7ochard/a16z-bilingual-reader/commit/21471c9a4a53dd924f97f629d10e840344840b2e).

The standard `ubuntu-latest` / Node.js 24 workflow completed `npm ci`, `npm run check` (TypeScript, **19/19 Node tests**, and production build), Chromium installation with dependencies, and `npm run test:e2e` (**8/8 browser tests**). The authenticated job log reports `tests 19`, `pass 19`, `fail 0`, and `8 passed (8.9s)`. No secrets, deployment, paid runner configuration, or real a16z content were needed. The result above is tied to that exact code revision; later commits run the same workflow on push and should be checked against their own head SHA.

These checks cover the MVP, not a complete security audit, accessibility certification, real a16z data quality review, or a deployed cross-device service. The observed upstream sample is a simplified example; full daily-export compatibility remains unverified.

## Build compatibility note

In the tested Vite/Rollup/React toolchain, Rollup tree shaking entered a CPU-bound nonterminating analysis after modules parsed. `vite.config.ts` disables only tree shaking as an explicit MVP workaround. JSX processing, production minification, asset hashing and security checks remain enabled. This trades a somewhat larger bundle for a reproducible build. The measured release JS is 227.95 kB (71.88 kB gzip), CSS 41.75 kB (9.68 kB gzip), with a 735 ms build on the verification machine. Re-enable tree shaking only after a dependency upgrade passes both the build and browser regression suite.

## Content-archive stabilization verification (2026-10-08 UTC)

This change is limited to the import contract and stable GitHub content archive. The existing React/SQLite architecture, source-only export, FSRS, Node 24 runtime and Vite tree-shaking workaround are retained. Dependencies are unchanged.

- Aggregate `npm run check`: TypeScript, 42/42 Node/API/archive/import tests and production build passed.
- New coverage includes immutable per-date/per-ID revision pairs; same-day distinct IDs; canonical idempotency; explicit revision updates; publication-date corrections; whole-batch preflight; runtime rollback; maximum-length/case/punctuation-safe IDs; traversal/symlink/lock rejection; orphaned, missing and modified Markdown; oversized-output preflight; latest-revision SQLite import; date/deep-content queries; complete rich analysis/provenance/extension roundtrips; unsafe extension-key rejection; explicit vocabulary associations; summary-only declarations.
- Independent read-only review additionally exercised 17 filesystem scenario groups and 8 rich-contract groups, including injected Markdown-write failure. Reported issues were fixed and rechecked.
- Synthetic CLI validation, staging, safe acceptance, repeat acceptance, index import and date query are exercised without importing any real article or modifying private production learning data.
- Local browser attempts were blocked before any browser test assertion: Playwright's Chromium build 1248 was not installed. A second attempt with the existing `/usr/bin/chromium` failed its process-singleton Unix socket (`Operation not permitted`). Eight cases were authored; zero flows were exercised for this change locally. The exact-commit GitHub Actions verification below subsequently closed this browser-execution gap.
- Published stabilization CI: [Check run 37771565045](https://github.com/7ochard/a16z-bilingual-reader/actions/runs/37771565045) completed successfully on 2026-10-08 at 11:40:57 UTC for code commit [`f666ae608976f1d323cf3e105e0b30946020c038`](https://github.com/7ochard/a16z-bilingual-reader/commit/f666ae608976f1d323cf3e105e0b30946020c038). Authenticated job `113292154631` logs confirm TypeScript and production build passed, `tests 42`, `pass 42`, `fail 0`, and **8/8 Chromium browser tests passed (8.8 seconds)** across four desktop and four mobile scenarios. This is automated functional verification of that exact code SHA, not a manual visual review. Later commits require their own CI result; this evidence does not claim that unseen formal daily article output has been validated.

The first formal daily article is still pending. Synthetic contract coverage is not proof that unseen future daily output matches the contract, nor a copyright review of any real article.

## Upstream-first 1.0.0 compatibility verification (2026-10-10 UTC)

This adjustment follows the visible current producer shape and retains the legacy 1.0 adapter, existing architecture and immutable archive history. No production article, original private conversation, deployment, account, scraper or dependency change is included. The producer's actual schema/data attachments were not recovered; local structural tests are not validation of those unseen files.

- `npm run check`: TypeScript, **50/50 Node/API/archive/import tests**, and production build passed locally.
- Eight added unit/integration cases cover object sources, ordered authors (including nested objects), rich analysis arrays and extra fields, null/empty phonetics, explicit rights, no invented legacy metadata, unsafe-JSON and duplicate/reference rejection, source JSON/Markdown roundtrip, append-only daily dedupe, required revision changes, legacy-to-current migration, preserved private learning state, raw-input local review preparation and generated schemas.
- Synthetic CLI validation, isolated staging, immutable acceptance, repeat acceptance, SQLite index import and deep-analysis date-filtered query passed using temporary files only. Existing committed archive pairs remain unchanged and validate successfully.
- Independent review exercised the legacy suite, current format, bounded unknown metadata, unsafe/cyclic JSON and a real local HTTP import/read/rejected-update flow. A new browser-test response-shape assertion was corrected during review before publication.
- Ten desktop/mobile browser cases are now authored, including two current-format raw-import/rights/analysis cases. Local execution could not reach browser assertions: the bundled Playwright Chromium executable is absent; the installed system Chromium alternative fails its process-singleton Unix socket with `Operation not permitted`. **Zero browser flows were exercised for this change locally.** Prior CI evidence above applies only to the earlier commits, not this change. Exact-commit CI must establish browser results after authorized publication.

Generated Markdown is a derived view with a complete JSON provenance appendix. Tests verify original JSON values, not byte-for-byte reproduction of an unavailable original Markdown response. A formal article still requires compatibility, content-quality, rights and publication review before acceptance.
