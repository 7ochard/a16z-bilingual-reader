/** Match a word/phrase, never a substring inside another word (e.g. AI in maintain). */
export function containsTerm(text: string, term: string): boolean {
  const normalize = (s: string) =>
    s.normalize("NFKC").trim().replace(/\s+/g, " ");
  const escaped = normalize(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!escaped) return false;
  return new RegExp(
    `(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`,
    "iu",
  ).test(normalize(text));
}
