# Implementation API contract

Base `/api`. JSON responses. Errors: `{error: string}`. Successful GETs no wrapper except list responses below. Same-origin only. Mutation requests require `Content-Type: application/json` and `X-Reader-Request: 1`.

- GET /health → `{ok: true, contract: "bilingual-reader.provisional", schema_version: "1.0"}`
- GET /stats → Stats
- GET /articles?q=&topic=&from=YYYY-MM-DD&to=YYYY-MM-DD → `{articles: ArticleSummary[]}` sorted newest first. Empty strings mean no filter.
- GET /articles/:id → ArticleDetail
- PATCH /articles/:id → `{read?: boolean, favorite?: boolean}`; returns ArticleDetail
- POST /import → ImportBatch or observed-upstream wrapper (see import-schema.md); returns `{imported: number}`. Exact own contract, all-or-nothing.
- GET /export → ImportBatch (source content only; full learning backup is database backup).
- GET /vocabulary?q=&favorites=true&due=true → `{vocabulary: SavedWord[]}`
- POST /vocabulary → `{article_id, segment_id, vocabulary_id?, term, meaning_zh, meaning_en?, phonetic?}`; saves own copy with server source-context snapshot, returns SavedWord. segment_id may be null for a supplied article-level suggestion; then vocabulary_id is required and its supplied example is retained with context_kind="supplied_example". Same article+segment+normalized term returns existing record unchanged (no reset).
- PATCH /vocabulary/:id → `{favorite?: boolean, meaning_zh?: string, meaning_en?: string}`; returns SavedWord
- GET /review → `{vocabulary: SavedWord[]}` due now, oldest due first
- POST /vocabulary/:id/review → ReviewRequest; returns SavedWord. Four ratings: 1 Again, 2 Hard, 3 Good, 4 Easy. Exactly-once event_id; expected_revision optimistic concurrency. Replays return original result; reused event with conflicting payload rejected; stale revision 409.

All types in shared/types.ts. User vocabulary and cards are separate from imported suggestions. No delete endpoints in MVP. Date-times UTC. Server owns review time. Content text rendered as text, not HTML. API defaults loopback only and denies unknown Host/Origin; no authentication feature yet, so never expose directly to a public network.
