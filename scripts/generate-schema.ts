import { writeFileSync } from "node:fs";
import { z } from "zod";
import { batchSchema, upstreamImportSchema } from "../server/schema.js";
for (const [name, schema] of [
  ["reader-import", batchSchema],
  ["observed-upstream-wrapper", upstreamImportSchema],
] as const) {
  writeFileSync(
    `schema/${name}.schema.json`,
    JSON.stringify(z.toJSONSchema(schema, { io: "input" }), null, 2) + "\n",
  );
}
console.log(
  "Generated JSON Schemas. Cross-record and semantic refinements remain enforced by the Zod validator.",
);
