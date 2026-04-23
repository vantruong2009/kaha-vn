/**
 * Chuẩn bị HTML từ WordPress trước khi đưa vào Postgres/Next.
 * Không parse DOM — chỉ loại bỏ comment Gutenberg và shortcode phổ biến (VC / gallery).
 */
export function stripWpCruft(html: string): string {
  let s = html;
  s = s.replace(/<!--\s*wp:[\s\S]*?-->/g, "");
  s = s.replace(
    /\[(?:gallery|caption|vc_row|vc_column|vc_section|vc_wp_text|vc_single_image)[^\]]*\]/gi,
    "",
  );
  s = s.replace(/\[\/?(?:vc_|gallery|caption)[^\]]*\]/gi, "");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}
