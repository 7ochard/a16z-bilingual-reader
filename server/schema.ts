import { createHash } from "node:crypto";
import { z } from "zod";
import { containsTerm } from "../shared/text.js";
import type { UpstreamVocabulary } from "../shared/types.js";
const text = (max: number) => z.string().trim().min(1).max(max);
// Upstream strings are evidence: validate their bounds without rewriting them.
const rawText = (max: number) => z.string().min(1).max(max).refine((v) => v.trim().length > 0, "Must contain non-whitespace text");
const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,119}$/);
export const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(
  (v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v,
  "Must be a real calendar date",
);
const sourceUrl = z.url().max(2000).refine((v) => {
  try { const u = new URL(v); return ["https:", "http:"].includes(u.protocol) && !u.username && !u.password; }
  catch { return false; }
}, "HTTP(S) URL without credentials required");
/** Explicit escape hatch, not a passthrough: JSON only, bounded and retained. */
export const extensionsSchema = z.preprocess((value, ctx) => {
  let nodes = 0;
  const visit = (v: unknown, depth: number): boolean => {
    if (++nodes > 5000 || depth > 8) return false;
    if (typeof v === "string") return v.length <= 20000;
    if (v === null || typeof v === "boolean") return true;
    if (typeof v === "number") return Number.isFinite(v);
    if (typeof v !== "object") return false;
    if (Array.isArray(v)) return v.length <= 1000 && v.every((child) => visit(child, depth + 1));
    if (Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) return false;
    const entries = Object.entries(v);
    return entries.length <= 100 && entries.every(([key, child]) => key.length > 0 && key.length <= 120 && !["__proto__", "prototype", "constructor"].includes(key) && visit(child, depth + 1));
  };
  if (!value || typeof value !== "object" || Array.isArray(value) || !visit(value, 0) || Buffer.byteLength(JSON.stringify(value), "utf8") > 65536) {
    ctx.addIssue({ code: "custom", message: "extensions exceed JSON bounds (64 KiB, depth 8, 5000 values, 100 object keys, 1000 array items, 20000-character strings) or contain unsafe keys" });
    return z.NEVER;
  }
  return value;
}, z.record(z.string().min(1).max(120), z.json()));
const optionalExtensions = extensionsSchema.optional();
const rightsDeclaration = z.object({
  rights: z.enum(["owned", "licensed", "public_domain", "permission_granted", "summary_only"]),
  copyright: rawText(1000),
  permission_note: rawText(1000),
  extensions: optionalExtensions,
}).strict();
const source = z.object({ name: text(200), url: sourceUrl, ...rightsDeclaration.shape }).strict();
const meta = z.object({
  content_origin: z.enum(["synthetic", "original", "third_party_paraphrase"]).optional(),
  source_url: sourceUrl.optional(),
  generated_at: z.iso.datetime({ offset: true }).optional(),
  generator: rawText(200).optional(),
  prompt_version: rawText(100).optional(),
  source_language: rawText(100).optional(),
  notes: z.array(rawText(3000)).max(30).optional(),
  extensions: optionalExtensions,
}).strict();
const claim = z.object({
  id, statement: rawText(10000), evidence_ids: z.array(id).max(100).optional(), extensions: optionalExtensions,
}).strict();
const evidence = z.object({
  id, description: rawText(10000), source_url: sourceUrl.optional(), segment_ids: z.array(id).max(100).optional(),
  kind: z.enum(["reported", "observation", "inference", "synthetic"]).optional(), extensions: optionalExtensions,
}).strict();
const richAnalysis = {
  claims: z.array(claim).max(100).optional(),
  evidence: z.array(evidence).max(100).optional(),
  industry_implications: z.array(rawText(10000)).max(50).optional(),
  independent_judgment: rawText(20000).optional(),
  extensions: optionalExtensions,
};
const upstreamAnalysis = z.object({
  summary: rawText(10000), key_findings: z.array(rawText(3000)).max(30), limitations: z.string().max(10000),
  discussion: z.array(rawText(3000)).max(30).optional(), ...richAnalysis,
}).strict();
const upstreamVocabulary = z.object({
  id: id.optional(), segment_id: id.nullable().optional(), term: rawText(200),
  phonetic: z.string().max(200).optional(), part_of_speech: rawText(200), meaning_zh: rawText(2000),
  meaning_en: rawText(2000).optional(), example_en: rawText(20000), example_zh: rawText(20000), extensions: optionalExtensions,
}).strict();
const normalizeIdentity = (v: string) => v.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
export const upstreamVocabularyIdentity = (v: Pick<UpstreamVocabulary, "term" | "part_of_speech" | "example_en">): string =>
  JSON.stringify([v.term, v.part_of_speech, v.example_en].map(normalizeIdentity));
export const upstreamVocabularyId = (v: UpstreamVocabulary): string => v.id ?? "up-" + createHash("sha256").update(upstreamVocabularyIdentity(v)).digest("hex").slice(0, 24);
function checkAnalysis(analysis: z.infer<typeof upstreamAnalysis> | { claims?: z.infer<typeof claim>[]; evidence?: z.infer<typeof evidence>[] }, segmentIds: Set<string>, ctx: z.RefinementCtx) {
  const evidenceIds = new Set((analysis.evidence ?? []).map((e) => e.id));
  if (evidenceIds.size !== (analysis.evidence ?? []).length) ctx.addIssue({ code: "custom", message: "Duplicate analysis evidence IDs" });
  if (new Set((analysis.claims ?? []).map((c) => c.id)).size !== (analysis.claims ?? []).length) ctx.addIssue({ code: "custom", message: "Duplicate analysis claim IDs" });
  for (const c of analysis.claims ?? []) for (const evidenceId of c.evidence_ids ?? [])
    if (!evidenceIds.has(evidenceId)) ctx.addIssue({ code: "custom", message: `Claim ${c.id} has unknown evidence_id ${evidenceId}` });
  for (const e of analysis.evidence ?? []) for (const segmentId of e.segment_ids ?? [])
    if (!segmentIds.has(segmentId)) ctx.addIssue({ code: "custom", message: `Evidence ${e.id} has unknown segment_id ${segmentId}` });
}
export const upstreamSchema = z.object({
  schema_version: z.literal("1.0"), id, source: rawText(200), title: rawText(500), author: rawText(200),
  published_at: dateOnly, selected_at: dateOnly, url: sourceUrl, topics: z.array(rawText(100)).min(1).max(20),
  selection_reason: rawText(2000),
  segments: z.array(z.object({ id, en: rawText(20000), zh: rawText(20000), type: z.literal("paraphrase"), extensions: optionalExtensions }).strict()).min(1).max(1000),
  analysis: upstreamAnalysis, vocabulary: z.array(upstreamVocabulary).max(2000),
  copyright_mode: z.literal("bilingual_paraphrase"), meta: meta.optional(), extensions: optionalExtensions,
}).strict().superRefine((a, ctx) => {
  const segmentIds = new Set(a.segments.map((s) => s.id));
  if (segmentIds.size !== a.segments.length) ctx.addIssue({ code: "custom", message: "Duplicate upstream segment IDs" });
  if (new Set(a.vocabulary.map(upstreamVocabularyId)).size !== a.vocabulary.length) ctx.addIssue({ code: "custom", message: "Duplicate upstream vocabulary IDs (explicit or derived)" });
  if (new Set(a.vocabulary.map(upstreamVocabularyIdentity)).size !== a.vocabulary.length) ctx.addIssue({ code: "custom", message: "Duplicate upstream vocabulary identity (term, part_of_speech, example_en)" });
  for (const v of a.vocabulary) {
    if (v.segment_id == null) continue;
    const segment = a.segments.find((s) => s.id === v.segment_id);
    if (!segment) ctx.addIssue({ code: "custom", message: `Vocabulary ${v.term} has unknown segment_id` });
    else if (!containsTerm(segment.en, v.term)) ctx.addIssue({ code: "custom", message: `Vocabulary ${v.term} must occur in its explicitly linked English segment` });
  }
  checkAnalysis(a.analysis, segmentIds, ctx);
});
export const upstreamImportSchema = z.object({
  format: z.literal("chatgpt-observed-1.0"), revision: z.number().int().min(1).max(2147483647),
  rights: rightsDeclaration, title_zh: rawText(500).optional(), article: upstreamSchema, extensions: optionalExtensions,
}).strict().superRefine((wrapper, ctx) => {
  if (wrapper.rights.rights === "summary_only" && (wrapper.article.meta?.content_origin !== "third_party_paraphrase" || wrapper.article.meta.source_url !== wrapper.article.url))
    ctx.addIssue({ code: "custom", message: "summary_only requires meta.content_origin third_party_paraphrase and meta.source_url matching the original source URL; it declares original paraphrase/analysis, not a license" });
});
const segment = z.object({ id, order: z.number().int().min(0).max(9999), kind: z.enum(["paragraph", "heading", "quote"]), en: text(20000), zh: text(20000), extensions: optionalExtensions }).strict();
const vocabulary = z.object({
  id, segment_id: id.nullable(), example_en: text(20000).optional(), example_zh: text(20000).optional(),
  part_of_speech: text(200).optional(), term: text(200), meaning_zh: text(2000), meaning_en: text(2000).optional(), phonetic: text(200).optional(), extensions: optionalExtensions,
}).strict();
export const articleSchema = z.object({
  id, upstream_snapshot: upstreamSchema.optional(), upstream_wrapper_extensions: optionalExtensions,
  upstream_title_zh: rawText(500).optional(),
  revision: z.number().int().min(1).max(2147483647), title: text(500), title_zh: text(500), author: text(200),
  published_at: dateOnly, topics: z.array(text(100)).min(1).max(20), source, summary: text(2000),
  segments: z.array(segment).min(1).max(1000), vocabulary: z.array(vocabulary).max(2000),
  analysis: z.object({ summary_zh: text(10000), key_points: z.array(text(3000)).max(30), discussion: z.array(text(3000)).max(30), limitations: z.string().max(10000).optional(), ...richAnalysis }).strict(),
  meta: meta.optional(), extensions: optionalExtensions,
}).strict().superRefine((a, ctx) => {
  const ids = new Set(a.segments.map((s) => s.id));
  if (ids.size !== a.segments.length) ctx.addIssue({ code: "custom", message: "Duplicate segment IDs" });
  if (new Set(a.segments.map((s) => s.order)).size !== a.segments.length) ctx.addIssue({ code: "custom", message: "Duplicate segment order" });
  if (new Set(a.vocabulary.map((v) => v.id)).size !== a.vocabulary.length) ctx.addIssue({ code: "custom", message: "Duplicate vocabulary IDs" });
  a.vocabulary.forEach((v) => {
    if (v.segment_id === null && (!v.example_en || !v.example_zh)) ctx.addIssue({ code: "custom", message: `Article-level vocabulary ${v.id} requires supplied examples` });
    if (v.segment_id !== null && !ids.has(v.segment_id)) ctx.addIssue({ code: "custom", message: `Vocabulary ${v.id} has unknown segment_id` });
    const s = a.segments.find((s) => s.id === v.segment_id);
    if (s && !containsTerm(s.en, v.term)) ctx.addIssue({ code: "custom", message: `Vocabulary ${v.id} must occur in its explicitly linked English segment` });
  });
  checkAnalysis(a.analysis, ids, ctx);
  if (a.source.rights === "summary_only") {
    const original = a.upstream_snapshot;
    if (!original || original.id !== a.id || original.url !== a.source.url || original.meta?.content_origin !== "third_party_paraphrase" || original.meta.source_url !== a.source.url)
      ctx.addIssue({ code: "custom", message: "summary_only requires a matching paraphrase upstream_snapshot with original-source provenance" });
    // Prevent an internal batch from attaching a harmless snapshot to unrelated full text.
    if (original && (a.segments.length !== original.segments.length || a.segments.some((s) => {
      const upstream = original.segments.find((u) => u.id === s.id);
      return !upstream || s.kind !== "paragraph" || s.en !== upstream.en.trim() || s.zh !== upstream.zh.trim();
    }))) ctx.addIssue({ code: "custom", message: "summary_only reader segments must match the declared paraphrase upstream_snapshot" });
  }
});
export const batchSchema = z.object({
  contract: z.literal("bilingual-reader.provisional"), schema_version: z.literal("1.0"), articles: z.array(articleSchema).min(1).max(100),
}).strict().superRefine((b, ctx) => {
  if (new Set(b.articles.map((a) => a.id)).size !== b.articles.length) ctx.addIssue({ code: "custom", message: "Duplicate article IDs in batch" });
});
export const saveWordSchema = z
  .object({
    article_id: id,
    segment_id: id.nullable(),
    vocabulary_id: id.optional(),
    term: text(200),
    meaning_zh: text(2000),
    meaning_en: text(2000).optional(),
    phonetic: text(200).optional(),
  })
  .strict();
export const wordPatchSchema = z
  .object({
    favorite: z.boolean().optional(),
    meaning_zh: text(2000).optional(),
    meaning_en: z.string().trim().max(2000).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, "Empty update");
export const articlePatchSchema = z
  .object({ read: z.boolean().optional(), favorite: z.boolean().optional() })
  .strict()
  .refine((v) => Object.keys(v).length > 0, "Empty update");
export const reviewSchema = z
  .object({
    event_id: z.string().uuid(),
    rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    expected_revision: z.number().int().nonnegative(),
  })
  .strict();
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
