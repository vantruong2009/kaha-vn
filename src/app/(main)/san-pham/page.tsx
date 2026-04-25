import type { Metadata } from 'next';
import { getCatalogProducts } from '@/lib/products-db';
import { categories } from '@/lib/products';
import ProductsClient from './ProductsClient';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

export const revalidate = 86400;
import type { Product } from '@/data/products';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const filterKeys = ['cat', 'space', 'badge', 'region', 'price', 'sort', 'q'];
  const hasFilter = filterKeys.some(k => sp[k] && sp[k] !== '');

  return {
    title: '800+ Mẫu Đèn Lồng Thủ Công — Giá Sỉ Lẻ Toàn Quốc',
    description:
      'Khám phá 800+ mẫu đèn lồng thủ công: đèn Hội An, đèn tre mây, đèn vải lụa, đèn Nhật Bản, đèn Tết, đèn Trung Thu. Giá sỉ lẻ — giao toàn quốc. Hotline 0989.778.247.',
    alternates: { canonical: '/san-pham' },
    ...(hasFilter && { robots: { index: false, follow: true } }),
    openGraph: {
      title: '800+ Mẫu Đèn Lồng Thủ Công — Giá Sỉ Lẻ Toàn Quốc',
      description: '800+ mẫu đèn lồng thủ công Hội An, đèn tre mây, đèn vải lụa cao cấp. Bán sỉ lẻ toàn quốc.',
      type: 'website',
      siteName: 'KAHA',
      locale: 'vi_VN',
    },
  };
}

const PAGE_SIZE = 24;
const DEFAULT_PRICE_MAX = 2_000_000;

const collectionPageLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://kaha.vn/san-pham',
  name: 'Tất Cả Sản Phẩm Đèn Lồng | KAHA',
  description: 'Khám phá 800+ mẫu đèn lồng, đèn tre mây, đèn vải lụa thủ công truyền thống Việt Nam.',
  url: 'https://kaha.vn/san-pham',
  isPartOf: { '@type': 'WebSite', '@id': 'https://kaha.vn/#website' },
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const [sp, products] = await Promise.all([searchParams, getCatalogProducts()]);
  const cat      = typeof sp.cat    === 'string' ? sp.cat    : '';
  const space    = typeof sp.space  === 'string' ? sp.space  : '';
  const badge    = typeof sp.badge  === 'string' ? sp.badge  : '';
  const region   = typeof sp.region === 'string' ? sp.region : '';
  const priceMax = typeof sp.price  === 'string' ? Number(sp.price) : DEFAULT_PRICE_MAX;
  const sortBy   = typeof sp.sort   === 'string' ? sp.sort   : 'popular';
  const search   = typeof sp.q      === 'string' ? sp.q      : '';
  const page     = typeof sp.page   === 'string' ? Math.max(1, Number(sp.page)) : 1;

  // ── Filter server-side ────────────────────────────────────────
  let filtered: Product[] = products.filter(p => p.stock !== 0);
  if (cat)    filtered = filtered.filter(p => p.category === cat);
  if (space)  filtered = filtered.filter(p => p.space.includes(space));
  if (badge)  filtered = filtered.filter(p => p.badge === badge);
  if (region) filtered = filtered.filter(p => p.makerRegion === region);
  filtered = filtered.filter(p => p.contactForPrice || p.price <= priceMax);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || p.maker.toLowerCase().includes(q)
    );
  }
  switch (sortBy) {
    case 'price-asc':  filtered.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'rating':     filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    default:           filtered.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const safePage   = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Counts from ALL products (not filtered) for sidebar ──────
  const catCounts = Object.fromEntries(
    categories.map(c => [c.id, products.filter(p => p.category === c.id).length])
  );

  const spaceIds = [
    'phong-khach', 'ban-cong', 'cafe', 'nha-hang',
    'resort', 'tiec-cuoi', 'su-kien', 'ngoai-troi',
  ];
  const spaceCounts = Object.fromEntries(
    spaceIds.map(s => [s, products.filter(p => p.space.includes(s)).length])
  );

  const badgeIds = ['new', 'sale', 'tet', 'bestseller'];
  const badgeCounts = Object.fromEntries(
    badgeIds.map(b => [b, products.filter(p => p.badge === b).length])
  );

  const allRegions = [...new Set(products.map(p => p.makerRegion).filter(Boolean))].sort();
  const regionCounts = Object.fromEntries(
    allRegions.map(r => [r, products.filter(p => p.makerRegion === r).length])
  );

  const BASE = 'https://kaha.vn';
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sản Phẩm Đèn Lồng Thủ Công | KAHA',
    url: `${BASE}/san-pham`,
    numberOfItems: totalCount,
    itemListElement: paginated.slice(0, 10).map((p, idx) => ({
      '@type': 'ListItem',
      position: (safePage - 1) * PAGE_SIZE + idx + 1,
      url: `${BASE}/p/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd).replace(/<\/script>/gi, '<\\/script>') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/<\/script>/gi, '<\\/script>') }}
      />
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-4 py-10">

          <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm' }]} />

          <div className="mb-8">
            <div className="flex items-center gap-1.5 text-[#888] text-[10px] uppercase tracking-widest font-bold mb-2">
              <span>Bộ sưu tập</span>
            </div>
            <h1 className="font-semibold text-[#1a1a1a]" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.025em' }}>
              Tất Cả <span className="not-italic text-brand-green">Sản Phẩm</span>
            </h1>
          </div>

          {/* Category quick-links — visual image cards */}
          {(() => {
            const stripEmoji = (s: string) => s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
            const catImageMap: Record<string, string> = {
              'den-quan-cafe':        'cafe',
              'den-quan-tra-sua':     'cafe',
              'kaha-living':          'san',
              'long-den-gia-re':      'san',
              'den-nhat-ban':         'nhat',
              'den-long-nhat-ban':    'nhat',
              'nhat-ban':             'nhat',
              'den-vai-cao-cap':      'vai',
              'long-den-vai-lua':     'vai',
              'long-den-vai-hoa':     'vai',
              'den-ve':               've-tranh',
              'long-den-ve':          've-tranh',
              'den-ve-tranh':         've-tranh',
              'long-den-ve-thu-cong': 've-tranh',
              'den-khach-san':        'resort',
              'den-khach-san-2':      'resort',
              'den-treo-quan-bbq':    'nha-hang',
              'den-sushi-bbq':        'nha-hang',
              'den-nha-hang':         'nha-hang',
              'den-nha-hang-2':       'nha-hang',
              'gia-cong-den-trang-tri': 'tuong',
              'den-op-tuong':         'tuong',
              'den-gan-tuong':        'tuong',
              'den-trung-thu':        'tet',
              'den-long-tet':         'tet',
              'long-den-tet':         'tet',
              '%f0%9f%91%91-trung-thu': 'tet',
              'den-long-go':          'go',
              'hoi-an-lantern':       'hoian',
              'den-hoi-an':           'hoian',
              'den-noi-that':         'bedroom',
              'phong-ngu':            'bedroom',
              'phong-khach':          'bedroom',
              'den-tre':              'tre',
              'den-may-tre':          'tre',
              'den-may':              'tre',
              'den-tha-tran':         'tha-tran',
              'phong-an':             'dining',
              'phong-bep':            'dining',
              'ngoai-troi':           'ngoai-troi',
              'den-ngoai-troi':       'ngoai-troi',
            };
            const getImg = (id: string) => `/images/menu/${catImageMap[id] ?? 'san'}.webp`;

            const sorted = categories
              .map(c => ({ ...c, count: catCounts[c.id] ?? 0 }))
              .filter(c => c.count > 0)
              .sort((a, b) => b.count - a.count);
            const isActive = !cat;

            return (
              <div className="mb-10 -mx-4 md:-mx-0">
                <div
                  className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {/* "Tất cả" card */}
                  <Link href="/san-pham" className="shrink-0 flex flex-col items-center gap-2 group">
                    <div className={[
                      'w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 transition-all duration-200 flex items-center justify-center',
                      isActive
                        ? 'border-[#1a6b3c] shadow-[0_0_0_3px_rgba(16,78,46,0.15)]'
                        : 'border-[#e8e0d4] group-hover:border-[#1a6b3c]/50',
                    ].join(' ')}>
                      <div className={`w-full h-full flex items-center justify-center ${isActive ? 'bg-[#145530]' : 'bg-[#f0ece5] group-hover:bg-[#e8e0d4]'} transition-colors`}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isActive ? 'white' : '#888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-center w-[80px]">
                      <div className={`text-[11px] font-semibold leading-tight ${isActive ? 'text-[#1a6b3c]' : 'text-[#555] group-hover:text-[#1a6b3c]'} transition-colors`}>
                        Tất cả
                      </div>
                      <div className="text-[10px] text-[#999] mt-0.5">{products.length}</div>
                    </div>
                  </Link>

                  {sorted.map(c => {
                    const active = cat === c.id;
                    const label = stripEmoji(c.label);
                    return (
                      <Link key={c.id} href={`/san-pham?cat=${c.id}`} className="shrink-0 flex flex-col items-center gap-2 group">
                        <div className={[
                          'relative w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 transition-all duration-200',
                          active
                            ? 'border-[#1a6b3c] shadow-[0_0_0_3px_rgba(16,78,46,0.15)]'
                            : 'border-transparent group-hover:border-[#1a6b3c]/40',
                        ].join(' ')}>
                          <Image
                            src={getImg(c.id)}
                            alt={label}
                            fill
                            sizes="72px"
                            className={`object-cover transition-all duration-300 ${active ? 'brightness-90' : 'group-hover:scale-105'}`}
                          />
                          {active && (
                            <div className="absolute inset-0 bg-[#1a6b3c]/10 pointer-events-none" />
                          )}
                        </div>
                        <div className="text-center w-[80px]">
                          <div className={`text-[11px] font-semibold leading-tight line-clamp-2 ${active ? 'text-[#1a6b3c]' : 'text-[#555] group-hover:text-[#1a6b3c]'} transition-colors`}>
                            {label}
                          </div>
                          <div className="text-[10px] text-[#999] mt-0.5">{c.count}</div>
                        </div>
                      </Link>
                    );
                  })}
                  {/* Trailing padding */}
                  <span className="shrink-0 w-4" />
                </div>
              </div>
            );
          })()}

          {/* Client component — only receives current page slice */}
          <ProductsClient
            products={paginated}
            totalCount={totalCount}
            totalPages={totalPages}
            currentPage={safePage}
            currentFilters={{ cat, space, badge, region, priceMax, sortBy, search }}
            catCounts={catCounts}
            spaceCounts={spaceCounts}
            badgeCounts={badgeCounts}
            regionCounts={regionCounts}
          />
        </div>
      </div>
    </>
  );
}
