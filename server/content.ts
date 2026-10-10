import { batchSchema } from "./schema.js";
import { adaptUpstream } from "./upstream-adapter.js";
import type { Article, ImportBatch } from "../shared/types.js";
export function parseContent(input: unknown): ImportBatch {
  return batchSchema.parse(
    input && typeof input === "object" && "format" in input
      ? adaptUpstream(input)
      : input,
  );
}
export function escapeMarkdownText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/[\\`*_[\]#!|~]/g, "\\$&")
    .replace(/^(\s*)([-+] |\d+\. )/gm, "$1\\$2");
}
/** Human-readable outline, preserving all values/keys for optional structured metadata. */
function outline(value: unknown, depth = 0): string {
  const indent = "  ".repeat(depth);
  if (Array.isArray(value)) return value.map((item) =>
    typeof item === "object" && item !== null
      ? `${indent}-\n${outline(item, depth + 1)}`
      : `${indent}- ${escapeMarkdownText(String(item))}`,
  ).join("\n");
  if (value !== null && typeof value === "object") return Object.entries(value).map(([key, item]) =>
    item !== null && typeof item === "object"
      ? `${indent}- ${escapeMarkdownText(key)}:\n${outline(item, depth + 1)}`
      : `${indent}- ${escapeMarkdownText(key)}: ${escapeMarkdownText(String(item))}`,
  ).join("\n");
  return escapeMarkdownText(String(value));
}
export function articleMarkdown(input: Article): string {
  const esc = escapeMarkdownText;
  const a = input;
  const lines = [
    `# ${esc(a.title)}`,
    a.title_zh === a.title ? "" : `\n${esc(a.title_zh)}`,
    `\n${esc(a.author)} · ${a.published_at}`,
    `\nArticle ID: ${esc(a.id)} · Revision: ${a.revision}`,
    `\nSource: ${esc(a.source.name)}\n\nOriginal URL: ${esc(a.source.url)}`,
    a.upstream_snapshot ? `\nSelected: ${a.upstream_snapshot.selected_at}\n\nCopyright mode: ${esc(a.upstream_snapshot.copyright_mode)}` : "",
    `\nRights: ${esc(a.source.rights)}\n\n${esc(a.source.copyright)}\n\n${esc(a.source.permission_note)}`,
    `\nTopics: ${a.topics.map(esc).join(", ")}`,
    `\nSelection / summary: ${esc(a.summary)}`,
    "\n## Bilingual reading",
  ];
  if (a.source.extensions) lines.splice(lines.length - 1, 0, `\nSource extensions:\n${outline(a.source.extensions)}`);
  for (const s of [...a.segments].sort((x, y) => x.order - y.order)) {
    lines.push(`\n### ${esc(s.id)} (${esc(s.kind)}, order ${s.order})\n\n${esc(s.en)}\n\n${esc(s.zh)}`);
    const extra = Object.fromEntries(Object.entries(s).filter(([key]) => !["id", "order", "kind", "en", "zh"].includes(key)));
    if (Object.keys(extra).length) lines.push(outline(extra));
  }
  lines.push(`\n## Analysis\n\n${esc(a.analysis.summary_zh)}`, a.analysis.key_points.map((p) => `- ${esc(p)}`).join("\n"));
  // Render every additional typed analysis field or future explicit extension.
  for (const [key, value] of Object.entries(a.analysis)) {
    if (["summary_zh", "key_points"].includes(key) || (Array.isArray(value) && !value.length)) continue;
    lines.push(`\n### ${esc(key.replace(/_/g, " "))}\n\n${outline(value)}`);
  }
  if (a.upstream_snapshot?.analysis.limitations && !("limitations" in a.analysis))
    lines.push(`\n### Limitations\n\n${outline(a.upstream_snapshot.analysis.limitations)}`);
  if (a.vocabulary.length) lines.push("\n## Vocabulary", ...a.vocabulary.map((v) =>
    `\n### ${esc(v.term)}\n\n${[v.phonetic, v.part_of_speech].filter((value): value is string => !!value).map(esc).join(" · ")}\n\n${esc(v.meaning_zh)}${v.meaning_en ? `\n\n${esc(v.meaning_en)}` : ""}\n\nID: ${esc(v.id)} · ${v.segment_id === null ? "Article-level vocabulary; no inferred segment association" : `Segment: ${esc(v.segment_id)}`}${v.example_en ? `\n\nSupplied example (not a source quotation): ${esc(v.example_en)}\n\n${esc(v.example_zh || "")}` : ""}${v.extensions ? `\n\nVocabulary extensions:\n${outline(v.extensions)}` : ""}`,
  ));
  // The authoritative JSON pair is lossless. This appendix makes all original source
  // metadata/extensions inspectable in Markdown too; JSON string escapes prevent HTML.
  const metadata = Object.fromEntries(Object.entries(a).filter(([key]) => ![
    "id", "revision", "title", "title_zh", "author", "published_at", "topics", "source", "summary", "segments", "vocabulary", "analysis",
  ].includes(key)));
  if (Object.keys(metadata).length) lines.push("\n## Complete provenance and extensions", "\n```json\n" +
    JSON.stringify(metadata, null, 2).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026") + "\n```");
  return lines.filter(Boolean).join("\n") + "\n";
}
