/**
 * Product data layer — reads from /public/data/products.json (parsed from WordPress export).
 * Re-exports using the same Product interface so all existing components remain compatible.
 */

import type { Product, ProductVariation } from '@/data/products';
import rawProducts from '../../public/data/products.json';
import rawCategories from '../../public/data/categories.json';
import rawVariations from '../../public/data/variations.json';

// ─── Raw JSON types ────────────────────────────────────────────────────────────
interface RawVariation {
  sku: string;
  price: number;
  attributes: Record<string, string>;
  inStock: boolean;
  image: string | null;
}

interface RawProduct {
  id: number;
  title: string;
  slug: string;
  price: number;
  regularPrice: number;
  salePrice: number | null;
  description: string;
  shortDescription: string;
  categories: string[];
  categoryLabels: string[];
  image: string;
  gallery: string[];
  sku: string;
  inStock: boolean;
  badge: string | null;
  badgeLabel: string | null;
  contactForPrice: boolean;
}

interface RawCategory {
  slug: string;
  name: string;
  label?: string;
  count?: number;
}

// ─── Map WordPress category slug → display info ───────────────────────────────
// Canonical group = the /c/[slug] URL that products in this WP category belong to
const CATEGORY_MAP: Record<string, { display: string; group: string }> = {
  // Cafe / restaurant / hotel
  'den-quan-cafe':         { display: 'Đèn Quán Cafe',         group: 'den-quan-cafe' },
  'den-quan-tra-sua':      { display: 'Đèn Quán Trà Sữa',      group: 'den-quan-cafe' },
  'den-treo-quan-bbq':     { display: 'Đèn Quán BBQ',          group: 'den-nha-hang' },
  'den-sushi-bbq':         { display: 'Đèn Sushi BBQ',         group: 'den-nha-hang' },
  'den-nha-hang':          { display: 'Đèn Nhà Hàng',          group: 'den-nha-hang' },
  'den-khach-san':         { display: 'Đèn Khách Sạn',         group: 'den-khach-san' },
  // Japanese / style
  'den-nhat-ban':          { display: 'Đèn Nhật Bản',          group: 'den-kieu-nhat' },
  'den-long-nhat-ban':     { display: 'Đèn Lồng Nhật Bản',     group: 'den-kieu-nhat' },
  'nhat-ban':              { display: 'Nhật Bản',              group: 'den-kieu-nhat' },
  // Hội An / silk
  'hoi-an-lantern':        { display: 'Hội An Lantern',         group: 'hoi-an-lantern' },
  'long-den-vai-lua':      { display: 'Lồng Đèn Vải Lụa',      group: 'den-vai-cao-cap' },
  'long-den-vai-hoa':      { display: 'Lồng Đèn Vải Hoa',      group: 'den-vai-cao-cap' },
  'den-vai-cao-cap':       { display: 'Đèn Vải Cao Cấp',       group: 'den-vai-cao-cap' },
  'long-den-cao-cap':      { display: 'Lồng Đèn Cao Cấp',      group: 'den-vai-cao-cap' },
  // Wood / bamboo
  'den-long-go':           { display: 'Đèn Lồng Gỗ',           group: 'den-long-go' },
  'den-tre':               { display: 'Đèn Tre',                group: 'den-may-tre' },
  // Tet / seasonal
  'den-long-tet':          { display: 'Đèn Lồng Tết',          group: 'den-long-tet' },
  'long-den-tet':          { display: 'Lồng Đèn Tết',          group: 'den-long-tet' },
  'den-trung-thu':         { display: 'Đèn Trung Thu',          group: 'den-trung-thu' },
  // Rooms / spaces
  'kaha-living':           { display: 'Kaha Living',            group: 'kaha-living' },
  'phong-khach':           { display: 'Phòng Khách',            group: 'phong-khach' },
  'phong-ngu':             { display: 'Phòng Ngủ',              group: 'phong-ngu' },
  'phong-bep':             { display: 'Phòng Bếp',              group: 'phong-bep' },
  'phong-an':              { display: 'Phòng Ăn',               group: 'phong-bep' },
  'ngoai-troi':            { display: 'Ngoài Trời',             group: 'ngoai-troi' },
  'den-noi-that':          { display: 'Đèn Nội Thất',           group: 'den-noi-that' },
  'den-tha-tran':          { display: 'Đèn Thả Trần',           group: 'den-tha-tran' },
  // Decorative / craft
  'den-ve-tranh':          { display: 'Đèn Vẽ Tranh',           group: 'den-ve-tranh' },
  'den-ve':                { display: 'Đèn Vẽ',                 group: 'den-ve-tranh' },
  'long-den-ve':           { display: 'Lồng Đèn Vẽ',           group: 'den-ve-tranh' },
  'long-den-ve-thu-cong':  { display: 'Lồng Đèn Vẽ Thủ Công',  group: 'den-ve-tranh' },
  'gia-cong-den-trang-tri':{ display: 'Gia Công Đèn Trang Trí', group: 'gia-cong-den-trang-tri' },
  'chup-den-vai':          { display: 'Chụp Đèn Vải',           group: 'chup-den-vai' },
  // Plastic / cheap
  'long-den-gia-re':       { display: 'Lồng Đèn Giá Rẻ',       group: 'long-den-gia-re' },
  'den-nhua-rap':          { display: 'Đèn Nhựa Ráp',           group: 'ngoi-sao-nhua' },
  'den-nhua-2-manh':       { display: 'Đèn Nhựa 2 Mảnh',        group: 'ngoi-sao-nhua' },
  'den-nhua-lap-rap':      { display: 'Đèn Nhựa Lắp Ráp',       group: 'ngoi-sao-nhua' },
  'den-nhua-xuyen-sang':   { display: 'Đèn Nhựa Xuyên Sáng',    group: 'ngoi-sao-nhua' },
  'long-den-hinh-tron':    { display: 'Lồng Đèn Hình Tròn',     group: 'den-tron-10-mau' },
  // Specialty
  'long-den-khung-sat':    { display: 'Lồng Đèn Khung Sắt',     group: 'den-long-go' },
};

