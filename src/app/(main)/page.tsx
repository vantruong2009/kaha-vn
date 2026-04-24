import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { parseJSON, SETTINGS_DEFAULTS } from '@/lib/site-settings';
import { getSettings } from '@/lib/site-settings-server';
import type { ReviewItem, CategoryShowcaseItem, B2bFullFeature } from '@/lib/site-settings';
import { getCatalogProducts } from '@/lib/products-db';
import { getPostBySlug } from '@/lib/getPosts';

const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'));
const HomeBestsellersSection = dynamic(() => import('@/components/HomeBestsellersSection'));

export const revalidate = 86400;

// ── Obsidian design tokens ─────────────────────────────────────────────────
const INK900 = 'oklch(0.12 0 0)';
const INK700 = 'oklch(0.24 0 0)';
const INK500 = 'oklch(0.42 0 0)';
const INK300 = 'oklch(0.72 0 0)';
const PAPER  = 'oklch(0.98 0 0)';
const PAPER_WARM = 'oklch(0.97 0.005 85)';
const HAIRLINE = 'oklch(0.88 0 0)';
const PLATINUM = 'oklch(0.73 0.038 268)';

/** Placeholder ảnh chờ — hairline border, paper-warm bg, caption Plate style */
function Plate({ aspect = '4/5', label = '', className = '' }: { aspect?: string; label?: string; className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center gap-3 ${className}`}
      style={{ aspectRatio: aspect, background: PAPER_WARM, border: `1px solid ${HAIRLINE}` }}
      aria-label={`Placeholder ảnh — ${label}`}
    >
      <span style={{ width: 20, height: 1, background: HAIRLINE, display: 'block' }} />
      {label && (
        <span style={{ fontSize: 9.5, letterSpacing: '0.22em', color: INK300, textTransform: 'uppercase', fontFamily: 'var(--font-body, Inter, sans-serif)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ── Section label / eyebrow ────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, letterSpacing: '0.28em', color: PLATINUM, textTransform: 'uppercase', fontWeight: 600, fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
      {children}
    </p>
  );
}

// ── Hairline divider ──────────────────────────────────────────────────────
function Hairline() {
  return <div style={{ height: 1, background: HAIRLINE, width: '100%' }} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_home_title || SETTINGS_DEFAULTS.seo_home_title;
  const description = settings.seo_home_desc || SETTINGS_DEFAULTS.seo_home_desc;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: 'https://kaha.vn' },
    openGraph: { title, description, url: 'https://kaha.vn', siteName: 'KAHA', locale: 'vi_VN', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function HomePage() {
  const [settings, products] = await Promise.all([
    getSettings(),
    getCatalogProducts(),
  ]);

  // Blog posts
  type PostItem = { title: string; slug: string; date: string; excerpt: string; thumbnail: string | null };
  const featuredBlogSlugs = [
    settings.home_blog_slug_1 || SETTINGS_DEFAULTS.home_blog_slug_1,
    settings.home_blog_slug_2 || SETTINGS_DEFAULTS.home_blog_slug_2,
    settings.home_blog_slug_3 || SETTINGS_DEFAULTS.home_blog_slug_3,
  ].filter(Boolean);
  const latestPosts = (await Promise.all(featuredBlogSlugs.map(s => getPostBySlug(s))))
    .filter((p): p is NonNullable<typeof p> => !!p) as PostItem[];

  // B2B features
  const _defB2bFeatures = parseJSON<B2bFullFeature[]>(SETTINGS_DEFAULTS.home_b2b_full_features, []);
  const b2bFullFeatures = (() => { const v = parseJSON<B2bFullFeature[]>(settings.home_b2b_full_features, _defB2bFeatures); return v.length ? v : _defB2bFeatures; })();

  // Reviews
  const _defReviews = parseJSON<ReviewItem[]>(SETTINGS_DEFAULTS.home_reviews, []);
  const homeReviews = (() => { const v = parseJSON<ReviewItem[]>(settings.home_reviews, _defReviews); return v.length ? v : _defReviews; })();
  const reviewsRating = settings.home_reviews_rating || SETTINGS_DEFAULTS.home_reviews_rating;
  const reviewsCount  = settings.home_reviews_count  || SETTINGS_DEFAULTS.home_reviews_count;

  // Showcase
  const _defShowcase = parseJSON<CategoryShowcaseItem[]>(SETTINGS_DEFAULTS.home_showcase, []);
  const homeShowcase = (() => { const v = parseJSON<CategoryShowcaseItem[]>(settings.home_showcase, _defShowcase); return v.length ? v : _defShowcase; })();

  const SITE = 'https://kaha.vn';

  // Schema LD
  const FAQ_LD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Đèn vải KAHA được làm từ chất liệu gì?', acceptedAnswer: { '@type': 'Answer', text: 'KAHA chuyên gia công đèn vải cao cấp từ vải lụa, vải thô, vải organza và chụp đèn vải dành cho khách sạn, resort. Mỗi sản phẩm đều được làm thủ công theo đặt hàng.' } },
      { '@type': 'Question', name: 'Đặt gia công đèn vải số lượng lớn được không?', acceptedAnswer: { '@type': 'Answer', text: 'Có. KAHA nhận gia công từ 20 chiếc trở lên với chiết khấu theo số lượng, hỗ trợ in logo thương hiệu và tùy chỉnh màu sắc, kích thước, chất liệu vải theo yêu cầu dự án.' } },
      { '@type': 'Question', name: 'Showroom KAHA ở đâu?', acceptedAnswer: { '@type': 'Answer', text: 'Xưởng & showroom KAHA tại 262/1/93 Phan Anh, Phường Phú Thạnh, TP.HCM. Mở cửa 8:00–21:00 hàng ngày. Liên hệ 09368.766.79 để đặt lịch tư vấn.' } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD).replace(/<\/script>/gi, '<\\/script>') }} />

      {/* ══════════════════════════════════════════
          1. HERO — Editorial split (Obsidian layout #1)
             Text trái 42%, ảnh phải 58% full-bleed
      ══════════════════════════════════════════ */}
      <section style={{ background: PAPER }} className="flex flex-col md:flex-row overflow-hidden min-h-[520px] md:min-h-[640px]">

        {/* Left — copy column */}
        <div className="md:w-[42%] shrink-0 flex flex-col justify-center px-6 md:px-14 lg:px-16 py-14 md:py-0">
          <Eyebrow>Đèn Vải Cao Cấp & Chụp Đèn Khách Sạn</Eyebrow>

          <h1 className="mt-5 mb-6" style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, lineHeight: 1.04, color: INK900, fontSize: 'clamp(2.6rem, 5vw, 4.8rem)', letterSpacing: '-0.02em' }}>
            Ánh sáng<br />
            <em style={{ fontStyle: 'italic', color: INK700 }}>được dệt</em><br />
            bằng vải
          </h1>

          <p style={{ fontSize: 15, lineHeight: 1.75, color: INK500, maxWidth: '34ch', borderLeft: `2px solid ${HAIRLINE}`, paddingLeft: 16 }}>
            Xưởng gia công đèn vải cao cấp tại TP.HCM — chụp đèn khách sạn, đèn thả trần, đèn trang trí nội thất theo đặt hàng từ 20 chiếc.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/san-pham"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', color: PAPER, background: INK900, padding: '12px 28px', fontFamily: 'var(--font-body, Inter, sans-serif)' }}
            >
              Xem bộ sưu tập
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link
              href="/lien-he"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', color: INK900, border: `1px solid ${INK900}`, padding: '12px 24px', fontFamily: 'var(--font-body, Inter, sans-serif)', background: 'transparent' }}
            >
              Gia công theo yêu cầu
            </Link>
          </div>

          {/* Nav pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { label: 'Chụp đèn khách sạn', href: '/c/chup-den-vai' },
              { label: 'Đèn thả trần vải', href: '/c/den-tha-tran' },
              { label: 'Đèn vải cao cấp', href: '/c/den-vai-cao-cap' },
              { label: 'Gia công đơn hàng lớn', href: '/lien-he' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                style={{ fontSize: 11, letterSpacing: '0.04em', color: INK500, border: `1px solid ${HAIRLINE}`, padding: '5px 12px', background: PAPER, fontFamily: 'var(--font-body, Inter, sans-serif)', fontWeight: 500 }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right — image mosaic */}
        <div className="md:w-[58%] flex gap-0.5 overflow-hidden min-h-[300px] md:min-h-0">
          <div className="flex-1"><Plate aspect="2/3" label="Sản phẩm chính" className="h-full" /></div>
          <div className="w-[38%] flex flex-col gap-0.5">
            <Plate aspect="4/5" label="Chi tiết vải" className="flex-1" />
            <Plate aspect="4/3" label="Không gian" className="flex-1" />
          </div>
        </div>
      </section>

      <Hairline />

      {/* ══════════════════════════════════════════
          2. TRUST STRIP — 5 chỉ số
      ══════════════════════════════════════════ */}
      <section style={{ background: INK900 }} className="py-8 md:py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0">
          {[
            { num: '477+', label: 'Mẫu đèn vải' },
            { num: '15+', label: 'Năm kinh nghiệm' },
            { num: '500+', label: 'Dự án hoàn thành' },
            { num: '63', label: 'Tỉnh thành giao' },
            { num: '20+', label: 'Chiếc / đơn tối thiểu' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center md:border-r last:border-r-0 md:px-6" style={{ borderColor: 'oklch(0.24 0 0)' }}>
              <span style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: PAPER, letterSpacing: '-0.02em', fontFamily: 'var(--font-display, serif)' }}>{s.num}</span>
              <span style={{ fontSize: 10.5, color: INK300, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4, fontFamily: 'var(--font-body, Inter, sans-serif)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <Hairline />

      {/* ══════════════════════════════════════════
          3. EDITORIAL — Gia công đèn vải cao cấp
             Text trái, 3 ảnh dọc phải
      ══════════════════════════════════════════ */}
      <section style={{ background: PAPER_WARM }} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-16 items-start">

          {/* Text */}
          <div className="md:w-[42%] shrink-0 md:sticky md:top-24">
            <Eyebrow>Gia công theo yêu cầu</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', color: INK900, lineHeight: 1.12, marginTop: 20, marginBottom: 20, letterSpacing: '-0.01em' }}>
              Chụp đèn vải cho<br />khách sạn & resort
            </h2>
            <p style={{ fontSize: 15, color: INK500, lineHeight: 1.8, maxWidth: '36ch' }}>
              Từng chụp đèn được may thủ công theo thông số kỹ thuật của dự án — đường kính, chiều cao, chất liệu vải và màu sắc đều được kiểm soát chặt chẽ từ khâu chọn vải đến nghiệm thu.
            </p>
            <p style={{ fontSize: 15, color: INK500, lineHeight: 1.8, maxWidth: '36ch', marginTop: 16 }}>
              Phù hợp với yêu cầu thi công đồng bộ cho toàn bộ tầng hoặc khu vực lobby, nhà hàng, spa.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/c/chup-den-vai"
                style={{ fontSize: 12, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', color: PAPER, background: INK900, padding: '11px 24px', fontFamily: 'var(--font-body, Inter, sans-serif)', display: 'inline-block' }}>
                Xem chụp đèn khách sạn
              </Link>
              <Link href="/lien-he"
                style={{ fontSize: 12, letterSpacing: '0.06em', color: INK700, borderBottom: `1px solid ${INK300}`, paddingBottom: 2, fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
                Yêu cầu báo giá
              </Link>
            </div>
          </div>

          {/* Images — 3 vertical plates */}
          <div className="flex-1 flex gap-3">
            <div className="flex-1 flex flex-col gap-3 pt-8">
              <Plate aspect="3/4" label="Chụp đèn khách sạn" />
              <Plate aspect="4/3" label="Chi tiết may" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <Plate aspect="4/5" label="Ứng dụng lobby" />
              <Plate aspect="1/1" label="Vải lụa cao cấp" />
            </div>
          </div>
        </div>
      </section>

      <Hairline />

      {/* ══════════════════════════════════════════
          4. SHOWCASE DANH MỤC — 4 category cards
      ══════════════════════════════════════════ */}
      <section style={{ background: PAPER }} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <Eyebrow>Bộ sưu tập</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: INK900, marginTop: 12, lineHeight: 1.15 }}>
                Đèn vải theo không gian
              </h2>
            </div>
            <Link href="/san-pham" style={{ fontSize: 12, letterSpacing: '0.08em', color: INK500, textTransform: 'uppercase', fontWeight: 600, borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: 2 }}>
              Xem tất cả →
            </Link>
          </div>

          {/* 4 categories grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Chụp đèn khách sạn', sub: 'Hotel & Resort', href: '/c/chup-den-vai' },
              { label: 'Đèn thả trần vải', sub: 'Pendant Fabric', href: '/c/den-tha-tran' },
              { label: 'Đèn vải cao cấp', sub: 'Luxury Fabric Lamp', href: '/c/den-vai-cao-cap' },
              { label: 'Đèn trang trí nhà hàng', sub: 'Restaurant & Cafe', href: '/c/den-nha-hang' },
            ].map((cat, i) => (
              <Link key={i} href={cat.href} className="group block" style={{ textDecoration: 'none' }}>
                <Plate aspect="4/5" label={cat.label} />
                <div className="mt-3 px-0.5">
                  <p style={{ fontSize: 13, fontWeight: 600, color: INK900, fontFamily: 'var(--font-display, serif)' }}>{cat.label}</p>
                  <p style={{ fontSize: 11, color: INK500, letterSpacing: '0.06em', marginTop: 2, textTransform: 'uppercase' }}>{cat.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* 6 sub-category pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { label: 'Đèn lồng Hội An', href: '/c/hoi-an-lantern' },
              { label: 'Đèn gỗ', href: '/c/den-long-go' },
              { label: 'Đèn mây tre', href: '/c/den-may-tre' },
              { label: 'Đèn Nhật Bản', href: '/c/den-kieu-nhat' },
              { label: 'Đèn ngoài trời', href: '/c/ngoai-troi' },
              { label: 'Xem thêm →', href: '/san-pham' },
            ].map(p => (
              <Link key={p.href} href={p.href}
                style={{ fontSize: 11.5, color: INK500, border: `1px solid ${HAIRLINE}`, padding: '6px 14px', fontFamily: 'var(--font-body, Inter, sans-serif)', fontWeight: 500 }}>
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Hairline />

      {/* ══════════════════════════════════════════
          5. BESTSELLERS — sản phẩm nổi bật
      ══════════════════════════════════════════ */}
      <section style={{ background: PAPER_WARM }} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <Eyebrow>Sản phẩm nổi bật</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: INK900, marginTop: 12 }}>
                Bán chạy tháng này
              </h2>
            </div>
            <Link href="/san-pham" style={{ fontSize: 12, letterSpacing: '0.08em', color: INK500, textTransform: 'uppercase', fontWeight: 600, borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: 2 }}>
              Toàn bộ sản phẩm →
            </Link>
          </div>
          <HomeBestsellersSection
            products={products}
            label="Sản phẩm nổi bật"
            heading="Bán chạy tháng này"
            ctaText="Xem tất cả"
            ctaUrl="/san-pham"
          />
        </div>
      </section>

      <Hairline />

      {/* ══════════════════════════════════════════
          6. B2B / GIA CÔNG — dark section, split layout
      ══════════════════════════════════════════ */}
      <section style={{ background: INK900 }} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12 md:gap-16 items-center">

          {/* Image */}
          <div className="md:w-[48%] shrink-0">
            <Plate aspect="4/3" label="Xưởng gia công KAHA" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <Eyebrow>Đối tác doanh nghiệp</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3vw, 3rem)', color: PAPER, marginTop: 16, marginBottom: 20, lineHeight: 1.1 }}>
              Gia công đèn vải<br />
              <em style={{ color: PLATINUM, fontStyle: 'italic' }}>theo thông số dự án</em>
            </h2>
            <p style={{ fontSize: 15, color: INK300, lineHeight: 1.8, maxWidth: '38ch' }}>
              KAHA làm việc trực tiếp với kiến trúc sư, nhà thầu và bộ phận FF&E của khách sạn. Mỗi đơn hàng đều có hồ sơ kỹ thuật riêng — từ bản vẽ đến mẫu duyệt trước khi sản xuất hàng loạt.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {b2bFullFeatures.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-start gap-3" style={{ borderTop: `1px solid ${INK700}`, paddingTop: 14 }}>
                  <span style={{ color: PLATINUM, fontSize: 18, lineHeight: 1, marginTop: 2 }}>—</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: PAPER, fontFamily: 'var(--font-body, Inter, sans-serif)' }}>{f.title}</p>
                    <p style={{ fontSize: 12.5, color: INK300, marginTop: 4 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
              {/* Fallback nếu b2bFullFeatures trống */}
              {b2bFullFeatures.length === 0 && [
                { title: 'Tùy chỉnh hoàn toàn', desc: 'Màu sắc, kích thước, chất liệu theo bản vẽ' },
                { title: 'Mẫu duyệt trước sản xuất', desc: 'Luôn có mẫu thực tế trước khi xuất đơn' },
                { title: 'Giao hàng theo tiến độ', desc: 'Phối hợp với nhà thầu, đúng timeline thi công' },
                { title: 'Hỗ trợ báo giá 48h', desc: 'Phản hồi nhanh, hồ sơ báo giá đầy đủ' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-3" style={{ borderTop: `1px solid ${INK700}`, paddingTop: 14 }}>
                  <span style={{ color: PLATINUM, fontSize: 18, lineHeight: 1, marginTop: 2 }}>—</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: PAPER }}>{f.title}</p>
                    <p style={{ fontSize: 12.5, color: INK300, marginTop: 4 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/lien-he"
                style={{ fontSize: 12, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', color: INK900, background: PAPER, padding: '12px 28px', fontFamily: 'var(--font-body, Inter, sans-serif)', display: 'inline-block' }}>
                Yêu cầu báo giá
              </Link>
              <Link href="/ve-chung-toi"
                style={{ fontSize: 12, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', color: PAPER, border: `1px solid ${INK500}`, padding: '12px 24px', fontFamily: 'var(--font-body, Inter, sans-serif)', display: 'inline-block', background: 'transparent' }}>
                Về xưởng KAHA
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Hairline />

      {/* ══════════════════════════════════════════
          7. KHÔNG GIAN ỨNG DỤNG — 4 spaces
      ══════════════════════════════════════════ */}
      <section style={{ background: PAPER }} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10 max-w-xl">
            <Eyebrow>Không gian ứng dụng</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: INK900, marginTop: 12, lineHeight: 1.15 }}>
              Đèn KAHA phù hợp<br />với mọi không gian cao cấp
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Khách sạn & Resort', href: '/c/den-khach-san' },
              { label: 'Nhà hàng & Cafe', href: '/c/den-nha-hang' },
              { label: 'Lobby & Sảnh đón', href: '/c/chup-den-vai' },
              { label: 'Biệt thự & Nhà riêng', href: '/c/den-vai-cao-cap' },
            ].map((s, i) => (
              <Link key={i} href={s.href} className="block group" style={{ textDecoration: 'none' }}>
                <Plate aspect="3/4" label={s.label} />
                <p style={{ fontSize: 12.5, fontWeight: 600, color: INK900, marginTop: 10, letterSpacing: '0.01em' }}>{s.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Hairline />

      {/* ══════════════════════════════════════════
          8. ĐÁNH GIÁ KHÁCH HÀNG
      ══════════════════════════════════════════ */}
      <section style={{ background: PAPER_WARM }} className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <Eyebrow>Khách hàng nói gì</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: INK900, marginTop: 12 }}>
                Tin tưởng từ {reviewsCount} đơn hàng
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: INK900, fontFamily: 'var(--font-display, serif)' }}>{reviewsRating}</span>
              <span style={{ fontSize: 14, color: PLATINUM }}>★★★★★</span>
            </div>
          </div>
          <ReviewsSection reviews={homeReviews} rating={reviewsRating} count={reviewsCount} limit={3} />
        </div>
      </section>

      <Hairline />

      {/* ══════════════════════════════════════════
          9. BLOG / KIẾN THỨC ĐÈN VẢI
      ══════════════════════════════════════════ */}
      {latestPosts.length > 0 && (
        <section style={{ background: PAPER }} className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <Eyebrow>Kiến thức & Cảm hứng</Eyebrow>
                <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: INK900, marginTop: 12 }}>
                  Bài viết mới nhất
                </h2>
              </div>
              <Link href="/blog" style={{ fontSize: 12, letterSpacing: '0.08em', color: INK500, textTransform: 'uppercase', fontWeight: 600, borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: 2 }}>
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.slice(0, 3).map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block group" style={{ textDecoration: 'none' }}>
                  <Plate aspect="16/9" label={post.title} />
                  <div style={{ paddingTop: 16, borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: 16, marginBottom: 4 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: INK900, lineHeight: 1.45, fontFamily: 'var(--font-display, serif)' }}>{post.title}</p>
                    {post.excerpt && <p style={{ fontSize: 12.5, color: INK500, marginTop: 6, lineHeight: 1.6 }} className="line-clamp-2">{post.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          10. SHOWROOM CTA — dark strip
      ══════════════════════════════════════════ */}
      <section style={{ background: INK700 }} className="py-12 md:py-14">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <Eyebrow>Ghé thăm xưởng</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", serif)', fontWeight: 400, fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', color: PAPER, marginTop: 10, lineHeight: 1.2 }}>
              262/1/93 Phan Anh — TP.HCM<br />
              <span style={{ color: INK300, fontSize: '0.8em' }}>Mở cửa 8:00–21:00, tất cả các ngày</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <a href="https://maps.app.goo.gl/5htfAhQgfXvCFmhK9" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', color: INK900, background: PAPER, padding: '12px 28px', display: 'inline-block', textAlign: 'center', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
              Xem bản đồ
            </a>
            <a href="tel:0936876679"
              style={{ fontSize: 12, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', color: PAPER, border: `1px solid ${INK500}`, padding: '12px 28px', display: 'inline-block', textAlign: 'center', fontFamily: 'var(--font-body, Inter, sans-serif)', background: 'transparent' }}>
              Gọi 09368.766.79
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
