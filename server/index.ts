import { resolve } from "node:path";
import { openDatabase } from "./database.js";
import { Store } from "./store.js";
import { createApp } from "./app.js";
const port = Number(process.env.PORT || 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT must be between 1 and 65535");
if (
  process.env.HOST &&
  !["127.0.0.1", "localhost", "::1"].includes(process.env.HOST)
)
  throw new Error(
    "Public binding is disabled. See docs/deployment.md before adding authenticated remote access.",
  );
const db = openDatabase(
  resolve(process.env.DATABASE_PATH || "data/reader.sqlite"),
);
const server = createApp(new Store(db)).listen(port, "127.0.0.1", () =>
  console.log(`Reader API: http://127.0.0.1:${port} (single-user local only)`),
);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
