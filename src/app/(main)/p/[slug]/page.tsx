import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { products, categories } from '@/lib/products';
import { formatPrice } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';
import ProductDetailClient from '@/components/ProductDetailClient';
import BoughtTogetherClient from './BoughtTogetherClient';
import FaqAccordion from './FaqAccordion';
import { getPostgresPool, hasPostgresConfigured } from '@/lib/postgres/server';
import { getSettings } from '@/lib/site-settings-server';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 86400;

// Strip HTML & shortcodes from content
function stripHtml(html: string): string {
  return (html || '')
    .replace(/\[[^\]]*\]?/g, '') // Remove WP shortcodes [vc_row...], [/vc_column], etc.
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[a-z]+;/g, '') // Remove HTML entities
    .replace(/\s{2,}/g, ' ') // Collapse whitespace
    .trim();
}

// Map hàng DB (Postgres) → kiểu Product dùng cho UI hiện tại
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProductRow(p: any) {
  // Use long_description if available, fallback to short_description, then empty
  const description = p.description ? stripHtml(p.description) : (p.short_description ?? '');

  return {
    id:             p.slug,
    slug:           p.slug,
    name:           p.title,
    nameShort:      p.title?.length > 40 ? p.title.slice(0, 38) + '…' : p.title,
    price:          p.sale_price || p.regular_price || 0,
    originalPrice:  p.regular_price || 0,
    image:          p.image || '',
    images:         [p.image, ...(p.gallery || [])].filter(Boolean),
    category:       p.categories?.[0] ?? 'den-long',
    space:          [],
    stock:          p.in_stock ? 10 : 0,
    contactForPrice: p.contact_for_price ?? false,
    description:    description,
    story:          p.short_description ?? '',
    maker:          'KAHA',
    makerRegion:    'TP.HCM',
    material:       undefined,
    badge:          p.badge ?? null,
    badgeLabel:     p.badge_label ?? null,
    region:         'TP.HCM',
    tags:           [],
    isNew:          false,
    isBestseller:   p.badge === 'Bán Chạy',
    rating:         p.rating ?? undefined,
    reviewCount:    p.review_count ?? undefined,
    meta_title:     p.meta_title ?? null,
    meta_desc:      p.meta_desc ?? null,
    focus_keyword:  p.focus_keyword ?? null,
  };
}

