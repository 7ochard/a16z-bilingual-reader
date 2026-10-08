import { readFileSync } from "node:fs";
import { parseContent } from "../server/content.js";
const file = process.argv[2];
if (!file) throw new Error("Usage: npm run content:validate -- input.json");
const batch = parseContent(JSON.parse(readFileSync(file, "utf8")));
console.log(
  `Valid: ${batch.articles.length} article(s). No database, repository or remote state changed.`,
);
