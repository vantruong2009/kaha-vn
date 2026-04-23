import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getSitemapUrlStrings } from "@/lib/sitemap-resolve";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const urls = getSitemapUrlStrings();

  const modified = new Date();
  return urls.map((u) => {
    const url = u.startsWith("http") ? u : `${base}${u.startsWith("/") ? u : `/${u}`}`;
    return { url, lastModified: modified };
  });
}
