import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import { getSiteUrl } from "@/lib/site-url";

const URL_LIST = "docs/seo-baseline/kaha-urls-from-sitemaps-20260423.txt";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const listPath = path.join(process.cwd(), URL_LIST);
  let urls: string[] = [];
  try {
    urls = fs
      .readFileSync(listPath, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    urls = [`${base}/`];
  }

  const modified = new Date();
  return urls.map((u) => {
    const url = u.startsWith("http") ? u : `${base}${u.startsWith("/") ? u : `/${u}`}`;
    return { url, lastModified: modified };
  });
}
