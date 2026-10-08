import {
  StrictMode,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createRoot } from "react-dom/client";
import type {
  ArticleDetail,
  ArticleSummary,
  ImportBatch,
  ReviewRating,
  ReviewRequest,
  SavedWord,
  Segment,
  Stats,
  Vocabulary,
} from "../shared/types";
import { api, ApiError, errorMessage, formatDate } from "./api";
import { EmptyState, ErrorPanel, Icon, Loading, Modal } from "./components";
import "./styles.css";

type View = "library" | "vocabulary" | "review" | "reader";
type Route = { view: View; articleId?: string };
function routeFromHash(): Route {
  const [view, id] = window.location.hash.slice(1).split("/");
  if (view === "reader" && id) {
    try {
      return { view, articleId: decodeURIComponent(id) };
    } catch {
      return { view: "library" };
    }
  }
  return {
    view: view === "vocabulary" || view === "review" ? view : "library",
  };
}
function navigate(view: View, articleId?: string) {
  window.location.hash =
    view === "reader" ? `reader/${encodeURIComponent(articleId || "")}` : view;
}
function useResource<T>(path: string, version = 0) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api<T>(path, { signal: controller.signal })
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [path, version, retry]);
  return {
    data,
    setData,
    loading,
    error,
    reload: () => setRetry((value) => value + 1),
  };
}
function useDebounced(value: string) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), 220);
    return () => window.clearTimeout(timer);
  }, [value]);
  return debounced;
}
function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [version, setVersion] = useState(0);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState("");
  const stats = useResource<Stats>("/stats", version);
  useEffect(() => {
    const update = () => {
      setRoute(routeFromHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 5500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const changed = useCallback(() => setVersion((value) => value + 1), []);
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        跳转到内容
      </a>
      <aside className="sidebar">
        <a className="brand" href="#library" aria-label="Bilingual Reader 首页">
          <span className="brand-symbol">
            <Icon name="book" size={27} />
          </span>
          <span className="brand-name">
            a16z<span>READING ROOM</span>
          </span>
        </a>
        <div className="sidebar-label">YOUR LEARNING SPACE</div>
        <nav aria-label="主导航">
          <a
            className={`nav-item ${route.view === "library" || route.view === "reader" ? "active" : ""}`}
            href="#library"
            aria-current={
              route.view === "library" || route.view === "reader"
                ? "page"
                : undefined
            }
          >
            <Icon name="grid" />
            <span>
              文章库<small>Library</small>
            </span>
          </a>
          <a
            className={`nav-item ${route.view === "vocabulary" ? "active" : ""}`}
            href="#vocabulary"
            aria-current={route.view === "vocabulary" ? "page" : undefined}
          >
            <Icon name="words" />
            <span>
              生词本<small>Vocabulary</small>
            </span>
            {stats.data && (
              <span className="nav-count">{stats.data.saved}</span>
            )}
          </a>
          <a
            className={`nav-item ${route.view === "review" ? "active" : ""}`}
            href="#review"
            aria-current={route.view === "review" ? "page" : undefined}
          >
            <Icon name="review" />
            <span>
              每日复习<small>Daily review</small>
            </span>
            {stats.data && stats.data.due > 0 && (
              <span className="nav-count accent">{stats.data.due}</span>
            )}
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="small-mark">
            Aa <span>字</span>
          </div>
          <p>
            A little reading.
            <br />A wider perspective.
          </p>
          <div className="local-indicator">
            <span /> 本地学习空间
          </div>
        </div>
      </aside>
      <main
        id="main-content"
        tabIndex={-1}
        className={`main-content ${route.view === "reader" ? "reader-main" : ""}`}
      >
        <header className="topbar">
          <span>
            {route.view === "reader"
              ? "THE READING ROOM"
              : "IDEAS WORTH READING"}
          </span>
          <div className="topbar-right">
            <span className="status-dot" /> EN / 中文{" "}
            <span className="topbar-divider" />{" "}
            <span className="edition">个人阅读版</span>
          </div>
        </header>
        {route.view === "library" && (
          <Library
            version={version}
            changed={changed}
            notify={setToast}
            onImport={() => setImportOpen(true)}
          />
        )}
        {route.view === "reader" && route.articleId && (
          <Reader
            key={route.articleId}
            id={route.articleId}
            changed={changed}
            notify={setToast}
          />
        )}
        {route.view === "vocabulary" && (
          <WordLibrary version={version} changed={changed} notify={setToast} />
        )}
        {route.view === "review" && (
          <Review changed={changed} notify={setToast} />
        )}
        <footer className="page-footer">
          <span>Made for thoughtful reading.</span>
          <span>本地保存 · 日期以 UTC 为准 · 非 a16z 官方产品</span>
        </footer>
      </main>
      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onImported={(count) => {
            changed();
            setImportOpen(false);
            setToast(`已导入 ${count} 篇文章。`);
          }}
        />
      )}
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <Icon name="check" size={18} />
            {toast}
          </>
        )}
      </div>
    </div>
  );
}

