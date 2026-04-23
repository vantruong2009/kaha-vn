import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getSiteUrl } from "@/lib/site-url";
import { getPool } from "@/server/db";

const HARVEST_FILE =
  "docs/seo-baseline/kaha-urls-from-sitemaps-20260423.txt";

function withAppRoutes(urls: Set<string>, base: string) {
  urls.add(`${base}/`);
  urls.add(`${base}/journal`);
  urls.add(`${base}/shop`);
  urls.add(`${base}/showroom`);
  urls.add(`${base}/lookbook`);
  urls.add(`${base}/moodboard`);
  urls.add(`${base}/feed.xml`);
}

/** Absolute URLs cho sitemap.xml (minimal | full | db). */
export async function resolveSitemapAbsoluteUrls(): Promise<string[]> {
  const mode = process.env.KAHA_SITEMAP_MODE ?? "minimal";
  const base = getSiteUrl();

  if (mode === "minimal") {
    const u = new Set<string>();
    withAppRoutes(u, base);
    return [...u];
  }

  if (mode === "full") {
    const listPath = path.join(process.cwd(), HARVEST_FILE);
    const u = new Set<string>();
    withAppRoutes(u, base);
    try {
      const raw = fs.readFileSync(listPath, "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const l = line.trim();
        if (!l) continue;
        const abs = l.startsWith("http")
          ? l
          : `${base}${l.startsWith("/") ? l : `/${l}`}`;
        u.add(abs);
      }
    } catch {
      /* keep app routes only */
    }
    return [...u];
  }

  if (mode === "db") {
    const u = new Set<string>();
    withAppRoutes(u, base);
    if (!process.env.DATABASE_URL?.trim()) return [...u];
    try {
      const pool = getPool();
      const r = await pool.query<{ slug: string }>(
        `SELECT slug FROM content_nodes WHERE status = 'publish' ORDER BY slug`,
      );
      for (const row of r.rows) {
        const s = (row.slug ?? "").replace(/^\/+/, "").replace(/\/+$/, "");
        if (s) u.add(`${base}/${s}`);
      }
    } catch {
      /* app routes only */
    }
    return [...u];
  }

  const u = new Set<string>();
  withAppRoutes(u, base);
  return [...u];
}