const getProduct = unstable_cache(
  async (slug: string) => {
    const s = slug.toLowerCase();
    if (hasPostgresConfigured()) {
      try {
        const pool = getPostgresPool();
        const { rows } = await pool.query(
          `select id, slug, title, excerpt as short_description, body_html as description,
                  featured_image_source_url as image, categories, tags, published_at
           from public.content_nodes
           where post_type = 'product' and lower(slug) = $1 and status = 'publish' limit 1`,
          [s]
        );
        if (rows[0]) return mapProductRow(rows[0]);
      } catch {
        /* file cache / local */
      }
    }
    return products.find(p => p.slug === s) ?? null;
  },
  ['product-detail-pg'],
  { revalidate: 3600 }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getRelated(product: any) {
  if (hasPostgresConfigured() && product?.category) {
    try {
      const pool = getPostgresPool();
      const { rows } = await pool.query(
        `select id, slug, title, excerpt as short_description, body_html as description,
                featured_image_source_url as image, categories, tags, published_at
         from public.content_nodes
         where post_type = 'product' and status = 'publish'
         and lower(slug) <> lower($1) and categories && $2::text[] limit 4`,
        [product.slug, [product.category]]
      );
      if (rows.length) return rows.map(mapProductRow);
    } catch {
      /* local */
    }
  }
  return products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
}

export async function generateStaticParams() {
  // Không pre-build 817+ sản phẩm — tránh tải DB nặng khi build
  // dynamicParams=true đảm bảo trang vẫn render on-demand (ISR) khi có request
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug.toLowerCase());
  if (!product) return { title: 'Sản phẩm không tồn tại' };

  const region = product.makerRegion ?? 'Hội An, Quảng Nam';
  const priceStr = product.contactForPrice || !product.price
    ? 'Liên hệ báo giá'
    : `Giá ${product.price.toLocaleString('vi-VN')}đ`;
  // Xoá shortcode WPBakery/WooCommerce còn sót lại từ data cũ (vd: [vc_row css="..."], [/vc_column])
  const stripShortcodes = (s: string) => s.replace(/\[[^\]]*\]?/g, '').replace(/\s{2,}/g, ' ').trim();
  const rawDesc = product.description?.slice(0, 200) || product.story?.slice(0, 200) || `Đèn lồng thủ công ${region}`;
  const descBase = stripShortcodes(rawDesc).slice(0, 120);
  const autoDesc = `${descBase}. ${priceStr}. Giao toàn quốc, đổi trả 7 ngày | KAHA`;
  const metaTitle = (product as Record<string, unknown>).meta_title as string | null;
  const rawMetaDesc = (product as Record<string, unknown>).meta_desc as string | null;
  const metaDesc = rawMetaDesc ? stripShortcodes(rawMetaDesc) : null;

  return {
    title: { absolute: metaTitle || `${product.name} | ${priceStr} | KAHA` },
    description: metaDesc || autoDesc,
    keywords: `${product.name}, đèn lồng ${region}, đèn lồng thủ công, đèn lồng Việt Nam, đèn lồng Hội An, ${product.category}`,
    alternates: { canonical: `/p/${slug}` },
    robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' as const, 'max-video-preview': -1 },
    openGraph: {
      title: `${product.name} — Đèn Lồng Thủ Công ${region}`,
      description: metaDesc || autoDesc,
      images: product.image
        ? [{
            url: product.image.startsWith('http') ? product.image : `https://kaha.vn${product.image}`,
            width: 800,
            height: 800,
            alt: `${product.name} — Đèn lồng thủ công ${region} | KAHA`,
          }]
        : [],
      type: 'website' as const,
      locale: 'vi_VN',
      siteName: 'KAHA',
    },
  };
}

