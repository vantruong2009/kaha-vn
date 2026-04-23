import type { MetadataRoute } from "next";
import { resolveSitemapAbsoluteUrls } from "@/server/sitemap-entries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = await resolveSitemapAbsoluteUrls();
  const modified = new Date();
  return urls.map((url) => ({ url, lastModified: modified }));
}