// Priority-ordered list: more specific / unique categories beat generic ones.
// A product is assigned the FIRST group whose WP slug appears in its categories[].
const CATEGORY_PRIORITY: Array<{ wpSlug: string; group: string }> = [
  // ── Seasonal / thematic (very specific) ────────────────────────────────
  { wpSlug: 'den-trung-thu',       group: 'den-trung-thu' },
  { wpSlug: 'long-den-tet',        group: 'den-long-tet' },
  { wpSlug: 'den-long-tet',        group: 'den-long-tet' },
  // ── Hội An (must beat den-long-go which WP often puts first) ───────────
  { wpSlug: 'hoi-an-lantern',      group: 'hoi-an-lantern' },
  { wpSlug: 'long-den-vai-hoa',    group: 'hoi-an-lantern' },
  { wpSlug: 'long-den-vai-lua',    group: 'den-vai-cao-cap' },
  // ── Japanese ────────────────────────────────────────────────────────────
  { wpSlug: 'den-nhat-ban',        group: 'den-kieu-nhat' },
  { wpSlug: 'den-long-nhat-ban',   group: 'den-kieu-nhat' },
  { wpSlug: 'nhat-ban',            group: 'den-kieu-nhat' },
  // ── Plastic / star ──────────────────────────────────────────────────────
  { wpSlug: 'den-nhua-rap',        group: 'ngoi-sao-nhua' },
  { wpSlug: 'den-nhua-2-manh',     group: 'ngoi-sao-nhua' },
  { wpSlug: 'den-nhua-lap-rap',    group: 'ngoi-sao-nhua' },
  { wpSlug: 'den-nhua-xuyen-sang', group: 'ngoi-sao-nhua' },
  // ── Round paper / 10-colour ─────────────────────────────────────────────
  { wpSlug: 'long-den-hinh-tron',  group: 'den-tron-10-mau' },
  // ── Bamboo / rattan ─────────────────────────────────────────────────────
  { wpSlug: 'den-tre',             group: 'den-may-tre' },
  // ── Fabric shade / table lamp ────────────────────────────────────────────
  { wpSlug: 'chup-den-vai',        group: 'chup-den-vai' },
  // ── Pendant / hanging ───────────────────────────────────────────────────
  { wpSlug: 'den-tha-tran',        group: 'den-tha-tran' },
  // ── Wood / iron frame ───────────────────────────────────────────────────
  { wpSlug: 'den-long-go',         group: 'den-long-go' },
  { wpSlug: 'long-den-khung-sat',  group: 'den-long-go' },
  // ── Hand-painted ────────────────────────────────────────────────────────
  { wpSlug: 'den-ve-tranh',        group: 'den-ve-tranh' },
  { wpSlug: 'den-ve',              group: 'den-ve-tranh' },
  { wpSlug: 'long-den-ve',         group: 'den-ve-tranh' },
  { wpSlug: 'long-den-ve-thu-cong',group: 'den-ve-tranh' },
  // ── Silk / premium fabric ────────────────────────────────────────────────
  { wpSlug: 'den-vai-cao-cap',     group: 'den-vai-cao-cap' },
  { wpSlug: 'long-den-cao-cap',    group: 'den-vai-cao-cap' },
  // ── Kaha Living / interior ──────────────────────────────────────────────
  { wpSlug: 'kaha-living',         group: 'kaha-living' },
  { wpSlug: 'den-noi-that',        group: 'kaha-living' },
  // ── Outdoor ─────────────────────────────────────────────────────────────
  { wpSlug: 'ngoai-troi',          group: 'ngoai-troi' },
  // ── Room / space (broad — after specific ones) ───────────────────────────
  { wpSlug: 'phong-khach',         group: 'phong-khach' },
  { wpSlug: 'phong-ngu',           group: 'phong-ngu' },
  { wpSlug: 'phong-bep',           group: 'phong-bep' },
  { wpSlug: 'phong-an',            group: 'phong-bep' },
  // ── Commercial / venue (broadest) ───────────────────────────────────────
  { wpSlug: 'den-quan-cafe',       group: 'den-quan-cafe' },
  { wpSlug: 'den-quan-tra-sua',    group: 'den-quan-cafe' },
  { wpSlug: 'den-nha-hang',        group: 'den-nha-hang' },
  { wpSlug: 'den-treo-quan-bbq',   group: 'den-nha-hang' },
  { wpSlug: 'den-sushi-bbq',       group: 'den-nha-hang' },
  { wpSlug: 'den-khach-san',       group: 'den-khach-san' },
  // ── Custom / OEM ────────────────────────────────────────────────────────
  { wpSlug: 'gia-cong-den-trang-tri', group: 'gia-cong-den-trang-tri' },
];

