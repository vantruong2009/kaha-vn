import { hasPostgresConfigured, getPostgresPool } from '@/lib/postgres/server';

export interface PageContent {
  slug: string;
  title: string;
  content: string;
  meta_title: string;
  meta_desc: string;
}

export async function getPage(slug: string): Promise<PageContent | null> {
  if (!hasPostgresConfigured()) return null;
  try {
    const pool = getPostgresPool();
    const { rows } = await pool.query<PageContent>(
      `select slug, title, content, meta_title, meta_desc
       from public.pages
       where slug = $1
       limit 1`,
      [slug]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
