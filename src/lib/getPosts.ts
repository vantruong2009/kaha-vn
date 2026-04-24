/**
 * getPosts.ts — Blog posts từ Postgres (VPS) với fallback về Supabase.
 *
 * Chiến lược:
 *   1. VPS Postgres (hasPostgresConfigured) → nguồn chính
 *   2. Supabase REST API → fallback khi Postgres không tìm thấy hoặc chưa migrate
 */

import { unstable_cache } from 'next/cache';
import type { QueryResultRow } from 'pg';
import { getPostgresPool, hasPostgresConfigured } from '@/lib/postgres/server';

// ── Supabase REST fallback ────────────────────────────────────────────────
function getSupabaseConfig(): { url: string; anon: string } | null {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return { url, anon };
}

async function fetchFromSupabase(
  path: string,
  init?: RequestInit
): Promise<unknown[] | null> {
  const cfg = getSupabaseConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: cfg.anon,
        Authorization: `Bearer ${cfg.anon}`,
        'Content-Type': 'application/json',
        ...((init?.headers as Record<string, string>) ?? {}),
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Types ────────────────────────────────────────────────────────
export interface Post {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  categories: string[];
  tags?: string[];
  date: string;
  focus_keyword?: string;
  meta_description?: string;
  meta_title?: string;
  meta_desc?: string;
  og_title?: string;
  og_desc?: string;
  og_image?: string;
  schema_jsonld?: string;
  word_count?: number;
  status?: string;
  noindex?: boolean;
  updatedAt?: string;
  thumbnailAlt?: string;
}

type PostRow = Partial<Post> & {
  slug?: string;
  categories?: string[] | string | null;
  tags?: string[] | null;
  thumbnail?: string | null;
  og_image?: string | null;
  meta_desc?: string | null;
  meta_description?: string | null;
  content?: string | null;
};

async function queryPostgres<T extends QueryResultRow = QueryResultRow>(
  query: string,
  values: unknown[] = []
): Promise<T[]> {
  if (!hasPostgresConfigured()) return [];
  try {
    const pool = getPostgresPool();
    const { rows } = await pool.query<T>(query, values);
    return rows;
  } catch (error) {
    console.error('[getPosts][postgres]', error);
    return [];
  }
}

const SELECT_FIELDS = `
  id, slug, title, excerpt, content, thumbnail, categories, tags,
  date, focus_keyword, meta_title, meta_desc, og_title, og_desc,
  og_image, schema_jsonld, status
`.trim();

const SELECT_LIST_FIELDS = `
  slug, title, excerpt, thumbnail, categories, tags, date,
  focus_keyword, meta_desc, status
`.trim();

// ── Helpers ──────────────────────────────────────────────────────
function normalize(row: PostRow): Post {
  const categories = Array.isArray(row.categories)
    ? row.categories
    : (row.categories ? [row.categories] : []);
  const tags = Array.isArray(row.tags) ? row.tags : [];
  const thumbnail = row.thumbnail || row.og_image || null;

  return {
    id: row.id,
    slug: row.slug ?? '',
    title: row.title ?? '',
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    date: row.date ?? '',
    focus_keyword: row.focus_keyword,
    meta_title: row.meta_title,
    meta_desc: row.meta_desc,
    og_title: row.og_title,
    og_desc: row.og_desc,
    og_image: row.og_image,
    schema_jsonld: row.schema_jsonld,
    status: row.status,
    meta_description: row.meta_description || row.meta_desc || '',
    categories,
    tags,
    thumbnail,
  };
}

// ── Queries ──────────────────────────────────────────────────────

/**
 * Lấy toàn bộ posts (chỉ slug + title + excerpt cho listing)
 * Cache 1 giờ
 */
export const getAllPosts = unstable_cache(
  async (): Promise<Post[]> => {
    if (hasPostgresConfigured()) {
      const pgRows = await queryPostgres<PostRow>(
        `select slug, title, excerpt, thumbnail, categories, tags, date, focus_keyword, meta_desc, status
         from public.posts
         where coalesce(status, '') <> 'deleted'
           and status = 'published'
         order by date desc
         limit 2000`
      );
      if (pgRows.length > 0) return pgRows.map((row) => normalize(row));
    }
    return [];
  },
  ['all-posts'],
  { revalidate: 86400, tags: ['posts'] }
);

/**
 * Lấy 1 post theo slug (full content)
 * Cache 24 giờ. Fallback về Supabase nếu Postgres không tìm thấy.
 */
export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    // 1️⃣ Thử VPS Postgres trước
    if (hasPostgresConfigured()) {
      const pgRows = await queryPostgres<PostRow>(
        `select ${SELECT_FIELDS}
         from public.posts
         where slug = $1
           and coalesce(status, '') <> 'deleted'
         limit 1`,
        [slug]
      );
      if (pgRows[0]) return normalize(pgRows[0]);
    }

    // 2️⃣ Fallback: Supabase REST API (posts chưa migrate sang VPS)
    const sbRows = await fetchFromSupabase(
      `posts?slug=eq.${encodeURIComponent(slug)}&status=neq.deleted&select=id,slug,title,excerpt,content,thumbnail,categories,tags,date,focus_keyword,meta_title,meta_desc,og_title,og_desc,og_image,schema_jsonld,status&limit=1`
    );
    if (sbRows && sbRows.length > 0) {
      console.info(`[getPosts] slug "${slug}" served from Supabase fallback`);
      return normalize(sbRows[0] as PostRow);
    }

    return null;
  },
  ['post-by-slug'],
  { revalidate: 3600 * 24, tags: ['posts'] }
);

