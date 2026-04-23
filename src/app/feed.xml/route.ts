import { plainTextFromHtml } from "@/lib/plain-text-from-html";
import { getSiteUrl } from "@/lib/site-url";
import { escapeXml } from "@/lib/xml-escape";
import { getLatestPosts } from "@/server/content";

function rfc822(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toUTCString();
}

export async function GET() {
  const site = getSiteUrl();
  const posts = await getLatestPosts(40, 0);

  const items = posts
    .map((p) => {
      const link = `${site}/${p.slug}`;
      const title = escapeXml((p.title ?? p.slug).trim());
      const descPlain = plainTextFromHtml(p.excerpt?.trim() ?? "", {
        maxLength: 400,
      });
      const desc = descPlain
        ? `<description>${escapeXml(descPlain)}</description>`
        : "<description/>";
      const pub = rfc822(p.published_at);
      const pubEl = pub ? `<pubDate>${escapeXml(pub)}</pubDate>` : "";
      return `<item><title>${title}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid>${pubEl}${desc}</item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml("KAHA.VN — Journal")}</title>
    <link>${escapeXml(`${site}/journal`)}</link>
    <description>${escapeXml("Bài viết KAHA.VN")}</description>
    <language>vi-vn</language>
    <atom:link href="${escapeXml(`${site}/feed.xml`)}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
