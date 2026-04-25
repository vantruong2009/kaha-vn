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

export interface HomepageImageSet {
  hero: string[];        // 3 ảnh mosaic hero
  showcase: string[];    // 4 ảnh category showcase
  spaces: string[];      // 4 ảnh không gian ứng dụng
  b2b: string;           // 1 ảnh xưởng
}

/** Lấy tập ảnh cho homepage từ catalog products (ưu tiên den-vai, den-chum, den-may-tre, long-den) */
export async function getHomepageImages(): Promise<HomepageImageSet> {
  const FALLBACK: HomepageImageSet = { hero: [], showcase: [], spaces: [], b2b: '' };
  try {
    const products = await getCatalogProducts();
    const withImg = products.filter((p) => p.image);
    if (withImg.length === 0) return FALLBACK;

    const pick = (cat: string, n = 1) => {
      const matches = withImg.filter((p) => p.tags.includes(cat));
      const pool = matches.length >= n ? matches : withImg;
      return pool.slice(0, n).map((p) => p.image);
    };

    const hero = [
      ...pick('den-vai-treo-tran', 1),
      ...pick('den-chum', 1),
      ...pick('den-may-tre', 1),
    ].filter(Boolean).slice(0, 3);
    if (hero.length < 3) {
      const extra = withImg.filter((p) => !hero.includes(p.image)).slice(0, 3 - hero.length).map((p) => p.image);
      hero.push(...extra);
    }

    const showcase = [
      pick('gia-cong-den-trang-tri', 1)[0] || '',
      pick('long-den', 1)[0] || pick('den-may-tre', 1)[0] || '',
      pick('den-chum', 1)[0] || pick('den-sat-son-tinh-dien', 1)[0] || '',
      pick('den-khach-san', 1)[0] || withImg[3]?.image || '',
    ];

    const spaces = [
      pick('den-khach-san', 1)[0] || withImg[4]?.image || '',
      pick('den-nha-hang', 1)[0] || withImg[5]?.image || '',
      pick('den-quan-cafe', 1)[0] || withImg[6]?.image || '',
      pick('den-gan-tuong', 1)[0] || withImg[7]?.image || '',
    ];

    const b2b = pick('gia-cong-den-trang-tri', 1)[0] || withImg[8]?.image || '';

    return { hero, showcase, spaces, b2b };
  } catch {
    return FALLBACK;
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
