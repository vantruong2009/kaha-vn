import fs from "node:fs";
import path from "node:path";
import { getSiteUrl } from "@/lib/site-url";

/** `minimal` = chỉ `/` (tránh index hàng loạt URL placeholder). `full` = đọc file harvest. */
export function getSitemapUrlStrings(): string[] {
  const mode = process.env.KAHA_SITEMAP_MODE ?? "minimal";
  const base = getSiteUrl();

  if (mode !== "full") {
    return [`${base}/`];
  }

  const listPath = path.join(
    process.cwd(),
    "docs/seo-baseline/kaha-urls-from-sitemaps-20260423.txt",
  );

  try {
    return fs
      .readFileSync(listPath, "utf8")
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    return [`${base}/`];
  }
}
