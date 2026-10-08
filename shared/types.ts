export type Segment = {
  id: string;
  order: number;
  kind: "paragraph" | "heading" | "quote";
  en: string;
  zh: string;
};
export type Vocabulary = {
  id: string;
  segment_id: string | null;
  example_en?: string;
  example_zh?: string;
  part_of_speech?: string;
  term: string;
  meaning_zh: string;
  meaning_en?: string;
  phonetic?: string;
};
export type Article = {
  id: string;
  revision: number;
  upstream_snapshot?: UpstreamArticle;
  title: string;
  title_zh: string;
  author: string;
  published_at: string;
  topics: string[];
  source: {
    name: string;
    url: string;
    rights: "owned" | "licensed" | "public_domain" | "permission_granted";
    copyright: string;
    permission_note: string;
  };
  summary: string;
  segments: Segment[];
  vocabulary: Vocabulary[];
  analysis: { summary_zh: string; key_points: string[]; discussion: string[] };
};
/** Provisional app contract; not a claim of compatibility with the unseen upstream schema 1.0. */
export type ImportBatch = {
  contract: "bilingual-reader.provisional";
  schema_version: "1.0";
  articles: Article[];
};
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

export type UpstreamArticle = {
  schema_version: "1.0";
  id: string;
  source: string;
  title: string;
  author: string;
  published_at: string;
  selected_at: string;
  url: string;
  topics: string[];
  selection_reason: string;
  segments: { id: string; en: string; zh: string; type: "paraphrase" }[];
  analysis: { summary: string; key_findings: string[]; limitations: string };
  vocabulary: {
    term: string;
    phonetic?: string;
    part_of_speech: string;
    meaning_zh: string;
    example_en: string;
    example_zh: string;
  }[];
  copyright_mode: "bilingual_paraphrase";
};
