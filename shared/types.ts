/** JSON extensions are validated for depth, size and unsafe keys at import. */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type Extensions = { [key: string]: JsonValue };
export type ProvenanceMeta = {
  content_origin?: "synthetic" | "original" | "third_party_paraphrase";
  source_url?: string;
  generated_at?: string;
  generator?: string;
  prompt_version?: string;
  source_language?: string;
  notes?: string[];
  extensions?: Extensions;
};
export type AnalysisClaim = { id: string; statement: string; evidence_ids?: string[]; extensions?: Extensions };
export type AnalysisEvidence = {
  id: string; description: string; source_url?: string; segment_ids?: string[];
  kind?: "reported" | "observation" | "inference" | "synthetic";
  extensions?: Extensions;
};
export type RichAnalysis = {
  claims?: AnalysisClaim[];
  evidence?: AnalysisEvidence[];
  industry_implications?: string[];
  independent_judgment?: string;
  extensions?: Extensions;
};
export type Segment = {
  id: string; order: number; kind: "paragraph" | "heading" | "quote"; en: string; zh: string; extensions?: Extensions;
};
export type Vocabulary = {
  id: string; segment_id: string | null; example_en?: string; example_zh?: string; part_of_speech?: string;
  term: string; meaning_zh: string; meaning_en?: string; phonetic?: string; extensions?: Extensions;
};
export type RightsDeclaration = {
  rights: "owned" | "licensed" | "public_domain" | "permission_granted" | "summary_only";
  copyright: string; permission_note: string; extensions?: Extensions;
};
export type Article = {
  id: string; revision: number; upstream_snapshot?: UpstreamArticle | ChatGPTArticleV100; upstream_wrapper_extensions?: Extensions; upstream_title_zh?: string;
  title: string; title_zh: string; author: string; published_at: string; topics: string[];
  source: RightsDeclaration & { name: string; url: string };
  summary: string; segments: Segment[]; vocabulary: Vocabulary[];
  analysis: RichAnalysis & { summary_zh: string; key_points: string[]; discussion: string[]; limitations?: string };
  meta?: ProvenanceMeta; extensions?: Extensions;
};
/** Stable local contract marker retained for compatibility; it does not claim universal ChatGPT schema compatibility. */
export type ImportBatch = { contract: "bilingual-reader.provisional"; schema_version: "1.0"; articles: Article[] };
export type ArticleSummary = Pick<
  Article,
  | "id"
  | "title"
  | "title_zh"
  | "author"
  | "published_at"
  | "topics"
  | "summary"
  | "source"
> & {
  segment_count: number;
  vocabulary_count: number;
  read: boolean;
  favorite: boolean;
};
export type ArticleDetail = Article & { read: boolean; favorite: boolean };
export type Progress = {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review?: string;
};
export type SavedWord = {
  id: string;
  article_id: string;
  segment_id: string | null;
  context_kind: "source_paragraph" | "supplied_example";
  article_title: string;
  term: string;
  meaning_zh: string;
  meaning_en: string;
  phonetic: string;
  context_en: string;
  context_zh: string;
  favorite: boolean;
  saved_at: string;
  progress: Progress;
  revision: number;
};
export type Stats = {
  articles: number;
  saved: number;
  due: number;
  reviewed_today: number;
};
export type ReviewRating = 1 | 2 | 3 | 4;
export type ReviewRequest = {
  event_id: string;
  rating: ReviewRating;
  expected_revision: number;
};

export type UpstreamVocabulary = {
  id?: string; segment_id?: string | null; term: string; phonetic?: string; part_of_speech: string;
  meaning_zh: string; meaning_en?: string; example_en: string; example_zh: string; extensions?: Extensions;
};
/** Frozen observed ChatGPT 1.0 core, with explicit optional archive extensions. */
export type UpstreamArticle = {
  schema_version: "1.0"; id: string; source: string; title: string; author: string; published_at: string;
  selected_at: string; url: string; topics: string[]; selection_reason: string;
  segments: { id: string; en: string; zh: string; type: "paraphrase"; extensions?: Extensions }[];
  analysis: RichAnalysis & { summary: string; key_findings: string[]; limitations: string; discussion?: string[] };
  vocabulary: UpstreamVocabulary[];
  copyright_mode: "bilingual_paraphrase"; meta?: ProvenanceMeta; extensions?: Extensions;
};
export type UpstreamImport = {
  format: "chatgpt-observed-1.0"; revision: number; rights: RightsDeclaration;
  title_zh?: string; article: UpstreamArticle; extensions?: Extensions;
};

/** Observed current producer shape; opaque source metadata and analysis items stay lossless. */
export type ChatGPTArticleV100 = {
  schema_version: "1.0.0"; id: string; source: Extensions; title: string; author: JsonValue[];
  published_at: string; selected_at: string; url: string; topics: string[]; selection_reason: string;
  segments: { id: string; en: string; zh: string; extensions?: Extensions }[];
  analysis: {
    core_thesis: string; supporting_evidence: JsonValue[]; industry_significance: JsonValue[];
    limitations: JsonValue[]; independent_judgment: string; extensions?: Extensions;
  };
  vocabulary: (Omit<UpstreamVocabulary, "phonetic"> & { phonetic?: string | null })[]; copyright_mode: "original_summary_only";
  meta?: Extensions; extensions?: Extensions;
};
export type ChatGPTImportV100 = {
  format: "chatgpt-upstream-1.0.0"; revision: number; rights: RightsDeclaration;
  title_zh?: string; article: ChatGPTArticleV100; extensions?: Extensions;
};