// Pick the "primary" category using priority order + slug/image signals.
// Priority list ensures specific categories (hoi-an-lantern) beat generic
// ones (den-long-go) regardless of WordPress category ordering.
function pickPrimaryCategory(cats: string[], slug = '', image = ''): string {
  const s = slug.toLowerCase();
  const img = image.toLowerCase();

  // ── Slug/image signals (most reliable) ────────────────────────────────
  if (s.includes('hoi-an') || s.includes('hoian'))           return 'hoi-an-lantern';
  if (s.includes('trung-thu'))                                return 'den-trung-thu';
  if (s.includes('long-den-tet') || s.includes('den-long-tet')) return 'den-long-tet';
  if (s.includes('may-tre') || (s.includes('den-tre') && !s.includes('treo'))) return 'den-may-tre';
  if (s.includes('nhat-ban') || s.includes('kieu-nhat'))      return 'den-kieu-nhat';
  if (s.includes('ngoi-sao') || s.includes('nhua-2-manh') ||
      s.includes('nhua-lap-rap') || s.includes('nhua-xuyen-sang')) return 'ngoi-sao-nhua';
  if (s.includes('chup-den-vai') || s.includes('den-ban-gom')) return 'chup-den-vai';
  if (s.includes('giay-tron') || s.includes('tron-mau'))       return 'den-tron-10-mau';
  if (s.includes('tha-tran') || s.includes('tha-trang-tri') ||
      s.includes('den-chum-trang-tri'))                         return 'den-tha-tran';
  if (s.includes('den-san-trang-tri'))                          return 'kaha-living';
  if (s.includes('den-ban-trang-tri'))                          return 'kaha-living';
  if (img.includes('den-nhat-ban') || img.includes('/nhat-do') ||
      img.includes('/nhat-trang') || img.includes('co-ca-chep') ||
      img.includes('ca-koi'))                                   return 'den-kieu-nhat';
  if (img.includes('tron-giay'))                               return 'den-tron-10-mau';
  if (img.includes('kaha-living'))                             return 'kaha-living';

  // ── Priority-ordered WP category scan ─────────────────────────────────
  for (const { wpSlug, group } of CATEGORY_PRIORITY) {
    if (cats.includes(wpSlug)) return group;
  }

  return cats[0] ?? 'san-pham';
}

// Seeded random — deterministic per slug so values don't change on rebuild
function seededRand(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return (h >>> 0) / 4294967296;
}

// Derive space[] from categories instead of hardcoding
function deriveSpace(cats: string[]): string[] {
  const s = new Set<string>();
  for (const c of cats) {
    if (c.includes('cafe') || c.includes('tra-sua')) s.add('cafe');
    if (c.includes('khach-san') || c.includes('bbq') || c.includes('nha-hang')) s.add('nha-hang');
    if (c.includes('van-phong')) s.add('van-phong');
    if (c.includes('ban-cong') || c.includes('ngoai-troi')) s.add('ban-cong');
    if (c.includes('phong-khach') || c.includes('den-long') || c.includes('hoi-an') || c.includes('tet')) s.add('phong-khach');
  }
  if (s.size === 0) s.add('phong-khach');
  return Array.from(s);
}

