import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
const directory = resolve(process.argv[2] || "content/articles");
const files = readdirSync(directory)
  .filter((file) => file.endsWith(".json"))
  .sort();
if (!files.length) throw new Error("No article JSON files found.");
const inputs = files.map((file) =>
  JSON.parse(readFileSync(join(directory, file), "utf8")),
);
const db = openDatabase(
  resolve(process.env.DATABASE_PATH || "data/reader.sqlite"),
);
try {
  const result = new Store(db).importMany(inputs);
  console.log(
    `Imported ${result.imported} article(s) from ${files.length} archive files. Learning state preserved. No commits or network calls.`,
  );
} finally {
  db.close();
}
