import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
export const DATABASE_VERSION = 2;
export const migrations = [
  `CREATE TABLE articles (id TEXT PRIMARY KEY, revision INTEGER NOT NULL, content_hash TEXT NOT NULL, data TEXT NOT NULL);
   CREATE TABLE article_state (article_id TEXT PRIMARY KEY REFERENCES articles(id), is_read INTEGER NOT NULL DEFAULT 0, favorite INTEGER NOT NULL DEFAULT 0);
   CREATE TABLE saved_vocabulary (id TEXT PRIMARY KEY, article_id TEXT NOT NULL REFERENCES articles(id), segment_id TEXT NOT NULL, normalized_term TEXT NOT NULL, data TEXT NOT NULL, favorite INTEGER NOT NULL DEFAULT 0, saved_at TEXT NOT NULL, UNIQUE(article_id, segment_id, normalized_term));
   CREATE TABLE learning_progress (vocabulary_id TEXT PRIMARY KEY REFERENCES saved_vocabulary(id), card TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0, due TEXT NOT NULL);
   CREATE TABLE review_events (event_id TEXT PRIMARY KEY, vocabulary_id TEXT NOT NULL REFERENCES saved_vocabulary(id), request TEXT NOT NULL, result TEXT NOT NULL, log TEXT NOT NULL, reviewed_at TEXT NOT NULL);
   CREATE INDEX progress_due ON learning_progress(due);
   CREATE INDEX review_time ON review_events(reviewed_at);`,
  `CREATE TABLE saved_vocabulary_v2 (id TEXT PRIMARY KEY, article_id TEXT NOT NULL REFERENCES articles(id), segment_id TEXT, normalized_term TEXT NOT NULL, data TEXT NOT NULL, favorite INTEGER NOT NULL DEFAULT 0, saved_at TEXT NOT NULL);
   INSERT INTO saved_vocabulary_v2 SELECT id,article_id,segment_id,normalized_term,json_set(data,'$.context_kind','source_paragraph'),favorite,saved_at FROM saved_vocabulary;
   DROP TABLE saved_vocabulary;
   ALTER TABLE saved_vocabulary_v2 RENAME TO saved_vocabulary;
   CREATE UNIQUE INDEX vocabulary_identity ON saved_vocabulary(article_id,IFNULL(segment_id,''),normalized_term);`,
];
export function openDatabase(path: string) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(
    "PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL;",
  );
  const version = (
    db.prepare("PRAGMA user_version").get() as { user_version: number }
  ).user_version;
  if (version > DATABASE_VERSION) {
    db.close();
    throw new Error("Database is newer than this app; refusing to open it.");
  }
  db.exec("PRAGMA foreign_keys = OFF; BEGIN IMMEDIATE");
  try {
    for (let v = version; v < DATABASE_VERSION; v++) {
      db.exec(migrations[v]);
      db.exec(`PRAGMA user_version = ${v + 1}`);
    }
    if (db.prepare("PRAGMA foreign_key_check").all().length)
      throw new Error("Migration foreign-key integrity check failed");
    db.exec("COMMIT");
    db.exec("PRAGMA foreign_keys = ON");
  } catch (e) {
    db.exec("ROLLBACK");
    db.close();
    throw e;
  }
  return db;
}
