/** Đổi `…/wp-content/uploads/…` trên kaha.vn → CDN R2/public (prefix từ env). */
const KAHA_UPLOADS =
  /https?:\/\/(?:www\.)?kaha\.vn\/wp-content\/uploads\//gi;

export function rewriteKahaMediaUrls(
  html: string,
  baseRaw = process.env.NEXT_PUBLIC_MEDIA_BASE?.trim(),
): string {
  if (!baseRaw) return html;
  const base = baseRaw.replace(/\/+$/, "");
  return html.replace(KAHA_UPLOADS, `${base}/`);
}
