import { upstreamImportSchema, upstreamVocabularyId } from "./schema.js";
import type { ImportBatch } from "../shared/types.js";
/** Frozen observed 1.0 core plus declared, lossless archive extensions. */
export function adaptUpstream(input: unknown): ImportBatch {
  const { article: a, revision, rights, title_zh, extensions } = upstreamImportSchema.parse(input);
  const { summary, key_findings, limitations, discussion, ...rich } = a.analysis;
  return {
    contract: "bilingual-reader.provisional",
    schema_version: "1.0",
    articles: [{
      id: a.id,
      revision,
      title: a.title.trim(),
      title_zh: (title_zh ?? a.title).trim(),
      author: a.author.trim(),
      published_at: a.published_at,
      topics: a.topics.map((topic) => topic.trim()),
      summary: a.selection_reason.trim(),
      source: { name: a.source.trim(), url: a.url, ...rights },
      // Parsing the upstream contract never trims or otherwise transforms strings.
      upstream_snapshot: a,
      ...(title_zh !== undefined ? { upstream_title_zh: title_zh } : {}),
      ...(extensions ? { upstream_wrapper_extensions: extensions } : {}),
      ...(a.extensions ? { extensions: a.extensions } : {}),
      ...(a.meta ? { meta: a.meta } : {}),
      segments: a.segments.map((s, order) => ({
        id: s.id, order, kind: "paragraph", en: s.en.trim(), zh: s.zh.trim(),
        ...(s.extensions ? { extensions: s.extensions } : {}),
      })),
      analysis: {
        summary_zh: summary.trim(), key_points: key_findings.map((point) => point.trim()),
        discussion: (discussion ?? []).map((point) => point.trim()), limitations, ...rich,
      },
      vocabulary: a.vocabulary.map((v) => ({
        id: upstreamVocabularyId(v),
        // A textual match is not evidence that the producer intended an association.
        segment_id: v.segment_id ?? null,
        term: v.term.trim(), meaning_zh: v.meaning_zh.trim(),
        ...(v.meaning_en ? { meaning_en: v.meaning_en.trim() } : {}),
        ...(v.phonetic?.trim() ? { phonetic: v.phonetic.trim() } : {}),
        part_of_speech: v.part_of_speech.trim(), example_en: v.example_en.trim(), example_zh: v.example_zh.trim(),
        ...(v.extensions ? { extensions: v.extensions } : {}),
      })),
    }],
  };
}
