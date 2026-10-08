import {
  closeSync, constants, existsSync, fstatSync, fsyncSync, lstatSync,
  mkdirSync, mkdtempSync, openSync, readFileSync, readdirSync,
  renameSync, rmSync, writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import type { Article, ImportBatch } from "../shared/types.js";
import { articleMarkdown, parseContent } from "./content.js";
import { canonicalJSON } from "./canonical.js";

const LOCK = ".archive.lock";
const MAX_JSON_BYTES = 5 * 1024 * 1024;
const single = (article: Article): ImportBatch => ({
  contract: "bilingual-reader.provisional", schema_version: "1.0", articles: [article],
});
const fail = (message: string): never => { throw new Error(message); };

/** Never follow links in the archive root or any existing ancestor. */
export function assertSafePath(path: string): void {
  const absolute = resolve(path);
  let current = absolute;
  while (true) {
    try {
      const stat = lstatSync(current);
      if (stat.isSymbolicLink()) fail(`Symlink paths are not allowed: ${current}`);
      if (current !== absolute && !stat.isDirectory()) fail(`Not a directory: ${current}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
}
function inside(root: string, path: string): string {
  const rel = relative(root, path);
  if (!rel || isAbsolute(rel) || rel === ".." || rel.startsWith(`..${sep}`))
    fail("Archive path escaped its root");
  assertSafePath(path);
  return path;
}
function mkdirSafe(path: string): void {
  assertSafePath(path);
  mkdirSync(path, { recursive: true });
  assertSafePath(path);
  if (!lstatSync(path).isDirectory()) fail(`Not a directory: ${path}`);
}
function readRegular(path: string, maxBytes = MAX_JSON_BYTES): string {
  assertSafePath(path);
  const fd = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.size > maxBytes) fail(`Invalid or oversized archive file: ${path}`);
    return readFileSync(fd, "utf8");
  } finally { closeSync(fd); }
}
function writeDurable(path: string, text: string): void {
  assertSafePath(path);
  const fd = openSync(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
  try { writeFileSync(fd, text); fsyncSync(fd); } finally { closeSync(fd); }
}
function syncDirectory(path: string): void {
  const fd = openSync(path, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
  try { fsyncSync(fd); } finally { closeSync(fd); }
}
/** A readable prefix plus a full digest prevents punctuation/case-fold filename collisions. */
export function articleDirectory(id: string): string {
  const prefix = id.toLowerCase().replace(/[^a-z0-9_-]/g, "-").slice(0, 40);
  return `${prefix}--${createHash("sha256").update(id).digest("hex")}`;
}
const revisionDirectory = (revision: number) => `r${String(revision).padStart(10, "0")}`;
export type ArchiveRecord = { article: Article; jsonPath: string; markdownPath: string; anchorDate: string };
export type ArchiveIndex = { records: ArchiveRecord[]; latest: Article[] };

/** Validate every historical pair before selecting the highest revision for SQLite. */
export function readArchive(directory: string): ArchiveIndex {
  const root = resolve(directory);
  assertSafePath(root);
  if (!existsSync(root)) return { records: [], latest: [] };
  if (!lstatSync(root).isDirectory()) fail("Archive root must be a directory");
  const jsonFiles: string[] = [], markdownFiles = new Set<string>();
  function walk(path: string, depth: number) {
    if (depth > 4) fail(`Unexpected archive nesting: ${path}`);
    for (const entry of readdirSync(path).sort()) {
      const child = inside(root, join(path, entry));
      const stat = lstatSync(child);
      if (stat.isSymbolicLink()) fail(`Symlink paths are not allowed: ${child}`);
      if (path === root && (entry === LOCK || entry.startsWith(".pending-"))) {
        if (!stat.isDirectory()) fail(`Invalid archive work directory: ${child}`);
        continue; // Atomic readers see only published revision directories.
      }
      if (stat.isDirectory()) walk(child, depth + 1);
      else if (stat.isFile() && entry.endsWith(".json")) jsonFiles.push(child);
      else if (stat.isFile() && entry.endsWith(".md")) markdownFiles.add(child);
      else fail(`Unexpected file in archive: ${child}`);
    }
  }
  walk(root, 0);
  const records: ArchiveRecord[] = [];
  for (const jsonPath of jsonFiles) {
    const batch = parseContent(JSON.parse(readRegular(jsonPath)));
    if (batch.articles.length !== 1) fail(`Archive JSON must contain exactly one article: ${jsonPath}`);
    const article = batch.articles[0];
    const parts = relative(root, jsonPath).split(sep);
    let anchorDate = "";
    if (parts.length === 1 && basename(jsonPath) === `${encodeURIComponent(article.id)}.json`) {
      anchorDate = article.published_at; // Existing root-level archive pairs stay readable.
    } else if (parts.length === 4 && parts[3] === "article.json" &&
      parts[1] === articleDirectory(article.id) && parts[2] === revisionDirectory(article.revision) &&
      /^\d{4}-\d{2}-\d{2}$/.test(parts[0]) && !Number.isNaN(Date.parse(parts[0])) &&
      new Date(parts[0]).toISOString().slice(0, 10) === parts[0]) {
      anchorDate = parts[0];
    } else fail(`Archive path does not match its article identity/revision: ${jsonPath}`);
    const markdownPath = jsonPath.replace(/\.json$/, ".md");
    if (!markdownFiles.delete(markdownPath)) fail(`Missing Markdown pair: ${jsonPath}`);
    if (readRegular(markdownPath, MAX_JSON_BYTES * 4) !== articleMarkdown(article))
      fail(`Markdown pair differs from its JSON: ${markdownPath}`);
    records.push({ article, jsonPath, markdownPath, anchorDate });
  }
  if (markdownFiles.size) fail(`Orphan Markdown pair: ${[...markdownFiles][0]}`);
  const byId = new Map<string, ArchiveRecord[]>();
  for (const record of records) {
    const entries = byId.get(record.article.id) || [];
    if (entries.some((r) => r.article.revision === record.article.revision))
      fail(`Duplicate archived revision for ${record.article.id}`);
    entries.push(record); byId.set(record.article.id, entries);
  }
  const latest: Article[] = [];
  for (const entries of byId.values()) {
    entries.sort((a, b) => a.article.revision - b.article.revision);
    const anchor = entries[0].article.published_at;
    if (entries.some((r) => r.anchorDate !== anchor))
      fail(`Article history moved across date directories: ${entries[0].article.id}`);
    latest.push(entries[entries.length - 1].article);
  }
  return { records, latest: latest.sort((a, b) => a.id.localeCompare(b.id)) };
}

export function archiveArticles(
  input: unknown,
  directory: string,
  options: { update?: boolean; beforePublish?: (index: number) => void } = {},
): { archived: number; unchanged: number; paths: string[] } {
  // Validate the complete batch before any filesystem change.
  const batch = parseContent(input), root = resolve(directory);
  mkdirSafe(root);
  const lock = inside(root, join(root, LOCK));
  try { mkdirSync(lock); } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") fail("Archive is locked; inspect the active writer or interrupted operation before retrying");
    throw error;
  }
  const prepared: { temporary: string; target: string }[] = [], published: string[] = [];
  try {
    const current = readArchive(root), latest = new Map(current.latest.map((a) => [a.id, a]));
    let unchanged = 0;
    const plans = batch.articles.flatMap((article) => {
      const previous = latest.get(article.id);
      if (previous && article.revision < previous.revision) fail(`Article ${article.id}: older revision cannot overwrite history`);
      if (previous && article.revision === previous.revision) {
        if (canonicalJSON(previous) !== canonicalJSON(article)) fail(`Article ${article.id}: changed content requires a higher revision and --update`);
        unchanged++; return [];
      }
      if (previous && !options.update) fail(`Article ${article.id}: revision update requires explicit --update`);
      const anchorDate = current.records.find((r) => r.article.id === article.id)?.anchorDate || article.published_at;
      const target = inside(root, join(root, anchorDate, articleDirectory(article.id), revisionDirectory(article.revision)));
      if (existsSync(target)) fail(`Refusing to overwrite an existing revision directory: ${target}`);
      const json = JSON.stringify(single(article), null, 2) + "\n";
      const markdown = articleMarkdown(article);
      if (Buffer.byteLength(json) > MAX_JSON_BYTES || Buffer.byteLength(markdown) > MAX_JSON_BYTES * 4)
        fail(`Article ${article.id}: serialized archive pair exceeds the 5 MiB JSON / 20 MiB Markdown limit`);
      return [{ article, target, json, markdown }];
    });
    for (const { target, json, markdown } of plans) {
      const temporary = mkdtempSync(join(root, ".pending-"));
      prepared.push({ temporary, target });
      writeDurable(join(temporary, "article.json"), json);
      writeDurable(join(temporary, "article.md"), markdown);
      syncDirectory(temporary);
    }
    for (const [index, { temporary, target }] of prepared.entries()) {
      mkdirSafe(dirname(target));
      options.beforePublish?.(index); // Failure injection only; never supplied by CLI.
      inside(root, target);
      if (existsSync(target)) fail(`Refusing to overwrite an existing revision directory: ${target}`);
      renameSync(temporary, target); // JSON + Markdown become visible as one pair.
      published.push(target);
      syncDirectory(dirname(target));
    }
    syncDirectory(root);
    return { archived: published.length, unchanged, paths: published.map((p) => relative(root, p)) };
  } catch (error) {
    // Ordinary failures roll back new directories only, never existing history.
    for (const path of published.reverse()) { inside(root, path); rmSync(path, { recursive: true }); }
    throw error;
  } finally {
    for (const { temporary } of prepared) {
      inside(root, temporary); rmSync(temporary, { recursive: true, force: true });
    }
    inside(root, lock); rmSync(lock, { recursive: true });
  }
}
