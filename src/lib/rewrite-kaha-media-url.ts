/** Đổi `…/wp-content/uploads/…` trên kaha.vn → CDN R2/public (prefix từ env). */
const KAHA_UPLOADS =
  /https?:\/\/(?:www\.)?kaha\.vn\/wp-content\/uploads\//gi;

/** Chuẩn hóa `NEXT_PUBLIC_MEDIA_BASE` (tránh dán thừa `https://https://`). */
export function normalizeMediaBase(raw: string): string {
  let s = raw.trim().replace(/\/+$/, "");
  s = s.replace(/^https:\/\/https:\/\//i, "https://");
  s = s.replace(/^http:\/\/https:\/\//i, "https://");
  return s;
}

export function rewriteKahaMediaUrls(
  html: string,
  baseRaw = process.env.NEXT_PUBLIC_MEDIA_BASE?.trim(),
): string {
  if (!baseRaw) return html;
  const base = normalizeMediaBase(baseRaw);
  return html.replace(KAHA_UPLOADS, `${base}/`);
}
