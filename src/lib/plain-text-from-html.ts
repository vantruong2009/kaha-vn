/**
 * Bỏ thẻ HTML và entity phổ biến để hiển thị teaser (Journal, card sản phẩm).
 * Không parse DOM — không dùng cho sanitize HTML đưa vào dangerouslySetInnerHTML.
 */
export function plainTextFromHtml(
  input: string | null | undefined,
  options?: { maxLength?: number },
): string {
  if (!input?.trim()) return "";
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
  return t;
}
