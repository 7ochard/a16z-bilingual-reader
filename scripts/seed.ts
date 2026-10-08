import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
const db = openDatabase(
  resolve(process.env.DATABASE_PATH || "data/reader.sqlite"),
);
try {
  const result = new Store(db).import(
    JSON.parse(readFileSync("fixtures/synthetic-library.json", "utf8")),
  );
  console.log(
    `Imported ${result.imported} synthetic articles. No live content was fetched.`,
  );
} finally {
  db.close();
}
