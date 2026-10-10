import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseContent } from "../server/content.js";
import { assertSafePath } from "../server/archive.js";
const [articlePath, reviewPath, outputPath, ...extra] = process.argv.slice(2);
if (!articlePath || !reviewPath || !outputPath || extra.length)
  throw new Error("Usage: npm run content:prepare -- raw-article.json local-review.json new-wrapper.json");
const article = JSON.parse(readFileSync(articlePath, "utf8"));
const review = JSON.parse(readFileSync(reviewPath, "utf8"));
if (!review || typeof review !== "object" || Array.isArray(review) || "article" in review || "format" in review)
  throw new Error("Local review metadata must supply revision and explicit rights, not article or format overrides");
const format = article?.schema_version === "1.0.0" ? "chatgpt-upstream-1.0.0" : "chatgpt-observed-1.0";
const wrapper = { format, ...review, article };
parseContent(wrapper); // All content and rights checks run before an output file is created.
assertSafePath(outputPath);
if (existsSync(outputPath)) throw new Error("Output already exists; use a new path");
writeFileSync(outputPath, JSON.stringify(wrapper, null, 2) + "\n", { flag: "wx", mode: 0o600 });
console.log(`Prepared ${outputPath}; original article JSON values are unchanged. No archive acceptance, database import, commit or push occurred.`);
