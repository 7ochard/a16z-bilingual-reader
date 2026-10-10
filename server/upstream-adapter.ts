import { upstreamImportSchema, upstreamImportSchemaV100, upstreamVocabularyId } from "./schema.js";
import type { ImportBatch } from "../shared/types.js";
/** Frozen observed 1.0 core plus declared, lossless archive extensions. */
export function adaptUpstream(input: unknown): ImportBatch {
  if (input && typeof input === "object" && "format" in input && input.format === "chatgpt-upstream-1.0.0")
    return adaptUpstreamV100(input);
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

/** Project complete analysis into the existing UI; the exact arrays remain in the snapshot. */
const displayItem = (value: unknown): string => typeof value === "string" && value.trim()
  ? value.trim() : JSON.stringify(value, null, 2);
function adaptUpstreamV100(input: unknown): ImportBatch {
  const { article: a, revision, rights, title_zh, extensions } = upstreamImportSchemaV100.parse(input);
  const sourceName = typeof a.source.name === "string" && a.source.name.trim() && a.source.name.trim().length <= 200
    ? a.source.name.trim() : new URL(a.url).hostname;
  return {
    contract: "bilingual-reader.provisional", schema_version: "1.0",
    articles: [{
      id: a.id, revision, title: a.title.trim(), title_zh: (title_zh ?? a.title).trim(),
      author: a.author.map((entry) => {
        if (entry && typeof entry === "object" && !Array.isArray(entry) && typeof entry.name === "string" && entry.name.trim())
          return entry.name.trim();
        return displayItem(entry);
      }).join(", ") || "未提供作者",
      published_at: a.published_at, topics: a.topics.map((topic) => topic.trim()), summary: a.selection_reason.trim(),
      source: { name: sourceName, url: a.url, ...rights }, upstream_snapshot: a,
      ...(title_zh !== undefined ? { upstream_title_zh: title_zh } : {}),
      ...(extensions ? { upstream_wrapper_extensions: extensions } : {}),
      ...(a.extensions ? { extensions: a.extensions } : {}),
      segments: a.segments.map((s, order) => ({
        id: s.id, order, kind: "paragraph", en: s.en.trim(), zh: s.zh.trim(),
        ...(s.extensions ? { extensions: s.extensions } : {}),
      })),
      analysis: {
        summary_zh: a.analysis.core_thesis.trim(),
        key_points: a.analysis.supporting_evidence.map(displayItem),
        discussion: [...a.analysis.industry_significance.map(displayItem), a.analysis.independent_judgment.trim()],
        limitations: a.analysis.limitations.map(displayItem).join("\n\n"),
        independent_judgment: a.analysis.independent_judgment,
        ...(a.analysis.extensions ? { extensions: a.analysis.extensions } : {}),
      },
      vocabulary: a.vocabulary.map((v) => ({
        id: upstreamVocabularyId(v), segment_id: v.segment_id ?? null,
        term: v.term.trim(), meaning_zh: v.meaning_zh.trim(),
        ...(v.meaning_en ? { meaning_en: v.meaning_en.trim() } : {}),
        ...(v.phonetic?.trim() ? { phonetic: v.phonetic.trim() } : {}),
        part_of_speech: v.part_of_speech.trim(), example_en: v.example_en.trim(), example_zh: v.example_zh.trim(),
        ...(v.extensions ? { extensions: v.extensions } : {}),
      })),
    }],
  };
}
