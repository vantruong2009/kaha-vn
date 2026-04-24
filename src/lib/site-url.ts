/** Canonical origin for metadata, robots, sitemap. No trailing slash. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    "https://kaha.vn";
  return raw.replace(/\/+$/, "");
}

/** Alias cho code ported từ longdenviet — đồng nhất origin, không trailing slash. */
export function getPublicSiteUrl(): string {
  return getSiteUrl();
}
