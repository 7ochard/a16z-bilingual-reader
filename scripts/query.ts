import { resolve } from "node:path";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
import { dateOnly } from "../server/schema.js";
const args = process.argv.slice(2), terms: string[] = [];
const filters: { q?: string; topic?: string; from?: string; to?: string } = {};
for (let i = 0; i < args.length; i++) {
  const argument = args[i];
  if (["--from", "--to", "--topic"].includes(argument)) {
    const value = args[++i];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}`);
    if (argument === "--topic") filters.topic = value;
    else filters[argument.slice(2) as "from" | "to"] = dateOnly.parse(value);
  } else if (argument.startsWith("--")) throw new Error(`Unknown query option: ${argument}`);
  else terms.push(argument);
}
filters.q = terms.join(" ");
if (filters.from && filters.to && filters.from > filters.to) throw new Error("--from must not be later than --to");
const db = openDatabase(resolve(process.env.DATABASE_PATH || "data/reader.sqlite"));
try { console.log(JSON.stringify(new Store(db).articles(filters), null, 2)); }
finally { db.close(); }
