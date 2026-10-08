# Local deployment and recovery

## Supported now

Node.js 24+ on one trusted machine, one API process, one SQLite file on local persistent storage. `npm run build && npm start` serves UI and API at http://127.0.0.1:3001. `DATABASE_PATH` selects an absolute durable path; `PORT` selects a local port. `HOST=0.0.0.0` and other public bind requests are rejected.

The development server runs at http://127.0.0.1:5173 and proxies `/api` to port 3001. No credentials or paid cloud service are needed. Application source URLs are displayed as links and never fetched by the backend.

## Before remote / mobile deployment

The default server has no account authentication. Do not publish it as an unauthenticated public service. Do not use a tunnel or proxy merely to bypass local Host checks. A proper remote release must add and test:

1. HTTPS and authentication covering the entire app and API, including all reads, exports, imports, and review writes
2. Server-enforced per-user ownership/authorization or explicit single-owner authentication, secure session cookies, CSRF defense, restrictive exact-origin validation, safe proxy configuration and logout/session expiry
3. Persistent disk, access-controlled backups, monitoring, rate/body limits, secrets management and tested recovery
4. SQLite deployed on one server with its local volume; clients use the API, never concurrently open a network-synced database file

Two browsers aimed at the same future authenticated service can share server-owned data. Today’s loopback-only app is not a delivered cross-device deployment. Ephemeral serverless disks are not durable storage. Do not upload a live database containing learning or copyrighted data to a public repository.

## Consistent backup

```sh
npm run backup -- /absolute/path/reader-2026-10-08.sqlite
```

The script uses Node's SQLite backup API, so WAL state is included in a consistent copy. It refuses to overwrite an existing destination. Store copies privately and outside the main disk when durable recovery matters. No automatic remote upload is configured.

## Restore (offline)

1. Stop the app. Keep the current database and any `-wal` / `-shm` sidecars together in a private recovery folder.
2. Copy the known-good backup to a fresh path, e.g. `/private/reader-restored.sqlite`. Do not overwrite a live database or mix old WAL sidecars with the restored file.
3. Start with `DATABASE_PATH=/private/reader-restored.sqlite npm start`.
4. Check articles, saved word counts, card due times and favorites. The test suite also validates backup integrity and state preservation.

A content JSON export is not a backup of personal state. Keep the full SQLite backup for cards and review history. Back up before migrations and ts-fsrs version upgrades. The app refuses databases with a schema newer than its migration code.
