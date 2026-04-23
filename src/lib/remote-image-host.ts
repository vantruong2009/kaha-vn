/** Host khớp `next.config` `images.remotePatterns` — dùng cho `next/image`. */
export function isNextImageRemoteSrc(src: string): boolean {
  try {
    const h = new URL(src).hostname;
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
