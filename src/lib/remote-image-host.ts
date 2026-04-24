import { normalizeMediaBase } from "@/lib/rewrite-kaha-media-url";

/** Host khớp `next.config` `images.remotePatterns` — dùng cho `next/image`. */
export function isNextImageRemoteSrc(src: string): boolean {
  try {
    const h = new URL(src).hostname;
    const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE?.trim();
    if (mediaBase) {
      try {
        if (h === new URL(normalizeMediaBase(mediaBase)).hostname) return true;
      } catch {
        /* ignore */
      }
    }
    return (
      h === "kaha.vn" ||
      h === "www.kaha.vn" ||
      h.endsWith(".r2.dev") ||
      h.includes("r2.cloudflarestorage.com")
    );
  } catch {
    return false;
  }
}
