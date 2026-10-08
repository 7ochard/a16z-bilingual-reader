import { resolve } from "node:path";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
const db = openDatabase(
  resolve(process.env.DATABASE_PATH || "data/reader.sqlite"),
);
try {
  console.log(
    JSON.stringify(
      new Store(db).articles({ q: process.argv.slice(2).join(" ") }),
      null,
      2,
    ),
  );
} finally {
  db.close();
}