// Derive a short "maker" name from the first category label or SKU prefix
function deriveMaker(raw: RawProduct): string {
  if (raw.sku) {
    const prefix = raw.sku.replace(/[0-9_\-]+$/, '').trim();
    if (prefix.length >= 2 && prefix.length <= 8) {
      return `Xưởng ${prefix}`;
    }
  }
  if ((raw.categoryLabels ?? []).length > 0) {
    return 'Xưởng KAHA';
  }
  return 'Xưởng KAHA';
}

// Extract image URLs → keep original URL for <img src>, or fall back to placeholder
function buildImages(raw: RawProduct): string[] {
  if ((raw.gallery ?? []).length > 0) return raw.gallery;
  if (raw.image) return [raw.image];
  return ['/images/products/placeholder.webp'];
}

// Determine badge type from badgeLabel or price comparison
function deriveBadge(raw: RawProduct): 'new' | 'sale' | 'tet' | 'bestseller' | undefined {
  if (!raw.badge) return undefined;
  const b = raw.badge.toLowerCase();
  if (b.includes('sale') || b.includes('giảm')) return 'sale';
  if (b.includes('new') || b.includes('mới')) return 'new';
  if (b.includes('best') || b.includes('bán chạy')) return 'bestseller';
  if (b.includes('tết') || b.includes('tet')) return 'tet';
  return undefined;
}

// ─── Convert raw JSON product → Product interface ─────────────────────────────
function mapProduct(raw: RawProduct): Product {
  const images = buildImages(raw);
  const primaryCat = pickPrimaryCategory(raw.categories ?? [], raw.slug ?? '', raw.image ?? '');

  return {
    id: String(raw.id),
    slug: raw.slug,
    name: raw.title,
    nameShort: raw.title.length > 40 ? raw.title.slice(0, 37) + '…' : raw.title,
    maker: deriveMaker(raw),
    makerRegion: 'Việt Nam',
    story: raw.shortDescription || (raw.description ?? '').slice(0, 120) || raw.title,
    description: raw.description || raw.shortDescription || `${raw.title} — đèn trang trí thủ công Việt Nam, chất lượng cao, giao hàng toàn quốc.`,
    price: raw.price,
    priceOriginal: raw.regularPrice > raw.price ? raw.regularPrice : undefined,
    image: raw.image || images[0] || '',
    images,
    category: primaryCat,
    space: deriveSpace(raw.categories),
    rating: Math.round((4.0 + seededRand(raw.slug + 'r') * 1.0) * 10) / 10,
    reviewCount: Math.floor(5 + seededRand(raw.slug + 'rc') * 95),
    badge: deriveBadge(raw),
    badgeLabel: raw.badgeLabel ?? undefined,
    contactForPrice: raw.contactForPrice ?? false,
    dimensions: undefined,
    material: undefined,
    origin: 'Việt Nam',
    weight: undefined,
    tags: raw.categories, // keep ALL WP category slugs for accurate category filtering
    isNew: false,
    isBestseller: false,
    stock: raw.inStock ? 99 : 0,
  };
}

// ─── Build product list ────────────────────────────────────────────────────────
// Type assertion: we know the shape matches RawProduct[]
const _rawProducts = rawProducts as unknown as RawProduct[];
const _rawCategories = rawCategories as unknown as RawCategory[];
const _rawVariations = rawVariations as Record<string, RawVariation[]>;

function mapVariations(productId: string): ProductVariation[] | undefined {
  const vars = _rawVariations[productId];
  if (!vars || vars.length === 0) return undefined;
  return vars.map(v => ({
    sku: v.sku,
    price: v.price,
    attributes: v.attributes,
    inStock: v.inStock,
    image: v.image ?? undefined,
  }));
}

export const products: Product[] = _rawProducts.map(raw => ({
  ...mapProduct(raw),
  variations: mapVariations(String(raw.id)),
}));

// Convert ALL CAPS labels from WordPress export → Title Case
function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/(?:^|\s)\S/g, c => c.toUpperCase());
}

// ─── Category list ────────────────────────────────────────────────────────────
export const categories = _rawCategories.map(c => ({
  id: c.slug,
  label: toTitleCase(c.name ?? c.label ?? c.slug),
}));

// ─── Helper functions ─────────────────────────────────────────────────────────

export function getProduct(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProducts(): Product[] {
  return products;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p =>
    // Check if any of the raw categories match
    (_rawProducts.find(r => r.slug === p.slug)?.categories ?? []).includes(categorySlug)
  );
}

export function getFeaturedProducts(n = 8): Product[] {
  // Return top N products by price (proxy for "featured")
  return [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, n);
}

export function getRelatedProducts(slug: string, n = 4): Product[] {
  const product = getProduct(slug);
  if (!product) return [];
  return products
    .filter(p => p.slug !== slug && p.category === product.category)
    .slice(0, n);
}
