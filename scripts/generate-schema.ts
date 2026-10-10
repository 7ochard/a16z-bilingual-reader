import { mkdirSync, writeFileSync } from "node:fs";
import { z } from "zod";
import { batchSchema, upstreamImportSchema, upstreamSchema, upstreamImportSchemaV100, upstreamSchemaV100 } from "../server/schema.js";
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
for (const [name, schema] of [
  ["chatgpt-article.v1.0.0", upstreamSchemaV100],
  ["upstream-wrapper.v1.0.0", upstreamImportSchemaV100],
] as const) writeFileSync(`schema/${name}.schema.json`, JSON.stringify(z.toJSONSchema(schema, { io: "input" }), null, 2) + "\n");
console.log("Generated legacy 1.0, observed upstream 1.0.0, and compatible reader schemas. Runtime checks enforce semantic and safety rules.");
