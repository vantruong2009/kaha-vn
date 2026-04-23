/** Canonical origin for metadata, robots, sitemap. No trailing slash. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://kaha.vn";
  return raw.replace(/\/$/, "");
}
