import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { parseJSON, SETTINGS_DEFAULTS } from "@/lib/site-settings";
import type {
  ValueItem,
  CategoryShowcaseItem,
  ArtisanValueItem,
  B2bFullFeature,
  CongTrinhProject,
} from "@/lib/site-settings";
import { getSettings } from "@/lib/site-settings-server";
import { getCatalogProducts } from "@/lib/products-db";
import { getPostBySlug } from "@/lib/getPosts";
import DeliverySection from "@/components/DeliverySection";
import CongTrinhSection from "@/components/CongTrinhSection";
import HomeBestsellersSection from "@/components/HomeBestsellersSection";

const NewsletterForm = dynamic(() => import("@/components/NewsletterForm"));

export const revalidate = 86400;

// ── Placeholder image component ──────────────────────────────────────────────
function ImgPlaceholder({
  className,
  label,
  aspectRatio,
}: {
  className?: string;
  label?: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-stone-100 ${className ?? ""}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {label && (
        <span className="text-[11px] uppercase tracking-widest text-stone-400 select-none">
          {label}
        </span>
      )}
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title =
    settings.seo_home_title ||
    "KAHA.VN — Xưởng gia công đèn vải cao cấp theo bản vẽ";
  const description =
    settings.seo_home_desc ||
    "KAHA là xưởng sản xuất đèn vải, đèn treo và khung kim loại theo brief kiến trúc — phục vụ khách sạn, nhà hàng, F&B và không gian thương mại.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "https://kaha.vn" },
    openGraph: {
      title,
      description,
      url: "https://kaha.vn",
      siteName: "KAHA.VN",
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [settings, products] = await Promise.all([
    getSettings(),
    getCatalogProducts(),
  ]);

  const sectionsConfig = {
    hero: true,
    showcase: true,
    bestsellers: true,
    spaces: true,
    artisan: true,
    b2b: true,
    blog: true,
    ...JSON.parse(settings.home_sections_config || "{}"),
  };

  // ── Hero data ──────────────────────────────────────────────────────────────
  const hero = {
    subtitle: settings.hero_subtitle || "KAHA · Xưởng sản xuất tại Việt Nam",
    title: settings.hero_title || "Gia công đèn vải\ncao cấp theo bản vẽ",
    desc:
      settings.hero_desc ||
      "Chúng tôi sản xuất đèn vải, đèn treo và khung kim loại theo đúng brief kiến trúc — kích thước, chất liệu, nguồn sáng và tiêu chuẩn lắp đặt. Một đầu mối từ mẫu thử đến giao hàng loạt.",
    ctaText: settings.hero_cta_text || "Xem danh mục",
    ctaUrl: settings.hero_cta_url || "/shop",
  };

  // ── Editorial / showcase headings ─────────────────────────────────────────
  const showcaseLabel =
    settings.home_showcase_label || "Danh mục sản phẩm";
  const showcaseHeading =
    settings.home_showcase_heading || "Chọn theo dòng sản phẩm";
  const showcaseDesc =
    settings.home_showcase_desc ||
    "Đèn vải treo trần, đèn khung kim loại và đèn lồng dân gian — đủ để chốt spec cho mọi dự án.";
  const showcaseCtaText =
    settings.home_showcase_cta_text || "Xem tất cả danh mục";
  const showcaseCtaUrl =
    settings.home_showcase_cta_url || "/shop";

  // ── Bestsellers ────────────────────────────────────────────────────────────
  const bestsellersLabel =
    settings.home_bestsellers_label || "Sản phẩm nổi bật";
  const bestsellersHeading =
    settings.home_bestsellers_heading || "Bán chạy trong tháng";
  const bestsellersCtaText =
    settings.home_bestsellers_cta_text || "Xem tất cả";
  const bestsellersCtaUrl =
    settings.home_bestsellers_cta_url || "/shop";

  // ── Spaces ─────────────────────────────────────────────────────────────────
  const spacesLabel = settings.home_spaces_label || "Ứng dụng";
  const spacesHeading =
    settings.home_spaces_heading || "Đèn KAHA trong không gian thực tế";
  const spacesDesc =
    settings.home_spaces_desc ||
    "Từ khách sạn boutique đến chuỗi nhà hàng — xem cách chúng tôi đã triển khai.";

  const spaces = [
    {
      label: settings.home_space_label_1 || "Khách sạn & Resort",
      desc:
        settings.home_space_desc_1 ||
        "Đèn trần và đèn lối đi theo bản vẽ thi công",
      href: settings.home_space_href_1 || "/shop",
    },
    {
      label: settings.home_space_label_2 || "Nhà hàng & F&B",
      desc:
        settings.home_space_desc_2 || "Đèn thả, chụp vải theo concept không gian",
      href: settings.home_space_href_2 || "/shop",
    },
    {
      label: settings.home_space_label_3 || "Spa & Wellness",
      desc:
        settings.home_space_desc_3 || "Ánh sáng dịu, vật liệu tự nhiên",
      href: settings.home_space_href_3 || "/shop",
    },
    {
      label: settings.home_space_label_4 || "Retail & Showroom",
      desc:
        settings.home_space_desc_4 ||
        "Đèn điểm nhấn theo zone trưng bày",
      href: settings.home_space_href_4 || "/shop",
    },
  ];

  // ── Artisan / workshop ─────────────────────────────────────────────────────
  const artisanLabel =
    settings.home_artisan_label || "Về xưởng KAHA";
  const artisanHeading =
    settings.home_artisan_heading ||
    "Xưởng gia công Việt Nam\ntừ mẫu thử đến sản xuất loạt";
  const artisanBody =
    settings.home_artisan_body ||
    "KAHA vận hành xưởng sản xuất chuyên sâu tại TP.HCM với đội ngũ thợ có kinh nghiệm hơn 10 năm. Chúng tôi nhận brief kiến trúc, tư vấn spec, làm mẫu thử và triển khai giao hàng loạt — toàn bộ trong một đầu mối.";
  const artisanCtaText =
    settings.home_artisan_cta_text || "Đặt lịch tham quan xưởng";
  const artisanCtaUrl =
    settings.home_artisan_cta_url || "/showroom";

  const artisanStats = [
    {
      num: settings.home_artisan_stat1_num || "10+",
      label: settings.home_artisan_stat1_label || "Năm\nkinh nghiệm",
    },
    {
      num: settings.home_artisan_stat2_num || "477+",
      label: settings.home_artisan_stat2_label || "SKU\nđã xuất bản",
    },
    {
      num: settings.home_artisan_stat3_num || "12T",
      label: settings.home_artisan_stat3_label || "Bảo hành\nkhung",
    },
  ];

  const _defArtisanVals = parseJSON<ArtisanValueItem[]>(
    SETTINGS_DEFAULTS.home_artisan_values,
    []
  );
  const homeArtisanValues = (() => {
    const v = parseJSON<ArtisanValueItem[]>(
      settings.home_artisan_values,
      _defArtisanVals
    );
    return v.length ? v : _defArtisanVals;
  })();

  // ── Trust stats bar ────────────────────────────────────────────────────────
  const trustStats = [
    {
      num: settings.home_trust_s1_num || "477+",
      label: settings.home_trust_s1_label || "SKU đã xuất bản",
    },
    {
      num: settings.home_trust_s2_num || "48h",
      label: settings.home_trust_s2_label || "Phản hồi RFQ",
    },
    {
      num: settings.home_trust_s3_num || "B2B",
      label: settings.home_trust_s3_label || "Khách sạn · F&B · Retail",
    },
    {
      num: settings.home_trust_s4_num || "12T",
      label: settings.home_trust_s4_label || "Bảo hành khung",
    },
  ];
  const trustBg = settings.home_trust_bg || "#111111";

  // ── Category showcase ──────────────────────────────────────────────────────
  const _defShowcase = parseJSON<CategoryShowcaseItem[]>(
    SETTINGS_DEFAULTS.home_showcase,
    []
  );
  const homeShowcase = (() => {
    const v = parseJSON<CategoryShowcaseItem[]>(
      settings.home_showcase,
      _defShowcase
    );
    return v.length
      ? v
      : [
          {
            href: "/shop",
            img: "",
            label: "Đèn vải treo trần",
            sub: "Chụp vải, khung kim loại, nhiều kích thước",
          },
          {
            href: "/shop",
            img: "",
            label: "Đèn lồng dân gian",
            sub: "Lồng tre, mây đan, vải thủ công",
          },
          {
            href: "/shop",
            img: "",
            label: "Đèn khung sắt",
            sub: "Sơn tĩnh điện, bề mặt matte & brass",
          },
          {
            href: "/shop",
            img: "",
            label: "Gia công theo yêu cầu",
            sub: "Theo bản vẽ kiến trúc, số lượng lớn",
          },
        ];
  })();

  // ── Blog ───────────────────────────────────────────────────────────────────
  const blogLabel = settings.home_blog_label || "Journal kỹ thuật";
  const blogHeading =
    settings.home_blog_heading || "Tài liệu kỹ thuật & case B2B";
  const blogCtaText = settings.home_blog_cta_text || "Xem tất cả bài viết";
  const blogCtaUrl = settings.home_blog_cta_url || "/journal";
  type PostItem = {
    title: string;
    slug: string;
    date: string;
    content: string;
    excerpt: string;
    categories: string[];
    thumbnail: string | null;
  };
  const featuredBlogSlugs = [
    settings.home_blog_slug_1 || SETTINGS_DEFAULTS.home_blog_slug_1,
    settings.home_blog_slug_2 || SETTINGS_DEFAULTS.home_blog_slug_2,
    settings.home_blog_slug_3 || SETTINGS_DEFAULTS.home_blog_slug_3,
  ].filter(Boolean);
  const latestPosts = (
    await Promise.all(featuredBlogSlugs.map((slug) => getPostBySlug(slug)))
  ).filter(
    (p): p is NonNullable<Awaited<ReturnType<typeof getPostBySlug>>> => !!p
  ) as PostItem[];

  // ── B2B Full ───────────────────────────────────────────────────────────────
  const b2bFullLabel = settings.home_b2b_full_label || "Đặt hàng B2B";
  const b2bFullHeading =
    settings.home_b2b_full_heading || "Đặt hàng sỉ cho dự án lớn";
  const b2bFullDesc =
    settings.home_b2b_full_desc ||
    "Gửi bản vẽ và yêu cầu kỹ thuật — nhận báo giá trong 48h, mẫu thử trong 7–10 ngày làm việc. Chúng tôi phục vụ đơn từ 20 chiếc trở lên.";
  const b2bFullCta = settings.home_b2b_full_cta || "Gửi yêu cầu báo giá";
  const b2bFullCtaUrl = settings.home_b2b_full_cta_url || "/showroom";
  const _defB2bFeatures = parseJSON<B2bFullFeature[]>(
    SETTINGS_DEFAULTS.home_b2b_full_features,
    []
  );
  const b2bFullFeatures = (() => {
    const v = parseJSON<B2bFullFeature[]>(
      settings.home_b2b_full_features,
      _defB2bFeatures
    );
    return v.length
      ? v
      : [
          {
            icon: "custom",
            title: "Theo bản vẽ kiến trúc",
            desc: "Kích thước, màu, chất liệu theo spec dự án",
          },
          {
            icon: "ship",
            title: "Giao hàng toàn quốc",
            desc: "Đóng gói chuyên nghiệp, giao theo tiến độ công trình",
          },
          {
            icon: "discount",
            title: "Giá sỉ cạnh tranh",
            desc: "Chiết khấu theo số lượng, hỗ trợ thanh toán linh hoạt",
          },
          {
            icon: "support",
            title: "Hỗ trợ kỹ thuật",
            desc: "Tư vấn lắp đặt, bảo hành khung 12 tháng",
          },
        ];
  })();

  const b2bStore = {
    address:
      settings.home_b2b_store_address ||
      SETTINGS_DEFAULTS.home_b2b_store_address,
    hours:
      settings.home_b2b_store_hours || SETTINGS_DEFAULTS.home_b2b_store_hours,
    mapsUrl:
      settings.home_b2b_store_maps_url ||
      SETTINGS_DEFAULTS.home_b2b_store_maps_url,
    phone:
      settings.home_b2b_store_phone || SETTINGS_DEFAULTS.home_b2b_store_phone,
  };

  // ── Công trình ─────────────────────────────────────────────────────────────
  const congTrinhProjects = parseJSON<CongTrinhProject[]>(
    settings.home_congtrinh_projects || SETTINGS_DEFAULTS.home_congtrinh_projects,
    []
  );

  // ── Newsletter ─────────────────────────────────────────────────────────────
  const newsletterLabel =
    settings.home_newsletter_label || SETTINGS_DEFAULTS.home_newsletter_label;
  const newsletterHeading =
    settings.home_newsletter_heading ||
    SETTINGS_DEFAULTS.home_newsletter_heading;
  const newsletterDesc =
    settings.home_newsletter_desc || SETTINGS_DEFAULTS.home_newsletter_desc;
  const newsletterFootnote =
    settings.home_newsletter_footnote ||
    SETTINGS_DEFAULTS.home_newsletter_footnote;

  // ── Icon map ───────────────────────────────────────────────────────────────
  const B2B_FEATURE_ICONS: Record<string, React.ReactNode> = {
    discount: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="6.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
      </svg>
    ),
    custom: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    ship: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    support: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  };

  const ARTISAN_ICONS: Record<string, React.ReactNode> = {
    handcraft: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0" />
        <path d="M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2" />
        <path d="M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8" />
        <path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2a8 8 0 01-7.4-4.97L3 17a2 2 0 011.4-3.4H9" />
      </svg>
    ),
    leaf: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75" />
        <path d="M22 2C16 2 10 4 6 8c-2 3-3 6-3 10 4 0 7-1 10-3 4-4 6-10 6-16 0 0 0 0-1 1" />
      </svg>
    ),
    truck: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  };

  const CTA_SECONDARY_CLASS =
    "inline-flex items-center gap-1.5 text-[12.5px] font-bold rounded-xl px-4 py-2.5 shrink-0 transition-all";
  const CTA_SECONDARY_STYLE = {
    color: "#111111",
    border: "1px solid #d4d4d4",
    background: "linear-gradient(to bottom, #ffffff, #f5f5f5)",
  } as const;

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO — text trái + mosaic placeholder phải
      ═══════════════════════════════════════════ */}
      {sectionsConfig.hero && (
        <section className="flex flex-col md:flex-row overflow-hidden md:min-h-[500px] bg-white">
          {/* Left */}
          <div className="md:w-[38%] shrink-0 flex flex-col justify-center px-6 md:px-12 lg:px-14 py-8 md:py-0">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="block flex-shrink-0"
                style={{ width: 28, height: 1, background: "#111" }}
              />
              <p className="font-extrabold uppercase leading-[1.3] max-w-[260px] md:max-w-none" style={{ fontSize: 10.5, letterSpacing: "0.2em", color: "#555" }}>
                {hero.subtitle}
              </p>
            </div>

            {/* Headline */}
            <h1 className="mb-5 md:mb-6" style={{ lineHeight: 1.01 }}>
              {hero.title.split("\n").map((line, i) => (
                <span
                  key={i}
                  className="block font-extrabold"
                  style={{
                    fontSize: "clamp(2.25rem, 4.1vw, 4.1rem)",
                    color: "#111",
                    letterSpacing: "-0.034em",
                  }}
                >
                  {line}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p
              className="leading-[1.8] mb-5 md:mb-6"
              style={{
                fontSize: 14.5,
                maxWidth: "31ch",
                color: "#555",
                paddingLeft: 14,
                borderLeft: "2px solid #ddd",
              }}
            >
              {hero.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-4">
              <Link
                href={hero.ctaUrl}
                className="inline-flex items-center gap-2 font-bold rounded-full transition-all hover:-translate-y-0.5 self-start"
                style={{
                  fontSize: 11.8,
                  letterSpacing: "0.02em",
                  padding: "10px 24px",
                  color: "#ffffff",
                  background: "#111111",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
                }}
              >
                {hero.ctaText}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/showroom"
                className="inline-flex items-center gap-2 font-bold rounded-full transition-all"
                style={{
                  fontSize: 11.8,
                  letterSpacing: "0.02em",
                  padding: "10px 24px",
                  color: "#111",
                  border: "1px solid #ccc",
                  background: "#fff",
                }}
              >
                Đặt lịch xưởng
              </Link>
            </div>

            {/* Quick link chips */}
            <div className="grid grid-cols-2 gap-2 max-w-[340px]">
              {[
                { label: "Đèn vải treo trần", href: "/shop" },
                { label: "Đèn khung kim loại", href: "/shop" },
                { label: "Lồng đèn dân gian", href: "/shop" },
                { label: "Gia công theo yêu cầu", href: "/showroom" },
              ].map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-[11px] rounded-lg px-2.5 py-2 transition-all hover:-translate-y-[1px] font-medium"
                  style={{
                    color: "#555",
                    background: "#f5f5f5",
                    border: "1px solid #e5e5e5",
                  }}
                >
                  <span
                    style={{
                      width: 2.5,
                      height: 10,
                      borderRadius: 2,
                      background: "#bbb",
                      display: "inline-block",
                    }}
                  />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right — placeholder mosaic */}
          <div className="flex-1 aspect-[4/3] md:aspect-auto flex gap-1.5 p-2 md:p-1.5 md:pl-3 md:pr-0 md:py-1.5">
            <div className="flex-1 flex flex-col gap-1.5 min-h-0">
              <ImgPlaceholder
                className="flex-1 min-h-0 w-full"
                label="Ảnh sản phẩm 1"
              />
              <ImgPlaceholder
                className="flex-1 min-h-0 w-full"
                label="Ảnh sản phẩm 2"
              />
            </div>
            <ImgPlaceholder
              className="flex-1 min-h-0 w-full"
              label="Ảnh sản phẩm 3"
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          TRUST STATS — 4 con số
      ═══════════════════════════════════════════ */}
      <section style={{ background: trustBg || "#111" }}>
        {(() => {
          const filtered = trustStats.filter((s) => s.num);
          const count = filtered.length;
          return (
            <>
              <div className="md:hidden py-2">
                <div className="grid grid-cols-2">
                  {filtered.map((s, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center text-center"
                      style={{
                        padding: "16px 12px",
                        borderRight:
                          i % 2 === 0
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "none",
                        borderBottom:
                          i < filtered.length - (filtered.length % 2 === 0 ? 2 : 1)
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "none",
                      }}
                    >
                      <span
                        className="font-black text-white block mb-1"
                        style={{
                          fontSize: "clamp(1.15rem, 3.8vw, 1.7rem)",
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                        }}
                      >
                        {s.num}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          color: "rgba(255,255,255,0.58)",
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                          lineHeight: 1.35,
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="hidden md:grid max-w-7xl mx-auto px-10"
                style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
              >
                {filtered.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center py-10 text-center"
                    style={{
                      borderRight:
                        i < count - 1
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "none",
                    }}
                  >
                    <span
                      className="font-black text-white block mb-1.5"
                      style={{
                        fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                      }}
                    >
                      {s.num}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.5)",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORY SHOWCASE — 4 dòng sản phẩm
      ═══════════════════════════════════════════ */}
      {sectionsConfig.showcase && (
        <section className="bg-white py-6 md:py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 md:mb-10">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                  <span className="w-5 h-px bg-stone-300" />
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                    {showcaseLabel}
                  </p>
                </div>
                <h2
                  className="text-h2"
                  style={{ letterSpacing: "-0.028em", color: "#111" }}
                >
                  {showcaseHeading}
                </h2>
                <p className="text-[#666] text-body-sm mt-2 max-w-lg">
                  {showcaseDesc}
                </p>
              </div>
              <Link
                href={showcaseCtaUrl}
                className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-bold rounded-full px-3.5 py-2 shrink-0 transition-all"
                style={{
                  color: "#111",
                  border: "1px solid #d4d4d4",
                  background: "#f9f9f9",
                }}
              >
                {showcaseCtaText}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </Link>
            </div>

            {/* 4 card danh mục */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {homeShowcase.slice(0, 4).map(({ href, label, sub }) => (
                <Link
                  key={href + label}
                  href={href}
                  className="group relative block overflow-hidden"
                  style={{ borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                >
                  <ImgPlaceholder
                    className="w-full"
                    aspectRatio="4/5"
                    label={label}
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-4"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
                    }}
                  >
                    <p className="text-white font-bold text-[14px] sm:text-[17px] mb-1">
                      {label}
                    </p>
                    <p className="text-white/60 text-[11px] leading-snug hidden sm:block">
                      {sub}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold group-hover:gap-2 transition-all text-white/80 mt-1">
                      Xem ngay →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6 md:hidden">
              <Link
                href={showcaseCtaUrl}
                className="inline-flex items-center gap-1.5 border text-[12px] font-bold px-4 py-2 rounded-full transition-colors"
                style={{
                  color: "#111",
                  borderColor: "#ccc",
                  background: "#f9f9f9",
                }}
              >
                {showcaseCtaText}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          BESTSELLERS — Sản phẩm nổi bật
      ═══════════════════════════════════════════ */}
      {sectionsConfig.bestsellers && (() => {
        const EXCLUDE_CATS = ["phu-kien-den"];
        const isExcluded = (p: (typeof products)[0]) =>
          EXCLUDE_CATS.some((c) => p.tags.includes(c)) || p.image === "";
        const autoDisplay = products.filter((p) => !isExcluded(p));

        return (
          <HomeBestsellersSection
            products={autoDisplay.slice(0, 30)}
            label={bestsellersLabel}
            heading={bestsellersHeading}
            ctaText={bestsellersCtaText}
            ctaUrl={bestsellersCtaUrl}
          />
        );
      })()}

      {/* ═══════════════════════════════════════════
          KHÔNG GIAN ỨNG DỤNG — 4 loại không gian
      ═══════════════════════════════════════════ */}
      {sectionsConfig.spaces && (
        <section
          style={{ background: "#FAFAFA", borderTop: "1px solid #e5e5e5" }}
          className="py-6 md:py-12"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 md:mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-5 h-px bg-stone-300" />
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                    {spacesLabel}
                  </p>
                </div>
                <h2
                  className="text-h2"
                  style={{ letterSpacing: "-0.03em", color: "#111" }}
                >
                  {spacesHeading}
                </h2>
                <p className="text-[#666] text-body-sm mt-1.5 max-w-lg">
                  {spacesDesc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {spaces.map(({ label, desc, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="group relative block overflow-hidden rounded-2xl transition-all duration-300 hover:ring-2 hover:ring-stone-400"
                >
                  <ImgPlaceholder
                    className="w-full"
                    aspectRatio="4/3"
                    label={label}
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-4"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                    }}
                  >
                    <p className="text-white font-bold text-sm mb-0.5">
                      {label}
                    </p>
                    <p className="text-white text-[11px] font-semibold leading-snug hidden sm:block opacity-70">
                      {desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Công trình thực tế */}
            <CongTrinhSection
              label={settings.home_congtrinh_label || undefined}
              heading={settings.home_congtrinh_heading || undefined}
              desc={settings.home_congtrinh_desc || SETTINGS_DEFAULTS.home_congtrinh_desc}
              stat1Num={settings.home_congtrinh_stat1_num || undefined}
              stat1Label={settings.home_congtrinh_stat1_label || undefined}
              stat2Num={settings.home_congtrinh_stat2_num || undefined}
              stat2Label={settings.home_congtrinh_stat2_label || undefined}
              ctaText={settings.home_congtrinh_cta_text || undefined}
              ctaPhone={settings.home_congtrinh_cta_phone || undefined}
              projects={congTrinhProjects.length ? congTrinhProjects : undefined}
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          ARTISAN / XƯỞNG KAHA — câu chuyện xưởng
      ═══════════════════════════════════════════ */}
      {sectionsConfig.artisan && (
        <section
          className="relative py-8 md:py-14 overflow-hidden"
          style={{ background: "#F5F5F5" }}
        >
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">
            <div className="flex items-center gap-2.5 mb-3 justify-center">
              <span className="w-5 h-px bg-stone-400" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                {artisanLabel}
              </p>
              <span className="w-5 h-px bg-stone-400" />
            </div>

            <h2
              className="text-h2 mb-4"
              style={{ letterSpacing: "-0.025em", color: "#111" }}
            >
              {artisanHeading.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>

            <p
              className="text-[15px] leading-[1.8] mb-6 mx-auto"
              style={{ color: "#666", maxWidth: "60ch" }}
            >
              {artisanBody}
            </p>

            {/* 3 Stats */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mb-6">
              {artisanStats
                .filter((s) => s.num)
                .map((s, i) => (
                  <div key={i} className="text-center">
                    <span
                      className="block font-black"
                      style={{
                        fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                        color: "#111",
                      }}
                    >
                      {s.num}
                    </span>
                    <span
                      className="block text-[11px] mt-1.5 whitespace-pre-line"
                      style={{
                        color: "#888",
                        fontWeight: 500,
                        letterSpacing: "0.03em",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
            </div>

            {/* Values */}
            {homeArtisanValues.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {homeArtisanValues.map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl text-center"
                    style={{
                      background: "rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <span className="text-stone-500">
                      {ARTISAN_ICONS[icon] ?? null}
                    </span>
                    <span
                      className="font-semibold text-sm"
                      style={{ color: "#1a1a1a" }}
                    >
                      {title}
                    </span>
                    <span
                      className="text-[12px] leading-[1.6]"
                      style={{ color: "#666" }}
                    >
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Link
              href={artisanCtaUrl}
              className={CTA_SECONDARY_CLASS}
              style={CTA_SECONDARY_STYLE}
            >
              {artisanCtaText}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 6h8M6 2l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          BLOG / JOURNAL
      ═══════════════════════════════════════════ */}
      {sectionsConfig.blog && latestPosts.length > 0 && (
        <section className="bg-white py-8 md:py-14">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8 md:mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-px bg-stone-300" />
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                    {blogLabel}
                  </p>
                </div>
                <h2
                  className="text-h2"
                  style={{ letterSpacing: "-0.028em", color: "#111" }}
                >
                  {blogHeading}
                </h2>
              </div>
              <Link
                href={blogCtaUrl}
                className={CTA_SECONDARY_CLASS}
                style={CTA_SECONDARY_STYLE}
              >
                {blogCtaText}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M2 6h8M6 2l4 4-4 4" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {latestPosts.map((post) => {
                const readMin = Math.max(
                  3,
                  Math.ceil((post.content || "").split(" ").length / 200)
                );
                const cat = post.categories?.[0] || "Journal";
                const dateStr = (() => {
                  try {
                    return new Date(post.date).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  } catch {
                    return post.date;
                  }
                })();
                return (
                  <Link
                    key={post.slug}
                    href={`/journal/${post.slug}`}
                    className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e5e5",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: "16/9", background: "#f0f0f0" }}
                    >
                      <ImgPlaceholder className="w-full h-full" label={cat} />
                    </div>
                    <div className="p-5">
                      <h3
                        className="text-[15px] font-bold leading-snug mb-3 transition-colors duration-200 group-hover:text-stone-600"
                        style={{
                          color: "#1a1a1a",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          letterSpacing: "-0.015em",
                        }}
                      >
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p
                          className="text-[13px] leading-[1.7] mb-4"
                          style={{
                            color: "#888",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.excerpt}
                        </p>
                      )}
                      <div
                        className="flex items-center gap-2 text-[11.5px]"
                        style={{ color: "#aaa" }}
                      >
                        <span>{dateStr}</span>
                        <span
                          className="w-1 h-1 rounded-full"
                          style={{ background: "#ddd" }}
                        />
                        <span>{readMin} phút đọc</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Newsletter card */}
            <div
              className="mt-7 md:mt-8 rounded-2xl px-5 md:px-7 py-7 md:py-8 text-center"
              style={{ background: "#111111" }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2.5"
                style={{ color: "#aaa" }}
              >
                {newsletterLabel}
              </p>
              <h2
                className="text-[1.6rem] md:text-h2 leading-[1.2] mb-2 text-white"
                style={{ letterSpacing: "-0.028em" }}
              >
                {newsletterHeading}
              </h2>
              <p className="text-white/60 text-[13px] mb-5 md:mb-6 max-w-md mx-auto leading-[1.65]">
                {newsletterDesc}
              </p>
              <NewsletterForm />
              <p className="text-white/30 text-[11px] mt-3">
                {newsletterFootnote}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          B2B FULL — Đặt hàng sỉ
      ═══════════════════════════════════════════ */}
      {sectionsConfig.b2b && (
        <section style={{ background: "#FAFAFA" }} className="py-8 md:py-14">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left — content */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-px bg-stone-300" />
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
                    {b2bFullLabel}
                  </p>
                </div>
                <h2
                  className="text-h2 mb-4"
                  style={{ letterSpacing: "-0.028em", color: "#111" }}
                >
                  {b2bFullHeading}
                </h2>
                <p
                  className="text-[15px] leading-[1.8] mb-8"
                  style={{ color: "#666", maxWidth: "44ch" }}
                >
                  {b2bFullDesc}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {b2bFullFeatures.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(0,0,0,0.06)",
                          color: "#111",
                        }}
                      >
                        {B2B_FEATURE_ICONS[f.icon] ?? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p
                          className="text-[13px] font-bold mb-0.5"
                          style={{ color: "#1a1a1a" }}
                        >
                          {f.title}
                        </p>
                        <p
                          className="text-[12px] leading-[1.65]"
                          style={{ color: "#888" }}
                        >
                          {f.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href={b2bFullCtaUrl}
                  className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{
                    background: "#111111",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.18)",
                  }}
                >
                  {b2bFullCta}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M2 6h8M6 2l4 4-4 4" />
                  </svg>
                </Link>

                {/* Store info */}
                <div
                  className="mt-6 pt-6 flex flex-col gap-2"
                  style={{ borderTop: "1px solid #e5e5e5" }}
                >
                  <div className="flex items-start gap-2">
                    <svg
                      className="shrink-0 mt-0.5"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span
                      className="text-[12px] leading-[1.6]"
                      style={{ color: "#666" }}
                    >
                      {b2bStore.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="shrink-0"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span
                      className="text-[12px]"
                      style={{ color: "#666" }}
                    >
                      {b2bStore.hours}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <a
                      href={b2bStore.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-colors border hover:bg-stone-100"
                      style={{ color: "#111", borderColor: "#ddd" }}
                    >
                      Bản đồ
                    </a>
                    <a
                      href={`tel:${b2bStore.phone}`}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-colors border hover:bg-stone-100"
                      style={{ color: "#111", borderColor: "#ddd" }}
                    >
                      {b2bStore.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Right — placeholder */}
              <ImgPlaceholder
                className="w-full rounded-3xl"
                aspectRatio="4/3"
                label="Ảnh xưởng / sản phẩm"
              />
            </div>
          </div>

          {/* Delivery */}
          <div className="max-w-7xl mx-auto px-6 md:px-10 mt-6 md:mt-8">
            <div style={{ borderTop: "1px solid #e5e5e5" }} />
          </div>
          <DeliverySection />
        </section>
      )}
    </>
  );
}
