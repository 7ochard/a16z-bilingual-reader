import {
  readFileSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  renameSync,
  existsSync,
  rmSync,
} from "node:fs";
import { resolve, join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { parseContent, articleMarkdown } from "../server/content.js";
const input = process.argv[2];
if (!input)
  throw new Error(
    "Usage: npm run content:stage -- input.json [new-output-directory]",
  );
const batch = parseContent(JSON.parse(readFileSync(input, "utf8")));
const hash = createHash("sha256")
  .update(JSON.stringify(batch))
  .digest("hex")
  .slice(0, 12);
const target = resolve(process.argv[3] || `.staging/knowledge/${hash}`);
if (existsSync(target))
  throw new Error(
    "Staging directory already exists; inspect it or choose a new path.",
  );
mkdirSync(dirname(target), { recursive: true });
const temporary = mkdtempSync(join(dirname(target), ".prepare-"));
try {
  for (const article of batch.articles) {
    const name = encodeURIComponent(article.id);
    writeFileSync(
      join(temporary, name + ".json"),
      JSON.stringify({ ...batch, articles: [article] }, null, 2) + "\n",
    );
    writeFileSync(join(temporary, name + ".md"), articleMarkdown(article));
  }
  writeFileSync(
    join(temporary, "REVIEW.txt"),
    "Synthetic development or authorized content only. Check the source, rights, bilingual alignment, analysis and examples before acceptance. Staging is not a Git commit. Copy only reviewed .json and .md pairs into content/articles, run content:import, then explicitly review and commit the Git diff. Never copy the SQLite database or learning state.\n",
  );
  renameSync(temporary, target);
  console.log(
    `Staged ${batch.articles.length} article(s) in ${target}. Nothing imported, committed, or pushed.`,
  );
} catch (error) {
  rmSync(temporary, { recursive: true, force: true });
  throw error;
}
