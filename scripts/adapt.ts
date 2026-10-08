import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { adaptUpstream } from "../server/upstream-adapter.js";
const [input, output] = process.argv.slice(2);
if (!input || !output)
  throw new Error(
    "Usage: npm run adapt -- input-wrapper.json output-reader.json (see docs/import-schema.md)",
  );
if (existsSync(output))
  throw new Error("Output already exists; choose a new path.");
writeFileSync(
  output,
  JSON.stringify(
    adaptUpstream(JSON.parse(readFileSync(input, "utf8"))),
    null,
    2,
  ) + "\n",
);
console.log(
  `Adapted one observed upstream article to ${output}. No content was fetched.`,
);