// Async component riêng cho related — stream sau khi main content đã render
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function RelatedSection({ product }: { product: any }) {
  const related = await getRelated(product);
  if (!related.length) return null;
  const catLabel = categories.find(c => c.id === product.category)?.label ?? '';
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]" style={{ letterSpacing: '-0.025em' }}>
          Sản Phẩm <span className="text-brand-green">Liên Quan</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {related.map((p: typeof product) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {product.category && (
        <div className="mt-5 flex justify-end">
          <Link
            href={`/c/${product.category}`}
            className="inline-flex items-center gap-2 text-[13px] font-bold transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #1a6b3c, #104e2e)', color: '#fff', padding: '9px 18px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(16,78,46,.25)' }}
          >
            Xem tất cả {catLabel || 'sản phẩm cùng loại'}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      )}
    </div>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const [product, siteSettings] = await Promise.all([getProduct(slug.toLowerCase()), getSettings()]);
  if (!product) notFound();

  const minPrice = product.price * 0.5;
  const maxPrice = product.price * 1.5;
  const boughtTogether = products
    .filter(p =>
      p.id !== product.id &&
      p.category !== product.category &&
      p.price >= minPrice &&
      p.price <= maxPrice &&
      p.stock > 0 &&
      !p.contactForPrice
    )
    .slice(0, 2);

  const bundleItems = [
    { id: product.id, slug: product.slug, name: product.nameShort, price: product.price, image: product.image, maker: product.maker },
    ...boughtTogether.map(p => ({ id: p.id, slug: p.slug, name: p.nameShort, price: p.price, image: p.image, maker: p.maker })),
  ];
  const bundleTotalPrice = bundleItems.reduce((sum, p) => sum + p.price, 0);

  const categoryLabel = categories.find(c => c.id === product.category)?.label ?? 'Sản phẩm';
  const BASE = 'https://kaha.vn';
  const productUrl = `${BASE}/p/${product.slug}`;
  const priceValidUntil = '2099-12-31';

  const stripHtml = (s: string) => s.replace(/<[^>]{0,500}>/g, '').replace(/\[[^\]]*\]?/g, '').replace(/\s{2,}/g, ' ').trim();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: product.name,
    description: stripHtml(product.description || product.story || '').slice(0, 500),
    url: productUrl,
    sku: product.id,
    ...(product.images?.[0] ? {
      image: product.images.map((img: string) => {
        const url = img.startsWith('http') ? img : `${BASE}${img}`;
        return {
          '@type': 'ImageObject',
          url,
          contentUrl: url,
          creator: { '@type': 'Organization', name: 'KAHA', url: BASE },
          copyrightHolder: { '@type': 'Organization', name: 'KAHA', url: BASE },
          copyrightYear: new Date().getFullYear(),
          copyrightNotice: `© ${new Date().getFullYear()} KAHA — kaha.vn. All rights reserved.`,
          license: `${BASE}/dieu-khoan`,
          acquireLicensePage: `${BASE}/lien-he`,
          creditText: 'KAHA — kaha.vn',
        };
      }),
    } : {}),
    ...(product.contactForPrice || !product.price ? {} : {
      offers: {
        '@type': 'Offer',
        url: productUrl,
        price: product.price,
        priceCurrency: 'VND',
        priceValidUntil,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'KAHA', url: BASE },
      },
    }),
    brand: { '@type': 'Brand', name: 'KAHA' },
    manufacturer: { '@type': 'Organization', name: product.maker },
    ...(product.rating && product.reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: BASE },
      { '@type': 'ListItem', position: 2, name: categoryLabel, item: `${BASE}/c/${product.category}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: productUrl },
    ],
  };

  const faqItems = [
    {
      q: `${product.name} được làm từ vật liệu gì?`,
      a: `${product.name} được làm từ ${product.material ?? 'vật liệu tự nhiên truyền thống'}, sản xuất hoàn toàn thủ công tại ${product.makerRegion ?? 'Hội An, Quảng Nam'}, Việt Nam. Không dùng chất liệu công nghiệp hay hàng nhập khẩu.`,
    },
    {
      q: 'Đèn có thể sử dụng ngoài trời không?',
      a: 'Đèn lồng thủ công phù hợp nhất với không gian trong nhà hoặc ngoài trời có mái che. Nếu treo ngoài trời, nên tránh tiếp xúc trực tiếp với mưa và ánh nắng mạnh kéo dài để giữ màu sắc và chất liệu bền đẹp theo thời gian.',
    },
    {
      q: 'Vận chuyển đi tỉnh xa có an toàn không?',
      a: 'Chúng tôi đóng gói kỹ bằng hộp carton cứng + lớp xốp chống sốc bên trong. Đơn hàng được giao toàn quốc qua GHTK/GHN, thời gian 2–5 ngày tùy khu vực. Nếu hàng đến bị hỏng do vận chuyển, chúng tôi hoàn đổi 100%.',
    },
    {
      q: 'Có thể đặt theo yêu cầu (kích thước, màu sắc, in logo) không?',
      a: 'Có. Chúng tôi nhận đặt hàng theo yêu cầu: kích thước đặc biệt, màu sắc tùy chọn, in logo/tên thương hiệu. Tư vấn và báo giá qua Zalo: 0989 778 247. Thời gian sản xuất 7–14 ngày tuỳ số lượng.',
    },
    {
      q: 'Chính sách đổi trả như thế nào?',
      a: 'Đổi trả trong 7 ngày kể từ ngày nhận hàng nếu sản phẩm có lỗi sản xuất. Khách hàng chụp ảnh sản phẩm lỗi gửi qua Zalo, chúng tôi xác nhận và gửi đổi trong 2–3 ngày làm việc. Chi phí vận chuyển đổi trả do KAHA chịu.',
    },
  ];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const craftSpecialty = product.category === 'den-long' ? 'đèn lồng truyền thống'
    : product.category === 'den-tre-may' ? 'đan mây tre thủ công'
    : product.category === 'den-vai-lua' ? 'đèn vải lụa cao cấp'
    : product.category === 'den-go' ? 'đèn gỗ chạm khắc'
    : 'đèn thủ công Việt Nam';

  return (
    <>
      {/* Preload ảnh sản phẩm chính → giảm LCP */}
      {product.image && <link rel="preload" as="image" href={product.image} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, '<\\/script>') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/<\/script>/gi, '<\\/script>') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\/script>/gi, '<\\/script>') }} />


      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: categoryLabel, href: `/c/${product.category}` },
              { label: product.nameShort },
            ]}
          />

          {/* Product detail interactive section */}
          <ProductDetailClient product={product} zaloPhone={siteSettings.zalo_phone || '0989778247'} storePhone={siteSettings.store_phone || '0989.778.247'} />

          {/* ── Tại sao chọn KAHA ── */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="text-[11px] uppercase tracking-[0.16em] text-brand-amber font-bold mb-2">Cam kết của chúng tôi</div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]" style={{ letterSpacing: '-0.025em' }}>
                Tại sao chọn <span className="text-brand-green">KAHA</span>?
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2v0"/>
                      <path d="M14 10V6a2 2 0 00-2-2 2 2 0 00-2 2v3"/>
                      <path d="M10 10.5V8a2 2 0 00-2-2 2 2 0 00-2 2v7a6 6 0 006 6h2a6 6 0 006-6v-5a2 2 0 00-2-2 2 2 0 00-2 2v1"/>
                    </svg>
                  ),
                  title: 'Thủ công 100%',
                  desc: 'Từng sản phẩm được làm tay bởi nghệ nhân Việt Nam, không hàng công nghiệp hay nhập khẩu.',
                },
                {
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  title: 'Nguồn gốc rõ ràng',
                  desc: 'Chúng tôi biết tên, địa chỉ từng nghệ nhân. Mỗi đèn có xuất xứ và câu chuyện riêng.',
                },
                {
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" rx="1"/>
                      <path d="M16 8h4l3 3v5h-7V8z"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  ),
                  title: 'Giao hàng toàn quốc',
                  desc: 'Đóng gói chống sốc, giao 2–5 ngày. Miễn phí vận chuyển đơn từ 500,000đ.',
                },
                {
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  ),
                  title: 'Đổi trả dễ dàng',
                  desc: '7 ngày đổi trả nếu lỗi sản xuất. Chúng tôi chịu toàn bộ phí vận chuyển hoàn hàng.',
                },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-2xl p-5 border border-[#ede8e0] flex flex-col gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                  <div className="w-12 h-12 rounded-xl bg-brand-green-lt flex items-center justify-center text-brand-green shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#1a1a1a] mb-1">{item.title}</div>
                    <div className="text-[12.5px] text-[#666] leading-[1.7]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Maker profile ── */}
          <div className="mb-16 rounded-2xl overflow-hidden border border-[#ede8e0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="bg-brand-green px-8 py-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/15 border-2 border-white/25 flex items-center justify-center shrink-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 11V7a2 2 0 00-2-2v0a2 2 0 00-2 2v0"/>
                  <path d="M14 10V6a2 2 0 00-2-2v0a2 2 0 00-2 2v3"/>
                  <path d="M10 10.5V8a2 2 0 00-2-2v0a2 2 0 00-2 2v7a6 6 0 006 6h2a6 6 0 006-6v-5a2 2 0 00-2-2v0a2 2 0 00-2 2v1"/>
                </svg>
              </div>
              <div>
                <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Nghệ nhân tạo ra sản phẩm này</div>
                <div className="text-xl font-bold text-white">{product.maker}</div>
                <div className="text-sm text-white/70 mt-0.5">{product.makerRegion ?? 'Hội An, Quảng Nam'} · Việt Nam</div>
              </div>
            </div>
            <div className="bg-white px-8 py-6">
              <p className="text-sm text-[#444] leading-[1.85] mb-4">
                Chuyên về <span className="font-semibold text-[#1a1a1a]">{craftSpecialty}</span> với hơn 20 năm kinh nghiệm.
                Mỗi chiếc đèn đều là sự kết hợp giữa kỹ thuật truyền thống và tâm huyết nghề được truyền qua từng thế hệ, sản xuất tại xưởng {product.makerRegion ?? 'TP. Hồ Chí Minh'}.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  'Làng nghề di sản',
                  'Xuất khẩu quốc tế',
                  'Đặt hàng theo yêu cầu',
                ].map(badge => (
                  <span key={badge} className="text-[11px] font-semibold text-brand-green bg-brand-green-lt px-3 py-1.5 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Frequently bought together ── */}
          {boughtTogether.length > 0 && (
            <div className="bg-white border border-[#ede8e0] rounded-2xl p-6 md:p-8 mb-16 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-6" style={{ letterSpacing: '-0.02em' }}>
                Thường Mua <span className="text-brand-green">Cùng</span>
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {bundleItems.map((item, idx) => (
                  <div key={item.id} className="flex sm:contents items-center gap-4">
                    {idx > 0 && (
                      <div className="hidden sm:flex w-8 h-8 shrink-0 items-center justify-center text-[#ccc] text-2xl font-light self-center">
                        +
                      </div>
                    )}
                    <div className={[
                      'flex sm:flex-col items-center gap-3 sm:gap-2 flex-1',
                      idx === 0 ? 'sm:max-w-[160px]' : 'sm:max-w-[140px]',
                    ].join(' ')}>
                      <div className={[
                        'shrink-0 rounded-xl overflow-hidden bg-white border border-[#ede8e0]',
                        idx === 0 ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-16 h-16 sm:w-24 sm:h-24',
                      ].join(' ')}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-1.5"
                            style={{ mixBlendMode: 'multiply', filter: 'contrast(1.04) saturate(1.1)' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl bg-brand-green-lt rounded-xl" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={[
                          'font-medium text-[#1a1a1a] leading-tight line-clamp-2',
                          idx === 0 ? 'text-sm' : 'text-xs',
                        ].join(' ')}>
                          {item.name}
                          {idx === 0 && (
                            <span className="ml-1.5 text-[10px] font-bold text-brand-green bg-brand-green-lt px-1.5 py-0.5 rounded">
                              Sản phẩm này
                            </span>
                          )}
                        </div>
                        <div className={[
                          'font-bold text-brand-green mt-0.5',
                          idx === 0 ? 'text-base' : 'text-sm',
                        ].join(' ')}>
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                    {idx < bundleItems.length - 1 && (
                      <div className="flex sm:hidden text-[#ccc] text-xl font-light ml-auto">+</div>
                    )}
                  </div>
                ))}
              </div>

              <BoughtTogetherClient items={bundleItems} totalPrice={bundleTotalPrice} />
            </div>
          )}

          {/* ── FAQ ── */}
          <div className="mb-16">
            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-[0.16em] text-brand-amber font-bold mb-2">Câu hỏi thường gặp</div>
              <h2 className="text-2xl font-bold text-[#1a1a1a]" style={{ letterSpacing: '-0.02em' }}>
                Giải đáp về <span className="text-brand-green">{product.nameShort ?? product.name}</span>
              </h2>
            </div>
            <FaqAccordion items={faqItems} />
          </div>

          {/* ── Related products — stream riêng, không block main content ── */}
          <Suspense fallback={
            <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {[0,1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#EDE5D8]">
                  <div className="aspect-square bg-brand-green-lt animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-3/4 bg-brand-border rounded animate-pulse" />
                    <div className="h-5 w-24 bg-brand-border rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          }>
            <RelatedSection product={product} />
          </Suspense>

        </div>
      </div>
    </>
  );
}
