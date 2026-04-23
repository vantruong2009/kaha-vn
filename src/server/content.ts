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

export type ProductTeaser = {
  slug: string;
  title: string | null;
  excerpt: string | null;
  featured_image_source_url: string | null;
};

export type ShopQuery = {
  q?: string;
  category?: string;
  tag?: string;
  sort?: "newest" | "title_asc" | "title_desc";
  limit?: number;
  offset?: number;
};

export type ShopFacet = {
  value: string;
  n: number;
};

export type ShopResult = {
  items: ProductTeaser[];
  total: number;
};

/** Sản phẩm mới nhất (trang chủ). Trả [] nếu không có DB hoặc lỗi. */
export type PostTeaser = {
  slug: string;
  title: string | null;
  excerpt: string | null;
  published_at: string | null;
};

/** Bài viết (post) cho /journal và RSS. */
export async function getLatestPosts(
  limit = 48,
  offset = 0,
): Promise<PostTeaser[]> {
  if (!process.env.DATABASE_URL?.trim()) return [];

  try {
    const pool = getPool();
    const r = await pool.query<PostTeaser>(
      `SELECT slug, title, excerpt, published_at
       FROM content_nodes
       WHERE post_type = 'post' AND status = 'publish'
       ORDER BY COALESCE(published_at, imported_at) DESC NULLS LAST
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return r.rows;
  } catch {
    return [];
  }
}

export async function countPublishedPosts(): Promise<number> {
  if (!process.env.DATABASE_URL?.trim()) return 0;
  try {
    const pool = getPool();
    const r = await pool.query<{ n: number }>(
      `SELECT count(*)::int AS n FROM content_nodes
       WHERE post_type = 'post' AND status = 'publish'`,
    );
    return r.rows[0]?.n ?? 0;
  } catch {
    return 0;
  }
}

export async function getFeaturedProducts(
  limit = 6,
): Promise<ProductTeaser[]> {
  if (!process.env.DATABASE_URL?.trim()) return [];

  try {
    const pool = getPool();
    const r = await pool.query<ProductTeaser>(
      `SELECT slug, title, excerpt, featured_image_source_url
       FROM content_nodes
       WHERE post_type = 'product' AND status = 'publish'
       ORDER BY COALESCE(published_at, imported_at) DESC NULLS LAST
       LIMIT $1`,
      [limit],
    );
    return r.rows;
  } catch {
    return [];
  }
}

export async function getShopProducts(query: ShopQuery): Promise<ShopResult> {
  if (!process.env.DATABASE_URL?.trim()) return { items: [], total: 0 };

  const q = query.q?.trim() || "";
  const category = query.category?.trim() || "";
  const tag = query.tag?.trim() || "";
  const sort = query.sort ?? "newest";
  const limit = Math.max(1, Math.min(48, query.limit ?? 12));
  const offset = Math.max(0, query.offset ?? 0);

  const values: unknown[] = [];
  const where: string[] = ["post_type = 'product'", "status = 'publish'"];
  if (q) {
    values.push(`%${q}%`);
    where.push(`(title ILIKE $${values.length} OR excerpt ILIKE $${values.length})`);
  }
  if (category) {
    values.push(category);
    where.push(`$${values.length} = ANY(categories)`);
  }
  if (tag) {
    values.push(tag);
    where.push(`$${values.length} = ANY(tags)`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderSql =
    sort === "title_asc"
      ? "ORDER BY lower(COALESCE(title, slug)) ASC"
      : sort === "title_desc"
        ? "ORDER BY lower(COALESCE(title, slug)) DESC"
        : "ORDER BY COALESCE(published_at, imported_at) DESC NULLS LAST";

  try {
    const pool = getPool();
    const itemsValues = [...values, limit, offset];
    const items = await pool.query<ProductTeaser>(
      `SELECT slug, title, excerpt, featured_image_source_url
       FROM content_nodes
       ${whereSql}
       ${orderSql}
       LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      itemsValues,
    );
    const count = await pool.query<{ n: number }>(
      `SELECT count(*)::int AS n
       FROM content_nodes
       ${whereSql}`,
      values,
    );
    return { items: items.rows, total: count.rows[0]?.n ?? 0 };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getShopFacets(): Promise<{
  categories: ShopFacet[];
  tags: ShopFacet[];
}> {
  if (!process.env.DATABASE_URL?.trim()) return { categories: [], tags: [] };
  try {
    const pool = getPool();
    const [categories, tags] = await Promise.all([
      pool.query<ShopFacet>(
        `SELECT x AS value, count(*)::int AS n
         FROM content_nodes, unnest(COALESCE(categories, ARRAY[]::text[])) AS x
         WHERE post_type = 'product' AND status = 'publish'
         GROUP BY x
         ORDER BY n DESC, x ASC
         LIMIT 32`,
      ),
      pool.query<ShopFacet>(
        `SELECT x AS value, count(*)::int AS n
         FROM content_nodes, unnest(COALESCE(tags, ARRAY[]::text[])) AS x
         WHERE post_type = 'product' AND status = 'publish'
         GROUP BY x
         ORDER BY n DESC, x ASC
         LIMIT 32`,
      ),
    ]);
    return { categories: categories.rows, tags: tags.rows };
  } catch {
    return { categories: [], tags: [] };
  }
}

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
