import { backup } from "node:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { openDatabase } from "../server/database.js";
const target = process.argv[2];
if (!target)
  throw new Error(
    "Usage: npm run backup -- /absolute/path/reader-backup.sqlite",
  );
if (existsSync(target))
  throw new Error("Backup target exists; choose a new filename.");
const db = openDatabase(
  resolve(process.env.DATABASE_PATH || "data/reader.sqlite"),
);
try {
  await backup(db, resolve(target));
  console.log(`Consistent SQLite backup saved to ${resolve(target)}`);
} finally {
  db.close();
}