/**
 * Lấy posts theo category
 */
export const getPostsByCategory = unstable_cache(
  async (category: string): Promise<Post[]> => {
    if (hasPostgresConfigured()) {
      const pgRows = await queryPostgres<PostRow>(
        `select slug, title, excerpt, thumbnail, categories, tags, date, focus_keyword, meta_desc, status
         from public.posts
         where status = 'published'
           and categories @> ARRAY[$1]::text[]
         order by date desc
         limit 100`,
        [category]
      );
      if (pgRows.length > 0) return pgRows.map((row) => normalize(row));
    }
    return [];
  },
  ['posts-by-category'],
  { revalidate: 86400, tags: ['posts'] }
);

/** Giảm lỗi PostgREST .or() khi chuỗi chứa dấu phẩy / ký tự đặc biệt LIKE */
function sanitizeSearchForIlike(s: string): string {
  return s
    .trim()
    .replace(/,/g, ' ')
    .replace(/[%_\\]/g, '')
    .slice(0, 200);
}

/**
 * Search posts (title + excerpt)
 */
export async function searchPosts(query: string): Promise<Post[]> {
  const q = sanitizeSearchForIlike(query).toLowerCase();
  if (q.length < 1) return [];

  if (hasPostgresConfigured()) {
    const like = `%${q}%`;
    const pgRows = await queryPostgres<PostRow>(
      `select slug, title, excerpt, thumbnail, categories, tags, date, focus_keyword, meta_desc, status
       from public.posts
       where status = 'published'
         and (
           lower(coalesce(title, '')) like $1
           or lower(coalesce(excerpt, '')) like $1
           or lower(coalesce(focus_keyword, '')) like $1
         )
       order by date desc
       limit 20`,
      [like]
    );
    if (pgRows.length > 0) return pgRows.map((row) => normalize(row));
  }
  return [];
}

/**
 * Lấy tất cả slugs (cho sitemap + slug-map)
 */
export const getAllPostSlugs = unstable_cache(
  async (): Promise<string[]> => {
    if (hasPostgresConfigured()) {
      const pgRows = await queryPostgres<{ slug: string }>(
        `select slug
         from public.posts
         where coalesce(status, '') <> 'deleted'
         limit 2000`
      );
      if (pgRows.length > 0) return pgRows.map((r) => r.slug);
    }
    return [];
  },
  ['all-post-slugs'],
  { revalidate: 86400, tags: ['posts'] }
);

/**
 * Trích xuất URL ảnh đầu tiên từ HTML content của bài viết
 * Dùng như fallback khi post.thumbnail bị null hoặc là local path không tồn tại
 */
export function extractFirstImageFromContent(html: string): string | null {
  if (!html) return null;
  // Match <img src="..." hoặc <img src='...'
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * Kiểm tra thumbnail có hợp lệ không (có thể hiển thị được)
 * - null/empty → không hợp lệ
 * - local path /images/ → chấp nhận (có trong git)
 * - https:// CDN → hợp lệ
 */
export function isValidThumbnail(url: string | null | undefined): boolean {
  if (!url || url.trim() === '') return false;
  return url.startsWith('https://') || url.startsWith('/images/') || url.startsWith('/');
}

/**
 * Fetch content cho danh sách slugs cụ thể — dùng để lấy ảnh đầu tiên trong bài
 * Không cache — chỉ gọi khi cần fill thumbnail thiếu
 */
export async function getPostsContentBySlug(slugs: string[]): Promise<Record<string, string>> {
  if (!slugs.length) return {};

  if (hasPostgresConfigured()) {
    const pgRows = await queryPostgres<{ slug: string; content: string }>(
      `select slug, content
       from public.posts
       where status = 'published'
         and slug = any($1::text[])`,
      [slugs]
    );
    const map: Record<string, string> = {};
    for (const row of pgRows) {
      if (row.content) map[row.slug] = row.content;
    }
    return map;
  }
  return {};
}

/**
 * Lấy N bài mới nhất (cho homepage)
 */
export const getLatestPosts = unstable_cache(
  async (limit = 6): Promise<Post[]> => {
    if (hasPostgresConfigured()) {
      const pgRows = await queryPostgres<PostRow>(
        `select slug, title, excerpt, thumbnail, categories, tags, date, focus_keyword, meta_desc, status
         from public.posts
         where status = 'published'
         order by date desc
         limit $1`,
        [limit]
      );
      if (pgRows.length > 0) return pgRows.map((row) => normalize(row));
    }
    return [];
  },
  ['latest-posts'],
  { revalidate: 86400, tags: ['posts'] }
);
