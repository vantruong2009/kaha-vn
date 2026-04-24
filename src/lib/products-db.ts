/**
 * Fetch products từ Postgres (VPS) — server / API.
 */
import type { Product } from '@/data/products';
import { getPostgresPool, hasPostgresConfigured } from '@/lib/postgres/server';

interface ProductRow {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  regular_price: number | null;
  sale_price: number | null;
  contact_for_price: boolean;
  in_stock: boolean;
  stock_quantity: number | null;
  image: string;
  gallery: string[] | null;
  badge: string | null;
  badge_label: string | null;
  categories: string[];
  published: boolean;
}

function mapToProduct(p: ProductRow): Product {
  const price = p.sale_price ?? p.regular_price ?? 0;
  const priceOriginal = p.sale_price && p.regular_price ? p.regular_price : undefined;

  let badge: Product['badge'] = undefined;
  const badgeLower = (p.badge || '').toLowerCase();
  if (badgeLower.includes('sale') || badgeLower.includes('giảm')) badge = 'sale';
  else if (badgeLower.includes('new') || badgeLower.includes('mới')) badge = 'new';
  else if (badgeLower.includes('best') || badgeLower.includes('bán chạy')) badge = 'bestseller';
  else if (badgeLower.includes('tết') || badgeLower.includes('tet')) badge = 'tet';

  const firstCategory = p.categories?.[0] ?? '';

  return {
    id: p.id,
    slug: p.slug,
    name: p.title,
    nameShort: p.title.split('—')[0].trim().replace(/\s+(Khung|Vải|Tre|Gỗ|Size|Bộ).*$/i, '').trim().substring(0, 40),
    maker: 'LongDenViet',
    makerRegion: 'Hội An',
    story: p.short_description ?? '',
    description: p.short_description ?? '',
    price,
    priceOriginal,
    image: p.image,
    images: p.gallery ?? [p.image],
    category: firstCategory,
    space: [],
    rating: 4.8,
    reviewCount: 12,
    badge,
    badgeLabel: p.badge_label ?? undefined,
    contactForPrice: p.contact_for_price || (!p.in_stock && (p.stock_quantity === 0 || p.stock_quantity === null)),
    origin: 'Việt Nam',
    tags: p.categories ?? [],
    isNew: badge === 'new',
    isBestseller: badge === 'bestseller',
    stock: p.in_stock ? (p.stock_quantity || 99) : (p.stock_quantity === 0 ? 99 : 0),
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
      const { rows } = await pool.query<ProductRow>(
        `select id, slug, title, short_description, regular_price, sale_price, contact_for_price,
                in_stock, stock_quantity, image, gallery, badge, badge_label, categories, published
         from public.products
         where published = true
         order by created_at desc`
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
      const { rows } = await pool.query<ProductRow>(
        `select id, slug, title, short_description, regular_price, sale_price, contact_for_price,
                in_stock, stock_quantity, image, gallery, badge, badge_label, categories, published
         from public.products
         where slug = any($1::text[])`,
        [uniq]
      );
      return rows.map(mapToProduct);
    }

    return [];
  } catch {
    return [];
  }
}
