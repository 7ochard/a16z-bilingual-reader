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
