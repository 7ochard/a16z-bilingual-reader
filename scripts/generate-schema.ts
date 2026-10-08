import { mkdirSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { batchSchema, upstreamImportSchema, upstreamSchema } from "../server/schema.js";
mkdirSync("schema", { recursive: true });
for (const [name, schema] of [
  ["reader-import", batchSchema],
  ["observed-upstream-wrapper", upstreamImportSchema],
  ["chatgpt-article", upstreamSchema],
] as const) {
  const json = JSON.stringify(z.toJSONSchema(schema, { io: "input" }), null, 2) + "\n";
  // Existing unversioned filenames remain compatibility aliases for frozen 1.0.
  for (const suffix of ["", ".v1.0"]) writeFileSync(`schema/${name}${suffix}.schema.json`, json);
}
console.log("Generated frozen 1.0 article, wrapper and reader JSON Schemas. Semantic references, extension bounds and rights rules are enforced by the runtime validator.");
