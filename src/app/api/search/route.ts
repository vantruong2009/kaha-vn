import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/products';
import { searchPosts } from '@/lib/getPosts';
import { rateLimitAsync } from '@/lib/rateLimit';

const CATEGORIES = [
  { label: 'Đèn Lồng Hội An',  sub: 'Thủ công truyền thống', href: '/c/hoi-an-lantern',  catSlug: 'hoi-an-lantern',  badge: 'Bestseller', iconType: 'hoian' },
  { label: 'Đèn Vải & Lụa',    sub: 'Cao cấp, tinh tế',      href: '/c/den-vai-cao-cap', catSlug: 'den-vai-cao-cap', badge: null,          iconType: 'vai' },
  { label: 'Đèn Tết & Lễ Hội', sub: 'Mùa lễ hội 2026',       href: '/c/den-long-tet',    catSlug: 'den-long-tet',    badge: 'Hot',         iconType: 'tet' },
  { label: 'Đèn Tre & Mây',    sub: 'Nguyên liệu bản địa',   href: '/c/den-may-tre',     catSlug: 'den-may-tre',     badge: null,          iconType: 'tre' },
  { label: 'Phong Cách Nhật',  sub: 'Zen & minimalist',       href: '/c/den-kieu-nhat',   catSlug: 'den-kieu-nhat',   badge: null,          iconType: 'nhat' },
  { label: 'Quà Tặng & B2B',   sub: 'Set quà doanh nghiệp',  href: '/san-pham',          catSlug: 'qua-tang',        badge: null,          iconType: 'qua' },
  { label: 'Đèn Gỗ',           sub: 'Gỗ tự nhiên cao cấp',   href: '/c/den-long-go',     catSlug: 'den-long-go',     badge: null,          iconType: 'go' },
  { label: 'Đèn Sàn',          sub: 'Trang trí nội thất',    href: '/c/den-san',         catSlug: 'den-san',         badge: null,          iconType: 'san' },
  { label: 'Đèn Thả Trần',     sub: 'Treo trần sang trọng',  href: '/c/den-tha-tran',    catSlug: 'den-tha-tran',    badge: null,          iconType: 'tha' },
  { label: 'Ngoài Trời',       sub: 'Chống nước, bền bỉ',    href: '/c/ngoai-troi',      catSlug: 'ngoai-troi',      badge: null,          iconType: 'ngoai' },
  { label: 'Phòng Khách',      sub: 'Không gian tiếp khách',  href: '/c/phong-khach',     catSlug: 'phong-khach',     badge: null,          iconType: 'phong' },
  { label: 'Quán Cafe',        sub: 'Đèn cho không gian cafe', href: '/c/den-quan-cafe',  catSlug: 'den-quan-cafe',   badge: null,          iconType: 'cafe' },
];

// Chuẩn hóa tiếng Việt: bỏ dấu, lowercase
function norm(s: string) {
  return (s ?? '').normalize('NFD').replace(/[\u0300-\u036f\u0111]/g, d => d === '\u0111' ? 'd' : '').toLowerCase();
}

function matches(text: string, q: string) {
  return norm(text).includes(q);
}

// Tính điểm liên quan: tên khớp chính xác > bắt đầu bằng > chứa
function score(text: string, q: string): number {
  const n = norm(text);
  if (n === q) return 3;
  if (n.startsWith(q)) return 2;
  if (n.includes(q)) return 1;
  return 0;
}

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
    if (!(await rateLimitAsync(`search:${ip}`, 30, 60_000))) {
      return NextResponse.json({ products: [], categories: [], posts: [] }, { status: 429 });
    }

    const raw = req.nextUrl.searchParams.get('q')?.trim() ?? '';
    const q = norm(raw);

    if (q.length < 2) {
      return NextResponse.json({ products: [], categories: [], posts: [] });
    }

    // ── Products ──────────────────────────────────────────────────────────────
    const matchedProducts = products
      .filter(p =>
        matches(p.name, q) ||
        matches(p.nameShort ?? '', q) ||
        matches(p.description ?? '', q) ||
        p.tags?.some(t => matches(t, q)) ||
        matches(p.category ?? '', q) ||
        matches(p.material ?? '', q)
      )
      .map(p => ({
        _score: score(p.name, q) * 2 + score(p.nameShort ?? '', q),
        id: p.id, slug: p.slug, name: p.name, nameShort: p.nameShort,
        image: p.image, category: p.category, price: p.price, priceOriginal: p.priceOriginal,
      }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 20)
      .map(({ _score: _, ...rest }) => rest);

    // ── Categories ────────────────────────────────────────────────────────────
    const matchedCategories = CATEGORIES.filter(c =>
      matches(c.label, q) || matches(c.catSlug, q) || matches(c.sub, q)
    );

    // ── Posts ─────────────────────────────────────────────────────────────────
    const rawPosts = await searchPosts(raw);
    const matchedPosts = rawPosts
      .map(p => ({
        _score: score(p.title, q),
        title: p.title, slug: p.slug, date: p.date, excerpt: p.excerpt, thumbnail: p.thumbnail,
      }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 20)
      .map(({ _score: _, ...rest }) => rest);

    return NextResponse.json(
      { products: matchedProducts, categories: matchedCategories, posts: matchedPosts },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    console.error('[api/search]', e);
    return NextResponse.json(
      { products: [], categories: [], posts: [] },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
