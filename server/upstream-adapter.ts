import { createHash } from "node:crypto";
import { containsTerm } from "../shared/text.js";
import { upstreamImportSchema } from "./schema.js";
import type { ImportBatch } from "../shared/types.js";
/** Deliberately supports only the observed simplified example, not an unseen formal schema. */
export function adaptUpstream(input: unknown): ImportBatch {
  const {
    article: a,
    revision,
    rights,
    title_zh,
  } = upstreamImportSchema.parse(input);
  const norm = (s: string) => s.normalize("NFKC").toLocaleLowerCase("en-US");
  return {
    contract: "bilingual-reader.provisional",
    schema_version: "1.0",
    articles: [
      {
        id: a.id,
        revision,
        title: a.title,
        title_zh: title_zh || a.title,
        author: a.author,
        published_at: a.published_at,
        topics: a.topics,
        summary: a.selection_reason,
        source: { name: a.source, url: a.url, ...rights },
        upstream_snapshot: a,
        segments: a.segments.map((s, order) => ({
          id: s.id,
          order,
          kind: "paragraph",
          en: s.en,
          zh: s.zh,
        })),
        analysis: {
          summary_zh: a.analysis.summary,
          key_points: a.analysis.key_findings,
          discussion: [],
        },
        vocabulary: a.vocabulary.map((v, index) => {
          const matches = a.segments.filter((s) => containsTerm(s.en, v.term));
          return {
            id:
              "up-" +
              createHash("sha256")
                .update(`${index}\0${norm(v.term)}\0${v.example_en}`)
                .digest("hex")
                .slice(0, 24),
            segment_id: matches.length === 1 ? matches[0].id : null,
            term: v.term,
            meaning_zh: v.meaning_zh,
            ...(v.phonetic ? { phonetic: v.phonetic } : {}),
            part_of_speech: v.part_of_speech,
            example_en: v.example_en,
            example_zh: v.example_zh,
          };
        }),
      },
    ],
  };
}
