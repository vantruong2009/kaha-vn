/** Đồng bộ logic với `src/lib/plain-text-from-html.ts` — dùng khi import XML. */
export function plainTextFromHtml(input, options) {
  if (!input || typeof input !== "string" || !input.trim()) return null;
  let t = input.replace(/<[^>]+>/g, " ");
  t = t
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  const max = options?.maxLength;
  if (max !== undefined && max > 0 && t.length > max) {
    return `${t.slice(0, max).trimEnd()}…`;
  }
  return t || null;
}
