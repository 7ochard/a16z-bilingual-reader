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
export function articleMarkdown(input: Article): string {
  // Imported prose is plain text, not trusted Markdown or HTML.
  const a = JSON.parse(JSON.stringify(input), (_key, value) =>
    typeof value === "string" ? escapeMarkdownText(value) : value,
  ) as Article;
  const lines = [
    `# ${a.title}`,
    a.title_zh === a.title ? "" : `\n${a.title_zh}`,
    `\n${a.author} · ${a.published_at}`,
    `\nSource: ${a.source.url}`,
    `\nRights: ${a.source.rights}\n\n${a.source.copyright}\n\n${a.source.permission_note}`,
    `\nTopics: ${a.topics.join(", ")}`,
    `\n> ${a.summary}`,
    "\n## Bilingual reading",
  ];
  for (const s of [...a.segments].sort((x, y) => x.order - y.order))
    lines.push(`\n### ${s.id}\n\n${s.en}\n\n${s.zh}`);
  lines.push(
    `\n## Analysis\n\n${a.analysis.summary_zh}`,
    a.analysis.key_points.map((p) => `- ${p}`).join("\n"),
  );
  if (a.upstream_snapshot?.analysis.limitations)
    lines.push(
      `\n### Limitations\n\n${a.upstream_snapshot.analysis.limitations}`,
    );
  if (a.analysis.discussion.length)
    lines.push(
      "\n### Discussion",
      a.analysis.discussion.map((p) => `- ${p}`).join("\n"),
    );
  if (a.vocabulary.length)
    lines.push(
      "\n## Vocabulary",
      ...a.vocabulary.map(
        (v) =>
          `\n### ${v.term}\n\n${v.meaning_zh}${v.meaning_en ? `\n\n${v.meaning_en}` : ""}${v.example_en ? `\n\nSupplied example (not a source quotation): ${v.example_en}\n\n${v.example_zh}` : ""}`,
      ),
    );
  return lines.filter(Boolean).join("\n") + "\n";
}
