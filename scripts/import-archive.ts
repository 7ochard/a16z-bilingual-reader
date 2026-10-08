import { resolve } from "node:path";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
import { readArchive } from "../server/archive.js";
const directory = resolve(process.argv[2] || "content/articles");
// Validate all historical pairs before even opening the private database.
const { records, latest } = readArchive(directory);
if (!latest.length) throw new Error("No article JSON files found.");
const db = openDatabase(resolve(process.env.DATABASE_PATH || "data/reader.sqlite"));
try {
  const result = new Store(db).importMany(latest.map((article) => ({
    contract: "bilingual-reader.provisional", schema_version: "1.0", articles: [article],
  })));
  console.log(`Validated ${records.length} archived revision(s); imported ${result.imported} latest article(s). Learning state preserved. No commits or network calls.`);
} finally { db.close(); }
