import { readFileSync } from "node:fs";
import { openDatabase } from "../server/database.js";
import { Store } from "../server/store.js";
import { createApp } from "../server/app.js";
const db = openDatabase(":memory:");
const store = new Store(db);
store.import(
  JSON.parse(readFileSync("fixtures/synthetic-library.json", "utf8")),
);
const server = createApp(store).listen(3101, "127.0.0.1");
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
