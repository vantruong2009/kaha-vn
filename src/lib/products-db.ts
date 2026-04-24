/**
 * Fetch products từ Postgres (VPS) — server / API.
 * Đọc từ content_nodes (post_type='product') — bảng products chưa tồn tại.
 */
import type { Product } from '@/data/products';
import { getPostgresPool, hasPostgresConfigured } from '@/lib/postgres/server';

interface ContentNodeRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_source_url: string | null;
  categories: string[] | null;
  tags: string[] | null;
  published_at: string | null;
}

function mapToProduct(p: ContentNodeRow): Product {
  const image = p.featured_image_source_url ?? '';
  const cats = p.categories ?? [];
  const allTags = [...cats, ...(p.tags ?? [])];
  const firstCategory = cats[0] ?? '';

  return {
    id: String(p.id),
    slug: p.slug,
    name: p.title ?? p.slug,
    nameShort: (p.title ?? p.slug).split('—')[0].trim().substring(0, 40),
    maker: 'KAHA',
    makerRegion: 'TP.HCM',
    story: p.excerpt ?? '',
    description: p.excerpt ?? '',
    price: 0,
    priceOriginal: undefined,
    image,
    images: image ? [image] : [],
    category: firstCategory,
    space: [],
    rating: 4.8,
    reviewCount: 0,
    badge: undefined,
    badgeLabel: undefined,
    contactForPrice: true,
    origin: 'Việt Nam',
    tags: allTags,
    isNew: false,
    isBestseller: false,
    stock: 99,
  };
}

let _cached: Product[] | null = null;
let _cachedAt = 0;
const CACHE_TTL = 86400_000;

async function readProductsCache(): Promise<Product[] | null> {
  try {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const raw = readFileSync(join(process.cwd(), 'public/data/products-cache.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as Product[];
  } catch {
    return null;
  }
}

async function writeProductsCache(products: Product[]): Promise<void> {
  try {
    const { writeFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    writeFileSync(
      join(process.cwd(), 'public/data/products-cache.json'),
      JSON.stringify(products),
      'utf-8'
    );
  } catch {
    /* ignore */
  }
}

export async function getCatalogProducts(): Promise<Product[]> {
  const now = Date.now();
  if (_cached && now - _cachedAt < CACHE_TTL) return _cached;

  try {
    if (hasPostgresConfigured()) {
      const pool = getPostgresPool();
      const { rows } = await pool.query<ContentNodeRow>(
        `select id, slug, title, excerpt, featured_image_source_url, categories, tags, published_at
         from public.content_nodes
         where post_type = 'product' and status = 'publish'
         order by published_at desc nulls last`
      );

      if (rows.length > 0) {
        _cached = rows.map(mapToProduct);
        _cachedAt = now;
        await writeProductsCache(_cached);
        return _cached;
      }
    }

    const fallback = await readProductsCache();
    if (fallback && fallback.length > 0) {
      _cached = fallback;
      _cachedAt = now;
      return fallback;
    }
    return [];
  } catch (err) {
    console.error('[products-db] unexpected error:', err);
    const fallback = await readProductsCache();
    if (fallback && fallback.length > 0) {
      _cached = fallback;
      _cachedAt = now;
      return fallback;
    }
    return [];
  }
}

/** Slugs từ wishlist — server / API only */
export async function fetchProductsBySlugsFromCatalog(slugs: string[]): Promise<Product[]> {
  const uniq = [...new Set(slugs.filter(Boolean))];
  if (uniq.length === 0) return [];

  try {
    if (hasPostgresConfigured()) {
      const pool = getPostgresPool();
      const { rows } = await pool.query<ContentNodeRow>(
        `select id, slug, title, excerpt, featured_image_source_url, categories, tags, published_at
         from public.content_nodes
         where post_type = 'product' and slug = any($1::text[])`,
        [uniq]
      );
      return rows.map(mapToProduct);
    }

    return [];
  } catch {
    return [];
  }
}