function Library({
  version,
  changed,
  notify,
  onImport,
}: {
  version: number;
  changed: () => void;
  notify: (text: string) => void;
  onImport: () => void;
}) {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [state, setState] = useState("all");
  const [exportBusy, setExportBusy] = useState(false);
  const query = useDebounced(search);
  const all = useResource<{ articles: ArticleSummary[] }>("/articles", version);
  const params = new URLSearchParams({ q: query, topic, from, to });
  const articles = useResource<{ articles: ArticleSummary[] }>(
    `/articles?${params}`,
    version,
  );
  const topics = [
    ...new Set(all.data?.articles.flatMap((article) => article.topics) || []),
  ].sort();
  const filtered =
    articles.data?.articles.filter((article) =>
      state === "favorite"
        ? article.favorite
        : state === "unread"
          ? !article.read
          : true,
    ) || [];
  const reset = () => {
    setSearch("");
    setTopic("");
    setFrom("");
    setTo("");
    setState("all");
  };
  const hasFilters = !!(search || topic || from || to || state !== "all");
  async function exportContent() {
    setExportBusy(true);
    try {
      const content = await api<ImportBatch>("/export");
      const url = URL.createObjectURL(
        new Blob([JSON.stringify(content, null, 2)], {
          type: "application/json",
        }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "bilingual-reader-articles.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify("已导出文章内容。生词与学习进度不包含在此文件中。");
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      setExportBusy(false);
    }
  }
  return (
    <div className="page-body">
      <section className="library-hero">
        <div>
          <div className="eyebrow">
            <span className="short-line" /> READ. REFLECT. REMEMBER.
          </div>
          <h1>
            好想法，值得<em>读懂。</em>
          </h1>
          <p>
            在中英之间，读得更深一点。
            <br className="mobile-break" /> 收藏新词，让每一次阅读留下积累。
          </p>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <span className="orbit-line one" />
          <span className="orbit-line two" />
          <span className="hero-letter english">Aa</span>
          <span className="hero-letter chinese">知</span>
          <span className="hero-star">✳</span>
          <span className="hero-caption">TWO LANGUAGES. MORE PERSPECTIVE.</span>
        </div>
      </section>
      <div className="source-notice">
        <span className="notice-label">MVP · 内容说明</span>
        <p>
          当前仅展示导入内容；附带样本为合成测试文章，并非 a16z
          原文。已适配提供的上游 JSON
          样例；完整接口仍待对齐。请仅导入你有权使用的内容。
        </p>
      </div>
      <section aria-labelledby="library-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE LIBRARY</span>
            <h2 id="library-title">
              文章库{" "}
              <span className="heading-count">
                {all.data?.articles.length ?? "—"}
              </span>
            </h2>
          </div>
          <div className="heading-actions">
            <button
              className="button quiet export-button"
              onClick={exportContent}
              disabled={exportBusy}
            >
              <Icon name="download" size={16} />
              {exportBusy ? "导出中…" : "导出内容"}
            </button>
            <button className="button primary" onClick={onImport}>
              <Icon name="upload" size={17} />
              导入文章
            </button>
          </div>
        </div>
        <div className="filters">
          <label className="search-field">
            <Icon name="search" size={19} />
            <span className="sr-only">搜索文章</span>
            <input
              placeholder="搜索标题、摘要或主题…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                className="clear-input"
                onClick={() => setSearch("")}
                aria-label="清除搜索"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </label>
          <label className="filter-select">
            <span className="sr-only">阅读状态</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value)}
            >
              <option value="all">全部文章</option>
              <option value="unread">未读文章</option>
              <option value="favorite">已收藏</option>
            </select>
          </label>
          <details className="date-filter">
            <summary>
              <Icon name="sliders" size={17} />
              日期{(from || to) && <span className="filter-dot" />}
            </summary>
            <div className="date-popover">
              <label>
                开始日期
                <input
                  type="date"
                  value={from}
                  max={to || undefined}
                  onChange={(event) => setFrom(event.target.value)}
                />
              </label>
              <label>
                结束日期
                <input
                  type="date"
                  value={to}
                  min={from || undefined}
                  onChange={(event) => setTo(event.target.value)}
                />
              </label>
              <button
                className="text-button"
                onClick={() => {
                  setFrom("");
                  setTo("");
                }}
              >
                清除日期
              </button>
            </div>
          </details>
        </div>
        <div className="topics" aria-label="按主题筛选">
          <button
            className={`topic-chip ${topic === "" ? "selected" : ""}`}
            aria-pressed={topic === ""}
            onClick={() => setTopic("")}
          >
            全部主题
          </button>
          {topics.map((item) => (
            <button
              key={item}
              className={`topic-chip ${topic === item ? "selected" : ""}`}
              aria-pressed={topic === item}
              onClick={() => setTopic(item)}
            >
              {item}
            </button>
          ))}
          {hasFilters && (
            <button className="text-button clear-filters" onClick={reset}>
              重置筛选
            </button>
          )}
        </div>
        {from && to && from > to ? (
          <ErrorPanel message="开始日期不能晚于结束日期。" />
        ) : articles.loading ? (
          <Loading label="正在整理文章…" />
        ) : articles.error ? (
          <ErrorPanel message={articles.error} retry={articles.reload} />
        ) : filtered.length ? (
          <>
            <div className="result-note">
              {filtered.length} 篇文章 <span>按发布日期排序</span>
            </div>
            <div className="article-grid">
              {filtered.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                  onChange={changed}
                  notify={notify}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title={
              hasFilters ? "没有找到相符的文章" : "你的阅读空间，从一篇文章开始"
            }
          >
            {hasFilters
              ? "试试其他关键词，或清除筛选条件。"
              : "导入符合临时接口的 JSON 文件，即可开始中英对照阅读。"}
          </EmptyState>
        )}
      </section>
    </div>
  );
}
function ArticleCard({
  article,
  index,
  onChange,
  notify,
}: {
  article: ArticleSummary;
  index: number;
  onChange: () => void;
  notify: (text: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  async function favorite() {
    setBusy(true);
    try {
      await api(`/articles/${encodeURIComponent(article.id)}`, {
        method: "PATCH",
        body: { favorite: !article.favorite },
      });
      onChange();
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className={`article-card card-tone-${index % 3}`}>
      <div className="card-top">
        <div className="article-topics">
          {article.topics.slice(0, 2).map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
        <button
          className={`icon-button favorite ${article.favorite ? "is-favorite" : ""}`}
          onClick={favorite}
          disabled={busy}
          aria-pressed={article.favorite}
          aria-label={`${article.favorite ? "取消收藏" : "收藏文章"}：${article.title}`}
        >
          <Icon name="star" size={19} filled={article.favorite} />
        </button>
      </div>
      <a
        className="article-title-link"
        href={`#reader/${encodeURIComponent(article.id)}`}
      >
        <h3 lang="en">{article.title}</h3>
        <p className="title-zh" lang="zh-CN">
          {article.title_zh}
        </p>
      </a>
      <p className="article-summary">{article.summary}</p>
      <div className="article-meta">
        <span>{article.author}</span>
        <span>·</span>
        <time dateTime={article.published_at}>
          {formatDate(article.published_at)}
        </time>
      </div>
      <div className="card-bottom">
        <span className={`read-label ${article.read ? "read" : ""}`}>
          {article.read ? (
            <>
              <Icon name="check" size={14} />
              已读
            </>
          ) : (
            <>
              <span />
              未读
            </>
          )}
          <span className="paragraph-count">
            {article.segment_count} 段 · {article.vocabulary_count} 个词汇
          </span>
        </span>
        <a
          className="read-link"
          href={`#reader/${encodeURIComponent(article.id)}`}
          aria-label={`阅读 ${article.title}`}
        >
          <span>开始阅读</span>
          <Icon name="arrow" size={19} />
        </a>
      </div>
    </article>
  );
}

function ImportModal({
  onClose,
  onImported,
}: {
  onClose: () => void;
  onImported: (count: number) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<unknown>(null);
  const [isUpstream, setIsUpstream] = useState(false);
  const [rights, setRights] = useState("");
  const [copyright, setCopyright] = useState("");
  const [permissionNote, setPermissionNote] = useState("");
  const [revision, setRevision] = useState(1);
  const [titleZh, setTitleZh] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileAttempt = useRef(0);
  async function chooseFile(selected: File | null) {
    const attempt = ++fileAttempt.current;
    setFile(selected);
    setContent(null);
    setError("");
    setIsUpstream(false);
    if (!selected) return;
    try {
      if (selected.size > 5 * 1024 * 1024)
        throw new Error("文件超过 5 MB，请拆分为更小的文章批次。");
      const raw = await selected.text();
      if (fileAttempt.current !== attempt) return;
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        throw new Error("JSON 格式无效。请检查引号、逗号和括号后重试。");
      }
      setContent(parsed);
      setIsUpstream(
        !!parsed &&
          typeof parsed === "object" &&
          "schema_version" in parsed &&
          "segments" in parsed &&
          !("contract" in parsed) &&
          !("format" in parsed),
      );
    } catch (error) {
      if (fileAttempt.current === attempt) setError(errorMessage(error));
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file || !content) return;
    setBusy(true);
    setError("");
    try {
      const payload = isUpstream
        ? {
            format: "chatgpt-observed-1.0",
            revision,
            rights: {
              rights,
              copyright: copyright.trim(),
              permission_note: permissionNote.trim(),
            },
            ...(titleZh.trim() ? { title_zh: titleZh.trim() } : {}),
            article: content,
          }
        : content;
      const result = await api<{ imported: number }>("/import", {
        method: "POST",
        body: payload,
      });
      onImported(result.imported);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="导入你的文章" onClose={onClose} busy={busy}>
      <form onSubmit={submit}>
        <p className="modal-intro">
          上传中英对照 JSON。支持已观察到的上游 1.0
          样例、附权利声明的适配包，以及本应用的批量格式。不会自动生成翻译。
        </p>
        <div className="contract-note">
          <strong>接口仍在对齐中</strong>
          <p>
            应用批量格式：bilingual-reader.provisional / 1.0
            <br />
            上游适配格式：chatgpt-observed-1.0
          </p>
          <p>
            适配基于已提供样例，不代表完整上游接口兼容承诺。完整字段说明请参阅项目
            docs/api-contract.md。
          </p>
        </div>
        <label className="upload-zone">
          <Icon name="upload" size={29} />
          <strong>{file ? file.name : "选择 JSON 文件"}</strong>
          <span>整批校验 · 任意文章不合格则整批拒绝 · 最大 5 MB</span>
          <input
            type="file"
            accept="application/json,.json"
            aria-label="选择文章 JSON 文件"
            disabled={busy}
            onChange={(event) => {
              void chooseFile(event.target.files?.[0] || null);
            }}
          />
        </label>
        {isUpstream && (
          <fieldset className="rights-fields">
            <legend>上游文章：补充权利声明</legend>
            <p className="modal-intro">
              此文件没有使用授权字段。请填写真实的权利依据；文章来源链接并不等于使用许可。
            </p>
            <label className="form-field">
              内容使用权利
              <select
                required
                value={rights}
                onChange={(event) => setRights(event.target.value)}
              >
                <option value="">请选择你的权利依据</option>
                <option value="owned">自有内容</option>
                <option value="licensed">已获许可</option>
                <option value="public_domain">公共领域</option>
                <option value="permission_granted">已获得授权</option>
              </select>
            </label>
            <label className="form-field">
              版权声明
              <textarea
                required
                maxLength={1000}
                rows={2}
                value={copyright}
                onChange={(event) => setCopyright(event.target.value)}
              />
            </label>
            <label className="form-field">
              授权说明
              <textarea
                required
                maxLength={1000}
                rows={2}
                placeholder="说明授权来源、许可范围或公共领域依据"
                value={permissionNote}
                onChange={(event) => setPermissionNote(event.target.value)}
              />
            </label>
            <div className="import-extra-fields">
              <label className="form-field">
                内容版本
                <input
                  type="number"
                  min={1}
                  max={2147483647}
                  step={1}
                  required
                  value={revision}
                  onChange={(event) => setRevision(Number(event.target.value))}
                />
              </label>
              <label className="form-field">
                中文标题（可选）
                <input
                  maxLength={500}
                  value={titleZh}
                  onChange={(event) => setTitleZh(event.target.value)}
                  placeholder="留空则保留导入标题"
                />
              </label>
            </div>
          </fieldset>
        )}
        {error && (
          <div className="import-errors" role="alert">
            <strong>导入未完成</strong>
            <p>校验不通过时整批拒绝；若连接中断，请检查文章库后再重试。</p>
            <pre>{error}</pre>
          </div>
        )}
        <p className="small-print">
          请仅导入你有权使用的内容。来源、版权及授权说明会随文章保留。相同 ID
          的新内容须使用更高的版本号。
        </p>
        <div className="modal-actions">
          <button
            type="button"
            className="button secondary"
            disabled={busy}
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="submit"
            className="button primary"
            disabled={
              !content ||
              busy ||
              (isUpstream &&
                (!rights || !copyright.trim() || !permissionNote.trim()))
            }
          >
            {busy
              ? "校验并导入中…"
              : isUpstream
                ? "确认权利并导入"
                : "导入文章"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

type WordDraft = {
  segment: Segment | null;
  term: string;
  suggestion?: Vocabulary;
};
function Reader({
  id,
  changed,
  notify,
}: {
  id: string;
  changed: () => void;
  notify: (text: string) => void;
}) {
  const resource = useResource<ArticleDetail>(
    `/articles/${encodeURIComponent(id)}`,
  );
  const [mode, setMode] = useState<"both" | "en" | "zh">("both");
  const [tab, setTab] = useState<"article" | "analysis">("article");
  const [draft, setDraft] = useState<WordDraft | null>(null);
  const [selection, setSelection] = useState<{
    segment: Segment;
    term: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const article = resource.data;
  async function patch(body: { read?: boolean; favorite?: boolean }) {
    setBusy(true);
    try {
      resource.setData(
        await api<ArticleDetail>(`/articles/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body,
        }),
      );
      changed();
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  function captureSelection(segment: Segment, element: HTMLElement) {
    const selected = window.getSelection();
    const term = selected?.toString().trim();
    const english = element.querySelector(".segment-en");
    if (
      !term ||
      !selected?.anchorNode ||
      !selected.focusNode ||
      !english?.contains(selected.anchorNode) ||
      !english.contains(selected.focusNode)
    ) {
      setSelection(null);
      return;
    }
    if (term.length <= 200) setSelection({ segment, term });
  }
  if (resource.loading) return <Loading label="正在打开文章…" />;
  if (resource.error)
    return (
      <div className="page-body">
        <button className="back-link" onClick={() => navigate("library")}>
          <Icon name="chevron" size={16} />
          返回文章库
        </button>
        <ErrorPanel message={resource.error} retry={resource.reload} />
      </div>
    );
  if (!article) return null;
  return (
    <div className="reader-page">
      <div className="reader-breadcrumb">
        <a className="back-link" href="#library">
          <Icon name="chevron" size={16} />
          文章库
        </a>
        <span>/</span>
        <span>中英精读</span>
      </div>
      <header className="reader-header">
        <div className="article-topics">
          {article.topics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>
        <h1 lang="en">{article.title}</h1>
        <p className="reader-title-zh" lang="zh-CN">
          {article.title_zh}
        </p>
        <div className="reader-byline">
          <span>{article.author}</span>
          <span>·</span>
          <time dateTime={article.published_at}>
            {formatDate(article.published_at)}
          </time>
          <span>·</span>
          <span>{article.segments.length} 段</span>
        </div>
        <div className="reader-actions">
          <button
            className={`button secondary ${article.read ? "is-active" : ""}`}
            disabled={busy}
            aria-pressed={article.read}
            onClick={() => patch({ read: !article.read })}
          >
            <Icon name="check" size={17} />
            {article.read ? "已读" : "标记已读"}
          </button>
          <button
            className={`button secondary ${article.favorite ? "is-favorite" : ""}`}
            disabled={busy}
            aria-pressed={article.favorite}
            onClick={() => patch({ favorite: !article.favorite })}
          >
            <Icon name="star" size={17} filled={article.favorite} />
            {article.favorite ? "已收藏" : "收藏文章"}
          </button>
          <a
            className="button quiet"
            href={article.source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            查看来源
            <Icon name="external" size={15} />
          </a>
        </div>
      </header>
      <div className="reading-toolbar">
        <div
          className="reading-tabs"
          role="tablist"
          aria-label="阅读内容"
          onKeyDown={(event) => {
            if (
              ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
            ) {
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? "article"
                  : event.key === "End"
                    ? "analysis"
                    : tab === "article"
                      ? "analysis"
                      : "article";
              setTab(next);
              document.getElementById(`${next}-tab`)?.focus();
            }
          }}
        >
          <button
            role="tab"
            tabIndex={tab === "article" ? 0 : -1}
            aria-selected={tab === "article"}
            aria-controls="article-panel"
            id="article-tab"
            onClick={() => setTab("article")}
          >
            正文
          </button>
          <button
            role="tab"
            tabIndex={tab === "analysis" ? 0 : -1}
            aria-selected={tab === "analysis"}
            aria-controls="analysis-panel"
            id="analysis-tab"
            onClick={() => setTab("analysis")}
          >
            文章解析
          </button>
        </div>
        {tab === "article" && (
          <div className="language-switch" aria-label="阅读语言">
            {(["both", "en", "zh"] as const).map((value) => (
              <button
                key={value}
                aria-pressed={mode === value}
                className={mode === value ? "selected" : ""}
                onClick={() => {
                  setMode(value);
                  setSelection(null);
                }}
              >
                {value === "both" ? "双语" : value === "en" ? "EN" : "中文"}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="reading-layout">
        <div className="reading-content">
          {tab === "article" ? (
            <section
              id="article-panel"
              role="tabpanel"
              aria-labelledby="article-tab"
            >
              <div className="reading-tip">
                <Icon name="plus" size={15} />
                {mode === "zh"
                  ? "点击每段右侧的 ＋，添加对应英文原文中的词语"
                  : "划选英文收藏新词，或点击每段右侧的 ＋"}
              </div>
              {article.segments
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((segment, index) => (
                  <article
                    className={`reading-segment segment-${segment.kind}`}
                    key={segment.id}
                  >
                    <span className="segment-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div
                      className="segment-text"
                      onMouseUp={(event) =>
                        captureSelection(segment, event.currentTarget)
                      }
                      onKeyUp={(event) =>
                        captureSelection(segment, event.currentTarget)
                      }
                      onTouchEnd={(event) => {
                        const element = event.currentTarget;
                        window.setTimeout(
                          () => captureSelection(segment, element),
                          80,
                        );
                      }}
                    >
                      {mode !== "zh" && (
                        <div className="segment-en" lang="en">
                          {segment.en}
                        </div>
                      )}
                      {mode !== "en" && (
                        <div className="segment-zh" lang="zh-CN">
                          {segment.zh}
                        </div>
                      )}
                    </div>
                    <button
                      className="paragraph-add icon-button"
                      aria-label={`收藏第 ${index + 1} 段的词语`}
                      title="添加生词"
                      onClick={() => {
                        setDraft({ segment, term: "" });
                        setSelection(null);
                      }}
                    >
                      <Icon name="plus" size={17} />
                    </button>
                  </article>
                ))}
              <div className="reading-end">
                <span>END OF ARTICLE</span>
                <button
                  className={`button ${article.read ? "secondary" : "primary"}`}
                  disabled={busy}
                  onClick={() => patch({ read: !article.read })}
                >
                  <Icon name="check" size={17} />
                  {article.read ? "已完成阅读" : "完成阅读，标记已读"}
                </button>
              </div>
            </section>
          ) : (
            <section
              className="analysis-panel"
              id="analysis-panel"
              role="tabpanel"
              aria-labelledby="analysis-tab"
            >
              <span className="eyebrow">A CLOSER LOOK</span>
              <h2>把观点，读成自己的思考。</h2>
              <p className="analysis-disclaimer">以下解析来自导入文件。</p>
              <div className="analysis-section">
                <span className="analysis-index">01</span>
                <div>
                  <h3>内容摘要</h3>
                  <p>{article.analysis.summary_zh || "该文章未提供摘要。"}</p>
                </div>
              </div>
              <div className="analysis-section">
                <span className="analysis-index">02</span>
                <div>
                  <h3>核心观点</h3>
                  {article.analysis.key_points.length ? (
                    <ul>
                      {article.analysis.key_points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>该文章未提供核心观点。</p>
                  )}
                </div>
              </div>
              <div className="analysis-section">
                <span className="analysis-index">03</span>
                <div>
                  <h3>延伸思考</h3>
                  {article.analysis.discussion.length ? (
                    <ol>
                      {article.analysis.discussion.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ol>
                  ) : (
                    <p>该文章未提供讨论问题。</p>
                  )}
                </div>
              </div>
              {article.upstream_snapshot?.analysis.limitations && (
                <div className="analysis-section analysis-caveat">
                  <span className="analysis-index">04</span>
                  <div>
                    <h3>局限与注意事项</h3>
                    <p>{article.upstream_snapshot.analysis.limitations}</p>
                  </div>
                </div>
              )}
            </section>
          )}
          <section className="source-details" aria-labelledby="source-heading">
            <h3 id="source-heading">来源与使用许可</h3>
            <a
              href={article.source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.source.name}
              <Icon name="external" size={13} />
            </a>
            <dl>
              <div>
                <dt>权利状态</dt>
                <dd>
                  {
                    {
                      owned: "自有内容",
                      licensed: "已获许可",
                      public_domain: "公共领域",
                      permission_granted: "已获得授权",
                    }[article.source.rights]
                  }
                </dd>
              </div>
              <div>
                <dt>版权声明</dt>
                <dd>{article.source.copyright}</dd>
              </div>
              <div>
                <dt>授权说明</dt>
                <dd>{article.source.permission_note}</dd>
              </div>
            </dl>
          </section>
        </div>
        <aside className="reader-aside">
          <div className="word-suggestions">
            <div className="eyebrow">WORDS TO NOTICE</div>
            <h2>
              随文词汇 <span>{article.vocabulary.length}</span>
            </h2>
            <p className="aside-note">来自文章的词汇建议，点击加入生词本。</p>
            {article.vocabulary.length ? (
              article.vocabulary.map((word) => (
                <button
                  className="suggested-word"
                  key={word.id}
                  onClick={() => {
                    const segment = article.segments.find(
                      (item) => item.id === word.segment_id,
                    );
                    if (segment || word.segment_id === null)
                      setDraft({
                        segment: segment || null,
                        term: word.term,
                        suggestion: word,
                      });
                  }}
                >
                  <span>
                    <strong lang="en">{word.term}</strong>
                    <small>{word.meaning_zh}</small>
                  </span>
                  <Icon name="plus" size={16} />
                </button>
              ))
            ) : (
              <p className="muted">没有预设词汇。可从正文添加。</p>
            )}
          </div>
          <div className="reader-note">
            <span className="small-mark">
              Aa <span>字</span>
            </span>
            <p>
              先读原文，再看译文。
              <br />
              给理解一点空间。
            </p>
          </div>
        </aside>
      </div>
      {selection && (
        <div className="selection-bar">
          <span>
            {selection.term.length > 35
              ? `${selection.term.slice(0, 35)}…`
              : selection.term}
          </span>
          <button
            className="button primary"
            onClick={() => {
              setDraft(selection);
              setSelection(null);
            }}
          >
            <Icon name="plus" size={16} />
            收藏词语
          </button>
          <button
            className="icon-button"
            aria-label="关闭选词提示"
            onClick={() => setSelection(null)}
          >
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
      {draft && (
        <SaveWordModal
          article={article}
          draft={draft}
          onClose={() => setDraft(null)}
          onSaved={() => {
            setDraft(null);
            changed();
            notify("已保存到生词本，可以开始复习。");
          }}
        />
      )}
    </div>
  );
}

function SaveWordModal({
  article,
  draft,
  onClose,
  onSaved,
}: {
  article: ArticleDetail;
  draft: WordDraft;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [term, setTerm] = useState(draft.term);
  const [meaningZh, setMeaningZh] = useState(
    draft.suggestion?.meaning_zh || "",
  );
  const [meaningEn, setMeaningEn] = useState(
    draft.suggestion?.meaning_en || "",
  );
  const [phonetic, setPhonetic] = useState(draft.suggestion?.phonetic || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const suggestions = article.vocabulary.filter((word) =>
    draft.segment
      ? word.segment_id === draft.segment.id
      : word.id === draft.suggestion?.id,
  );
  function choose(word: Vocabulary) {
    setTerm(word.term);
    setMeaningZh(word.meaning_zh);
    setMeaningEn(word.meaning_en || "");
    setPhonetic(word.phonetic || "");
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/vocabulary", {
        method: "POST",
        body: {
          article_id: article.id,
          segment_id: draft.segment?.id ?? null,
          ...(draft.segment ? {} : { vocabulary_id: draft.suggestion?.id }),
          term: term.trim(),
          meaning_zh: meaningZh.trim(),
          ...(meaningEn.trim() ? { meaning_en: meaningEn.trim() } : {}),
          ...(phonetic.trim() ? { phonetic: phonetic.trim() } : {}),
        },
      });
      onSaved();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="让一个新词留下来" onClose={onClose} busy={busy}>
      <form onSubmit={submit}>
        <p className="modal-intro">
          {draft.segment
            ? "保留原文上下文。释义可手动填写，或使用这段文章附带的词汇建议。"
            : "这是一条文章级词汇建议。保留导入文件提供的例句，例句不代表原文段落。"}
        </p>
        {suggestions.length > 0 && (
          <div className="suggestion-choices">
            <span>文章建议</span>
            {suggestions.map((word) => (
              <button
                type="button"
                key={word.id}
                className="topic-chip"
                onClick={() => choose(word)}
              >
                {word.term}
              </button>
            ))}
          </div>
        )}
        <label className="form-field">
          英文词语 / 短语
          <input
            autoFocus
            required
            readOnly={!draft.segment}
            maxLength={200}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="填写这段英文原文中出现的词语"
          />
        </label>
        <label className="form-field">
          中文释义
          <textarea
            required
            maxLength={2000}
            value={meaningZh}
            onChange={(event) => setMeaningZh(event.target.value)}
            placeholder="填写你的理解，或点击上方的文章建议"
            rows={2}
          />
        </label>
        <label className="form-field">
          英文释义 <span>可选</span>
          <textarea
            maxLength={2000}
            value={meaningEn}
            onChange={(event) => setMeaningEn(event.target.value)}
            rows={2}
          />
        </label>
        <label className="form-field">
          音标 <span>可选</span>
          <input
            maxLength={200}
            value={phonetic}
            onChange={(event) => setPhonetic(event.target.value)}
          />
        </label>
        <p className="small-print">
          同一段中的同一词语仅保存一次；已有词条会保留释义与复习进度。
        </p>
        <details className="context-preview">
          <summary>
            {draft.segment ? "查看原文上下文" : "查看所提供的例句"}
          </summary>
          <p lang="en">{draft.segment?.en || draft.suggestion?.example_en}</p>
          <p lang="zh-CN">
            {draft.segment?.zh || draft.suggestion?.example_zh}
          </p>
        </details>
        {error && <ErrorPanel message={error} />}
        <div className="modal-actions">
          <button
            type="button"
            className="button secondary"
            onClick={onClose}
            disabled={busy}
          >
            取消
          </button>
          <button
            className="button primary"
            type="submit"
            disabled={busy || !term.trim() || !meaningZh.trim()}
          >
            {busy ? "保存中…" : "保存到生词本"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function WordLibrary({
  version,
  changed,
  notify,
}: {
  version: number;
  changed: () => void;
  notify: (text: string) => void;
}) {
  const [search, setSearch] = useState("");
  const query = useDebounced(search);
  const [filter, setFilter] = useState("all");
  const params = new URLSearchParams({
    q: query,
    favorites: String(filter === "favorite"),
    due: String(filter === "due"),
  });
  const words = useResource<{ vocabulary: SavedWord[] }>(
    `/vocabulary?${params}`,
    version,
  );
  return (
    <div className="page-body">
      <div className="page-title">
        <div className="eyebrow">YOUR GROWING VOCABULARY</div>
        <h1>
          读过的词，<em>记得更久。</em>
        </h1>
        <p>每一个新词，都带着它最初的语境。</p>
      </div>
      <div className="section-heading">
        <h2>
          我的生词本{" "}
          <span className="heading-count">
            {words.data?.vocabulary.length ?? "—"}
          </span>
        </h2>
        <a className="button primary" href="#review">
          <Icon name="review" size={18} />
          开始复习
        </a>
      </div>
      <div className="filters">
        <label className="search-field">
          <Icon name="search" size={19} />
          <span className="sr-only">搜索生词</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="搜索词语或释义…"
          />
        </label>
        <div className="filter-pills" aria-label="筛选生词">
          {[
            ["all", "全部"],
            ["favorite", "已收藏"],
            ["due", "待复习"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={filter === value}
              className={filter === value ? "selected" : ""}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {words.loading ? (
        <Loading label="正在整理生词…" />
      ) : words.error ? (
        <ErrorPanel message={words.error} retry={words.reload} />
      ) : words.data?.vocabulary.length ? (
        <div className="word-list">
          {words.data.vocabulary.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onChange={changed}
              notify={notify}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="words"
          title={
            search || filter !== "all"
              ? "这里暂时没有匹配的生词"
              : "把遇见的新词，收进这里"
          }
          action={
            <a href="#library" className="button secondary">
              去读一篇文章
              <Icon name="arrow" size={17} />
            </a>
          }
        >
          阅读时划选词语，或使用每段旁的添加按钮。保存的释义和上下文会一起留在这里。
        </EmptyState>
      )}
    </div>
  );
}
function WordCard({
  word,
  onChange,
  notify,
}: {
  word: SavedWord;
  onChange: () => void;
  notify: (text: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState(false);
  async function favorite() {
    setBusy(true);
    try {
      await api(`/vocabulary/${encodeURIComponent(word.id)}`, {
        method: "PATCH",
        body: { favorite: !word.favorite },
      });
      onChange();
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="word-card">
      <div className="word-card-top">
        <div>
          <h3 lang="en">{word.term}</h3>
          {word.phonetic && <span className="phonetic">{word.phonetic}</span>}
        </div>
        <button
          className={`icon-button ${word.favorite ? "is-favorite" : ""}`}
          aria-label={`${word.favorite ? "取消收藏生词" : "收藏生词"}：${word.term}`}
          aria-pressed={word.favorite}
          disabled={busy}
          onClick={favorite}
        >
          <Icon name="star" size={19} filled={word.favorite} />
        </button>
      </div>
      <p className="word-meaning" lang="zh-CN">
        {word.meaning_zh}
      </p>
      {word.meaning_en && (
        <p className="word-meaning-en" lang="en">
          {word.meaning_en}
        </p>
      )}
      <details className="word-context">
        <summary>
          {word.context_kind === "supplied_example"
            ? "所提供的例句（非原文段落）"
            : "原文上下文"}
        </summary>
        <p lang="en">{word.context_en}</p>
        <p lang="zh-CN">{word.context_zh}</p>
      </details>
      <div className="word-card-bottom">
        <a
          href={`#reader/${encodeURIComponent(word.article_id)}`}
          title={word.article_title}
        >
          <Icon name="book" size={14} />
          {word.article_title}
        </a>
        <button className="text-button" onClick={() => setEdit(true)}>
          编辑释义
        </button>
      </div>
      <div className="word-schedule">
        <span>
          <Icon name="clock" size={13} />
          {new Date(word.progress.due) <= new Date()
            ? "现在可复习"
            : `下次 ${formatDate(word.progress.due, true)} UTC`}
        </span>
        <span>已复习 {word.progress.reps} 次</span>
      </div>
      {edit && (
        <EditWordModal
          word={word}
          onClose={() => setEdit(false)}
          onSaved={() => {
            setEdit(false);
            onChange();
            notify("释义已更新。");
          }}
        />
      )}
    </article>
  );
}
function EditWordModal({
  word,
  onClose,
  onSaved,
}: {
  word: SavedWord;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [zh, setZh] = useState(word.meaning_zh);
  const [en, setEn] = useState(word.meaning_en);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(`/vocabulary/${encodeURIComponent(word.id)}`, {
        method: "PATCH",
        body: { meaning_zh: zh.trim(), meaning_en: en.trim() },
      });
      onSaved();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={`编辑释义：${word.term}`} onClose={onClose} busy={busy}>
      <form onSubmit={submit}>
        <label className="form-field">
          中文释义
          <textarea
            value={zh}
            maxLength={2000}
            required
            rows={3}
            onChange={(event) => setZh(event.target.value)}
          />
        </label>
        <label className="form-field">
          英文释义 <span>可选</span>
          <textarea
            value={en}
            maxLength={2000}
            rows={3}
            onChange={(event) => setEn(event.target.value)}
          />
        </label>
        {error && <ErrorPanel message={error} />}
        <div className="modal-actions">
          <button
            type="button"
            className="button secondary"
            onClick={onClose}
            disabled={busy}
          >
            取消
          </button>
          <button className="button primary" disabled={busy || !zh.trim()}>
            {busy ? "保存中…" : "保存修改"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Review({
  changed,
  notify,
}: {
  changed: () => void;
  notify: (text: string) => void;
}) {
  const resource = useResource<{ vocabulary: SavedWord[] }>("/review");
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uncertain, setUncertain] = useState(false);
  const pending = useRef<{ wordId: string; request: ReviewRequest } | null>(
    null,
  );
  const word = resource.data?.vocabulary[0];
  const guard = useRef(false);
  useEffect(() => {
    setRevealed(false);
  }, [word?.id]);
  async function rate(rating?: ReviewRating) {
    if (guard.current || !word || !revealed) return;
    if (!pending.current && rating)
      pending.current = {
        wordId: word.id,
        request: {
          event_id: crypto.randomUUID(),
          rating,
          expected_revision: word.revision,
        },
      };
    if (!pending.current) return;
    guard.current = true;
    setBusy(true);
    setError("");
    try {
      const attempt = pending.current;
      await api<SavedWord>(
        `/vocabulary/${encodeURIComponent(attempt.wordId)}/review`,
        { method: "POST", body: attempt.request },
      );
      pending.current = null;
      setUncertain(false);
      setCompleted((value) => value + 1);
      setRevealed(false);
      changed();
      resource.reload();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        pending.current = null;
        setUncertain(false);
        setRevealed(false);
        resource.reload();
        changed();
        notify(
          "这张卡片已发生更新，已重新载入最新复习队列。请重新查看后评分。",
        );
      } else {
        setUncertain(true);
        setError(
          `${errorMessage(error)} 请使用“重试本次评分”，会沿用同一事件编号，避免重复记录。`,
        );
      }
    } finally {
      guard.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="page-body review-page">
      <div className="page-title">
        <div className="eyebrow">A LITTLE PRACTICE, EVERY DAY</div>
        <h1>
          让记忆，<em>慢慢扎根。</em>
        </h1>
        <p>先回想，再揭晓。按真实记忆程度评分。</p>
      </div>
      <div className="review-progress">
        <span>
          <Icon name="review" size={18} />
          本次已复习 <strong>{completed}</strong> 个
        </span>
        <span>
          待复习 <strong>{resource.data?.vocabulary.length ?? "—"}</strong> 个
        </span>
      </div>
      {resource.loading ? (
        <Loading label="正在获取待复习卡片…" />
      ) : resource.error ? (
        <ErrorPanel message={resource.error} retry={resource.reload} />
      ) : !word ? (
        <EmptyState
          icon="check"
          title={completed ? "这一轮，学得不错。" : "现在没有待复习的卡片"}
          action={
            <a className="button primary" href="#library">
              回到阅读
              <Icon name="arrow" size={17} />
            </a>
          }
        >
          {completed
            ? `你刚刚完成了 ${completed} 次复习。按复习计划回来，给记忆一点时间。`
            : "新保存的词语会进入复习队列。也可以稍后回来查看到期卡片。"}
        </EmptyState>
      ) : (
        <>
          <article className="review-card">
            <div className="review-card-label">
              <span>RECALL THE MEANING</span>
              <span>
                {word.progress.reps === 0
                  ? "新词"
                  : `已复习 ${word.progress.reps} 次`}
              </span>
            </div>
            <div className="review-term">
              <h2 lang="en">{word.term}</h2>
              {word.phonetic && <span>{word.phonetic}</span>}
            </div>
            <div className="review-context">
              <span>
                {word.context_kind === "supplied_example"
                  ? "SUPPLIED EXAMPLE · 导入例句，非原文段落"
                  : "IN CONTEXT · 原文上下文"}
              </span>
              <p lang="en">{word.context_en}</p>
              <a href={`#reader/${encodeURIComponent(word.article_id)}`}>
                {word.article_title}
                <Icon name="external" size={12} />
              </a>
            </div>
            {revealed ? (
              <div className="review-answer" aria-live="polite">
                <span className="eyebrow">THE MEANING</span>
                <h3 lang="zh-CN">{word.meaning_zh}</h3>
                {word.meaning_en && <p lang="en">{word.meaning_en}</p>}
                <p className="review-context-zh" lang="zh-CN">
                  {word.context_zh}
                </p>
              </div>
            ) : (
              <div className="review-reveal">
                <p>这个词是什么意思？在心里想一想。</p>
                <button
                  className="button primary"
                  onClick={() => setRevealed(true)}
                >
                  显示释义
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            )}
          </article>
          {error && <ErrorPanel message={error} />}
          {revealed && (
            <div className="review-rating">
              <p>你的记忆有多清晰？</p>
              {uncertain ? (
                <button
                  className="button primary"
                  disabled={busy}
                  onClick={() => rate()}
                >
                  {busy ? "正在确认…" : "重试本次评分"}
                </button>
              ) : (
                <div className="rating-buttons">
                  {(
                    [
                      {
                        rating: 1,
                        name: "重来",
                        en: "Again",
                        hint: "还没记住",
                      },
                      { rating: 2, name: "困难", en: "Hard", hint: "勉强想起" },
                      { rating: 3, name: "良好", en: "Good", hint: "正常想起" },
                      { rating: 4, name: "简单", en: "Easy", hint: "轻松记得" },
                    ] as const
                  ).map((item) => (
                    <button
                      className={`rating-button rating-${item.rating}`}
                      key={item.rating}
                      disabled={busy}
                      onClick={() => rate(item.rating)}
                      aria-label={`${item.en} ${item.name}`}
                    >
                      <strong>
                        {item.name}
                        <small>{item.en}</small>
                      </strong>
                      <span>{item.hint}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <p className="review-footnote">
            复习时间由 FSRS 排期 · 评分完成后自动保存
          </p>
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
