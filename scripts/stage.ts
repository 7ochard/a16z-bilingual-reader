import { readFileSync, mkdirSync, mkdtempSync, writeFileSync, renameSync, existsSync, rmSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { createHash } from "node:crypto";
import { parseContent } from "../server/content.js";
import { archiveArticles, assertSafePath } from "../server/archive.js";
import { canonicalJSON } from "../server/canonical.js";
const input = process.argv[2];
if (!input || process.argv.length > 4)
  throw new Error("Usage: npm run content:stage -- input.json [new-output-directory]");
const batch = parseContent(JSON.parse(readFileSync(input, "utf8")));
const hash = createHash("sha256").update(canonicalJSON(batch)).digest("hex").slice(0, 12);
const target = resolve(process.argv[3] || `.staging/knowledge/${hash}`);
assertSafePath(target);
if (existsSync(target)) throw new Error("Staging directory already exists; inspect it or choose a new path.");
mkdirSync(dirname(target), { recursive: true });
assertSafePath(dirname(target));
const temporary = mkdtempSync(join(dirname(target), ".prepare-"));
try {
  archiveArticles(batch, join(temporary, "articles"));
  writeFileSync(join(temporary, "REVIEW.txt"),
    "Review the source, rights, bilingual alignment, analysis, provenance and vocabulary. These are unaccepted JSON/Markdown pairs. After review use content:archive with the original reviewed input, not a manual copy. Use --update for changed existing IDs with higher revisions. Review git diff and explicitly commit authorized content. Never copy SQLite, learning state, credentials or personal conversations.\n", { flag: "wx" });
  assertSafePath(target);
  if (existsSync(target)) throw new Error("Staging target was created by another writer; refusing overwrite.");
  renameSync(temporary, target);
  console.log(`Staged ${batch.articles.length} article(s) in ${target}. Nothing accepted into content/articles, imported, committed, or pushed.`);
} catch (error) { rmSync(temporary, { recursive: true, force: true }); throw error; }
