import "server-only";
import { getPool } from "@/server/db";

export type ContentNode = {
  slug: string;
  title: string | null;
  body_html: string | null;
  excerpt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured_image_source_url: string | null;
  categories: string[] | null;
  tags: string[] | null;
  post_type: string;
  published_at: string | null;
};

export async function getContentBySlugPath(
  segments: string[],
): Promise<ContentNode | null> {
  if (!process.env.DATABASE_URL?.trim()) return null;

  const slug = segments.filter(Boolean).join("/");
  if (!slug) return null;

  try {
    const pool = getPool();
    const r = await pool.query<ContentNode>(
      `SELECT slug, title, body_html, excerpt, seo_title, seo_description,
              featured_image_source_url, categories, tags, post_type, published_at
       FROM content_nodes
       WHERE slug = $1 AND status = 'publish'
       LIMIT 1`,
      [slug],
    );
    return r.rows[0] ?? null;
  } catch {
    return null;
  }
}
