import { z } from "zod";
const text = (max: number) => z.string().trim().min(1).max(max);
const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,119}$/);
export const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    "Must be a real calendar date",
  );
const source = z
  .object({
    name: text(200),
    url: z
      .url()
      .max(2000)
      .refine((v) => {
        try {
          const u = new URL(v);
          return (
            ["https:", "http:"].includes(u.protocol) &&
            !u.username &&
            !u.password
          );
        } catch {
          return false;
        }
      }, "HTTP(S) URL without credentials required"),
    rights: z.enum([
      "owned",
      "licensed",
      "public_domain",
      "permission_granted",
    ]),
    copyright: text(1000),
    permission_note: text(1000),
  })
  .strict();
const segment = z
  .object({
    id,
    order: z.number().int().min(0).max(9999),
    kind: z.enum(["paragraph", "heading", "quote"]),
    en: text(20000),
    zh: text(20000),
  })
  .strict();
const vocabulary = z
  .object({
    id,
    segment_id: id.nullable(),
    example_en: text(20000).optional(),
    example_zh: text(20000).optional(),
    part_of_speech: text(200).optional(),
    term: text(200),
    meaning_zh: text(2000),
    meaning_en: text(2000).optional(),
    phonetic: text(200).optional(),
  })
  .strict();
export const upstreamSchema = z
  .object({
    schema_version: z.literal("1.0"),
    id,
    source: text(200),
    title: text(500),
    author: text(200),
    published_at: dateOnly,
    selected_at: dateOnly,
    url: source.shape.url,
    topics: z.array(text(100)).min(1).max(20),
    selection_reason: text(2000),
    segments: z
      .array(
        z
          .object({
            id,
            en: text(20000),
            zh: text(20000),
            type: z.literal("paraphrase"),
          })
          .strict(),
      )
      .min(1)
      .max(1000),
    analysis: z
      .object({
        summary: text(10000),
        key_findings: z.array(text(3000)).max(30),
        limitations: z.string().trim().max(10000),
      })
      .strict(),
    vocabulary: z
      .array(
        z
          .object({
            term: text(200),
            phonetic: z.string().trim().max(200).optional(),
            part_of_speech: text(200),
            meaning_zh: text(2000),
            example_en: text(20000),
            example_zh: text(20000),
          })
          .strict(),
      )
      .max(2000),
    copyright_mode: z.literal("bilingual_paraphrase"),
  })
  .strict()
  .superRefine((a, ctx) => {
    if (new Set(a.segments.map((s) => s.id)).size !== a.segments.length)
      ctx.addIssue({
        code: "custom",
        message: "Duplicate upstream segment IDs",
      });
  });
export const upstreamImportSchema = z
  .object({
    format: z.literal("chatgpt-observed-1.0"),
    revision: z.number().int().min(1).max(2147483647),
    rights: source.pick({
      rights: true,
      copyright: true,
      permission_note: true,
    }),
    title_zh: text(500).optional(),
    article: upstreamSchema,
  })
  .strict();
export const articleSchema = z
  .object({
    id,
    upstream_snapshot: upstreamSchema.optional(),
    revision: z.number().int().min(1).max(2147483647),
    title: text(500),
    title_zh: text(500),
    author: text(200),
    published_at: dateOnly,
    topics: z.array(text(100)).min(1).max(20),
    source,
    summary: text(2000),
    segments: z.array(segment).min(1).max(1000),
    vocabulary: z.array(vocabulary).max(2000),
    analysis: z
      .object({
        summary_zh: text(10000),
        key_points: z.array(text(3000)).max(30),
        discussion: z.array(text(3000)).max(30),
      })
      .strict(),
  })
  .strict()
  .superRefine((a, ctx) => {
    const ids = new Set(a.segments.map((s) => s.id));
    if (ids.size !== a.segments.length)
      ctx.addIssue({ code: "custom", message: "Duplicate segment IDs" });
    if (new Set(a.segments.map((s) => s.order)).size !== a.segments.length)
      ctx.addIssue({ code: "custom", message: "Duplicate segment order" });
    if (new Set(a.vocabulary.map((v) => v.id)).size !== a.vocabulary.length)
      ctx.addIssue({ code: "custom", message: "Duplicate vocabulary IDs" });
    a.vocabulary.forEach((v) => {
      if (v.segment_id === null && (!v.example_en || !v.example_zh))
        ctx.addIssue({
          code: "custom",
          message: `Article-level vocabulary ${v.id} requires supplied examples`,
        });
      if (v.segment_id !== null && !ids.has(v.segment_id))
        ctx.addIssue({
          code: "custom",
          message: `Vocabulary ${v.id} has unknown segment_id`,
        });
    });
  });
export const batchSchema = z
  .object({
    contract: z.literal("bilingual-reader.provisional"),
    schema_version: z.literal("1.0"),
    articles: z.array(articleSchema).min(1).max(100),
  })
  .strict()
  .superRefine((b, ctx) => {
    if (new Set(b.articles.map((a) => a.id)).size !== b.articles.length)
      ctx.addIssue({
        code: "custom",
        message: "Duplicate article IDs in batch",
      });
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
