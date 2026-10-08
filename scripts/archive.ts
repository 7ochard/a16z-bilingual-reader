import { readFileSync } from "node:fs";
import { archiveArticles } from "../server/archive.js";
const args = process.argv.slice(2);
const update = args.includes("--update");
const positional = args.filter((arg) => arg !== "--update");
if (!positional[0] || positional.length > 2 || positional.some((arg) => arg.startsWith("--")))
  throw new Error("Usage: npm run content:archive -- reviewed-input.json [archive-directory] [--update]");
const result = archiveArticles(JSON.parse(readFileSync(positional[0], "utf8")), positional[1] || "content/articles", { update });
console.log(JSON.stringify(result, null, 2));
console.log("Local archive only. Review git diff, then explicitly commit/push authorized content. SQLite and learning state unchanged.");
