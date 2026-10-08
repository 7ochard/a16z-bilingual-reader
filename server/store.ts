import { createHash, randomUUID } from "node:crypto";
import { containsTerm } from "../shared/text.js";
import type { DatabaseSync } from "node:sqlite";
import { createEmptyCard, fsrs, type Card, type Grade } from "ts-fsrs";
import type {
  Article,
  ArticleDetail,
  ArticleSummary,
  ImportBatch,
  SavedWord,
  ReviewRequest,
} from "../shared/types.js";
import { parseContent } from "./content.js";
import { canonicalJSON } from "./canonical.js";
import { AppError } from "./schema.js";
const scheduler = fsrs({ enable_fuzz: false });
type Row = Record<string, any>;
const normalized = (s: string) =>
  s.normalize("NFKC").trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
const searchableValues = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(searchableValues).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(searchableValues).join(" ");
  return "";
};
export class Store {
  constructor(
    public db: DatabaseSync,
    public now: () => Date = () => new Date(),
  ) {}
  transaction<T>(fn: () => T): T {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const result = fn();
      this.db.exec("COMMIT");
      return result;
    } catch (e) {
      this.db.exec("ROLLBACK");
      throw e;
    }
  }
  import(input: unknown) {
    const batch = parseContent(input);
    return this.transaction(() => this.applyArticles(batch.articles));
  }
  importMany(inputs: unknown[]) {
    const articles = inputs.flatMap((input) => parseContent(input).articles);
    if (new Set(articles.map((a) => a.id)).size !== articles.length)
      throw new AppError(400, "Duplicate article IDs across archive files");
    return this.transaction(() => this.applyArticles(articles));
  }
  private applyArticles(articles: Article[]) {
    for (const article of articles) {
      const data = JSON.stringify(article);
      const hash = createHash("sha256").update(canonicalJSON(article)).digest("hex");
      const existing = this.db
        .prepare("SELECT revision,content_hash,data FROM articles WHERE id=?")
        .get(article.id) as Row | undefined;
      if (existing && article.revision < existing.revision)
        throw new AppError(
          409,
          `Article ${article.id}: revision is older than stored content`,
        );
      if (
        existing &&
        article.revision === existing.revision &&
        canonicalJSON(JSON.parse(existing.data)) !== canonicalJSON(article)
      )
        throw new AppError(
          409,
          `Article ${article.id}: changed content requires a higher revision`,
        );
      if (existing && article.revision === existing.revision) continue;
      this.db
        .prepare(
          "INSERT INTO articles(id,revision,content_hash,data) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,content_hash=excluded.content_hash,data=excluded.data",
        )
        .run(article.id, article.revision, hash, data);
      this.db
        .prepare("INSERT OR IGNORE INTO article_state(article_id) VALUES(?)")
        .run(article.id);
    }
    return { imported: articles.length };
  }
  article(id: string): ArticleDetail {
    const row = this.db
      .prepare(
        "SELECT data,is_read,favorite FROM articles JOIN article_state ON id=article_id WHERE id=?",
      )
      .get(id) as Row | undefined;
    if (!row) throw new AppError(404, "Article not found");
    const a = JSON.parse(row.data) as Article;
    return {
      ...a,
      segments: [...a.segments].sort((a, b) => a.order - b.order),
      read: !!row.is_read,
      favorite: !!row.favorite,
    };
  }
  articles(
    filters: { q?: string; topic?: string; from?: string; to?: string } = {},
  ): ArticleSummary[] {
    return (this.db.prepare("SELECT id FROM articles").all() as Row[])
      .map((r) => this.article(r.id))
      .filter((a) => {
        const query = normalized(filters.q || "");
        const { read: _read, favorite: _favorite, ...sourceArticle } = a;
        return (
          (!query ||
            normalized(searchableValues(sourceArticle)).includes(query)) &&
          (!filters.topic || a.topics.includes(filters.topic)) &&
          (!filters.from || a.published_at >= filters.from) &&
          (!filters.to || a.published_at <= filters.to)
        );
      })
      .sort(
        (a, b) =>
          b.published_at.localeCompare(a.published_at) ||
          a.id.localeCompare(b.id),
      )
      .map(
        ({
          segments,
          vocabulary,
          analysis,
          revision,
          upstream_snapshot,
          ...a
        }) => ({
          ...a,
          segment_count: segments.length,
          vocabulary_count: vocabulary.length,
        }),
      );
  }
  patchArticle(id: string, patch: { read?: boolean; favorite?: boolean }) {
    const a = this.article(id);
    this.db
      .prepare(
        "UPDATE article_state SET is_read=?,favorite=? WHERE article_id=?",
      )
      .run(
        Number(patch.read ?? a.read),
        Number(patch.favorite ?? a.favorite),
        id,
      );
    return this.article(id);
  }
  export(): ImportBatch {
    return {
      contract: "bilingual-reader.provisional",
      schema_version: "1.0",
      articles: (
        this.db.prepare("SELECT data FROM articles ORDER BY id").all() as Row[]
      ).map((r) => JSON.parse(r.data)),
    };
  }
  word(id: string): SavedWord {
    const r = this.db
      .prepare(
        "SELECT v.*,p.card,p.revision FROM saved_vocabulary v JOIN learning_progress p ON v.id=p.vocabulary_id WHERE v.id=?",
      )
      .get(id) as Row | undefined;
    if (!r) throw new AppError(404, "Vocabulary not found");
    return {
      ...JSON.parse(r.data),
      id: r.id,
      article_id: r.article_id,
      segment_id: r.segment_id,
      favorite: !!r.favorite,
      saved_at: r.saved_at,
      progress: JSON.parse(r.card),
      revision: r.revision,
    };
  }
  words(filters: { q?: string; favorites?: boolean; due?: boolean } = {}) {
    const now = this.now().toISOString();
    return (
      this.db
        .prepare("SELECT id FROM saved_vocabulary ORDER BY saved_at DESC,id")
        .all() as Row[]
    )
      .map((r) => this.word(r.id))
      .filter(
        (w) =>
          (!filters.favorites || w.favorite) &&
          (!filters.due || w.progress.due <= now) &&
          (!filters.q ||
            normalized(`${w.term} ${w.meaning_zh} ${w.meaning_en}`).includes(
              normalized(filters.q),
            )),
      )
      .sort((a, b) =>
        filters.due
          ? a.progress.due.localeCompare(b.progress.due) ||
            a.id.localeCompare(b.id)
          : b.saved_at.localeCompare(a.saved_at) || a.id.localeCompare(b.id),
      );
  }
  saveWord(input: {
    article_id: string;
    segment_id: string | null;
    vocabulary_id?: string;
    term: string;
    meaning_zh: string;
    meaning_en?: string;
    phonetic?: string;
  }) {
    return this.transaction(() => {
      const a = this.article(input.article_id),
        s = a.segments.find((s) => s.id === input.segment_id);
      const suggested = input.vocabulary_id
        ? a.vocabulary.find(
            (v) =>
              v.id === input.vocabulary_id &&
              v.segment_id === null &&
              normalized(v.term) === normalized(input.term),
          )
        : undefined;
      if (input.segment_id === null && !suggested)
        throw new AppError(
          400,
          "Article-level saves require a matching vocabulary_id",
        );
      if (input.segment_id !== null && !s)
        throw new AppError(400, "Unknown segment for this article");
      if (s && !containsTerm(s.en, input.term))
        throw new AppError(
          400,
          "The term must occur in the English source paragraph",
        );
      const existing = this.db
        .prepare(
          "SELECT id FROM saved_vocabulary WHERE article_id=? AND segment_id IS ? AND normalized_term=?",
        )
        .get(a.id, input.segment_id, normalized(input.term)) as Row | undefined;
      if (existing) return this.word(existing.id);
      const id = randomUUID(),
        now = this.now(),
        card = createEmptyCard(now);
      const data = {
        term: input.term,
        meaning_zh: input.meaning_zh,
        meaning_en: input.meaning_en || "",
        phonetic: input.phonetic || "",
        article_title: a.title,
        context_en: s?.en || suggested!.example_en!,
        context_zh: s?.zh || suggested!.example_zh!,
        context_kind: s ? "source_paragraph" : "supplied_example",
      };
      this.db
        .prepare(
          "INSERT INTO saved_vocabulary(id,article_id,segment_id,normalized_term,data,saved_at) VALUES(?,?,?,?,?,?)",
        )
        .run(
          id,
          a.id,
          input.segment_id,
          normalized(input.term),
          JSON.stringify(data),
          now.toISOString(),
        );
      this.db
        .prepare(
          "INSERT INTO learning_progress(vocabulary_id,card,due) VALUES(?,?,?)",
        )
        .run(id, JSON.stringify(card), card.due.toISOString());
      return this.word(id);
    });
  }
  patchWord(
    id: string,
    patch: { favorite?: boolean; meaning_zh?: string; meaning_en?: string },
  ) {
    const w = this.word(id);
    const {
      progress,
      revision,
      saved_at,
      favorite,
      article_id,
      segment_id,
      id: _,
      ...data
    } = w;
    this.db
      .prepare("UPDATE saved_vocabulary SET data=?,favorite=? WHERE id=?")
      .run(
        JSON.stringify({
          ...data,
          meaning_zh: patch.meaning_zh ?? data.meaning_zh,
          meaning_en: patch.meaning_en ?? data.meaning_en,
        }),
        Number(patch.favorite ?? favorite),
        id,
      );
    return this.word(id);
  }
  review(id: string, input: ReviewRequest) {
    return this.transaction(() => {
      const request = JSON.stringify({ vocabulary_id: id, ...input });
      const existing = this.db
        .prepare("SELECT request,result FROM review_events WHERE event_id=?")
        .get(input.event_id) as Row | undefined;
      if (existing) {
        if (existing.request !== request)
          throw new AppError(
            409,
            "Review event ID was already used for a different request",
          );
        return JSON.parse(existing.result) as SavedWord;
      }
      const w = this.word(id),
        now = this.now();
      if (w.revision !== input.expected_revision)
        throw new AppError(
          409,
          "This card changed on another screen. Refresh the review queue.",
        );
      if (new Date(w.progress.due) > now)
        throw new AppError(409, "This card is not due yet");
      const card = {
        ...w.progress,
        due: new Date(w.progress.due),
        ...(w.progress.last_review
          ? { last_review: new Date(w.progress.last_review) }
          : {}),
      } as Card;
      const next = scheduler.next(card, now, input.rating as Grade);
      this.db
        .prepare(
          "UPDATE learning_progress SET card=?,revision=revision+1,due=? WHERE vocabulary_id=?",
        )
        .run(JSON.stringify(next.card), next.card.due.toISOString(), id);
      const result = this.word(id);
      this.db
        .prepare(
          "INSERT INTO review_events(event_id,vocabulary_id,request,result,log,reviewed_at) VALUES(?,?,?,?,?,?)",
        )
        .run(
          input.event_id,
          id,
          request,
          JSON.stringify(result),
          JSON.stringify(next.log),
          now.toISOString(),
        );
      return result;
    });
  }
  stats() {
    return {
      articles: this.articles().length,
      saved: this.words().length,
      due: this.words({ due: true }).length,
      reviewed_today: (
        this.db
          .prepare(
            "SELECT COUNT(*) AS count FROM review_events WHERE reviewed_at>=?",
          )
          .get(this.now().toISOString().slice(0, 10) + "T00:00:00.000Z") as Row
      ).count as number,
    };
  }
}
