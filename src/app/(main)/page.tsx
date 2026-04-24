import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import NewsletterForm from '@/components/NewsletterForm';
import ProductCard from '@/components/ProductCard';
import { parseJSON, SETTINGS_DEFAULTS } from '@/lib/site-settings';
import { getSettings } from '@/lib/site-settings-server';
import type { ValueItem, ReviewItem, ShopByGroup, FaqItem, CategoryShowcaseItem, ArtisanValueItem, AdvisorQuestion, B2bFullFeature, BundleItem, UseCaseCard } from '@/lib/site-settings';
import { getCatalogProducts } from '@/lib/products-db';
import HomeAdvisor from '@/components/HomeAdvisor';
import DeliverySection from '@/components/DeliverySection';
import LogoMarquee from '@/components/LogoMarquee';
import { getPostBySlug } from '@/lib/getPosts';
import FallbackImage from '@/components/FallbackImage';

const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'));
const HomeBestsellersSection = dynamic(() => import('@/components/HomeBestsellersSection'));
const CongTrinhSection = dynamic(() => import('@/components/CongTrinhSection'));

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_home_title || SETTINGS_DEFAULTS.seo_home_title;
  const description = settings.seo_home_desc || SETTINGS_DEFAULTS.seo_home_desc;
  const ogImage = settings.seo_home_og_image || SETTINGS_DEFAULTS.seo_home_og_image;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: 'https://longdenviet.com' },
    openGraph: { title, description, url: 'https://longdenviet.com', siteName: 'LongDenViet', locale: 'vi_VN', type: 'website', images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default async function HomePage() {
  const [settings, products] = await Promise.all([
    getSettings(),
    getCatalogProducts(),
  ]);

  const sectionsConfig = {
    hero:        true,
    marquee:     true,
    showcase:    true,
    bestsellers: true,
    reviews:     true,
    spaces:      true,
    artisan:     true,
    b2b:         true,
    blog:        true,
    ...JSON.parse(settings.home_sections_config || '{}'),
  };

  const hero = {
    subtitle: settings.hero_subtitle,
    title: settings.hero_title,
    desc: settings.hero_desc,
    ctaText: settings.hero_cta_text,
    ctaUrl: settings.hero_cta_url,
    img1: settings.hero_img_1 || SETTINGS_DEFAULTS.hero_img_1,
    img2: settings.hero_img_2 || SETTINGS_DEFAULTS.hero_img_2,
    img3: settings.hero_img_3 || SETTINGS_DEFAULTS.hero_img_3,
    url1: settings.hero_url_1 || SETTINGS_DEFAULTS.hero_url_1,
    url2: settings.hero_url_2 || SETTINGS_DEFAULTS.hero_url_2,
    url3: settings.hero_url_3 || SETTINGS_DEFAULTS.hero_url_3,
  };

  // Không preload thủ công ở homepage để tránh warning "preloaded but not used".

  const editorial = {
    label: settings.editorial_label || SETTINGS_DEFAULTS.editorial_label,
    title: settings.editorial_title || SETTINGS_DEFAULTS.editorial_title,
    desc: settings.editorial_desc || SETTINGS_DEFAULTS.editorial_desc,
    cta: settings.editorial_cta || SETTINGS_DEFAULTS.editorial_cta,
    ctaUrl: settings.editorial_cta_url || SETTINGS_DEFAULTS.editorial_cta_url,
    img1: settings.editorial_img_1 || SETTINGS_DEFAULTS.editorial_img_1,
    img2: settings.editorial_img_2 || SETTINGS_DEFAULTS.editorial_img_2,
    img3: settings.editorial_img_3 || SETTINGS_DEFAULTS.editorial_img_3,
  };

  const defaultValues = parseJSON<ValueItem[]>(SETTINGS_DEFAULTS.home_values, []);
  const homeValues = (() => { const v = parseJSON<ValueItem[]>(settings.home_values, defaultValues); return v.length ? v : defaultValues; })();

  const defaultReviews = parseJSON<ReviewItem[]>(SETTINGS_DEFAULTS.home_reviews, []);
  const homeReviews = (() => { const v = parseJSON<ReviewItem[]>(settings.home_reviews, defaultReviews); return v.length ? v : defaultReviews; })();

  const defaultShopby = parseJSON<ShopByGroup[]>(SETTINGS_DEFAULTS.home_shopby, []);
  const homeShopby = (() => { const v = parseJSON<ShopByGroup[]>(settings.home_shopby, defaultShopby); return v.length ? v : defaultShopby; })();

  const defaultTags = parseJSON<[string, string][]>(SETTINGS_DEFAULTS.home_tags, []);
  const homeTags = (() => { const v = parseJSON<[string, string][]>(settings.home_tags, defaultTags); return v.length ? v : defaultTags; })();

  const b2b1 = {
    title: settings.home_b2b_1_title || SETTINGS_DEFAULTS.home_b2b_1_title,
    desc: settings.home_b2b_1_desc || SETTINGS_DEFAULTS.home_b2b_1_desc,
    cta: settings.home_b2b_1_cta || SETTINGS_DEFAULTS.home_b2b_1_cta,
    url: settings.home_b2b_1_url || SETTINGS_DEFAULTS.home_b2b_1_url,
    img: settings.home_b2b_1_img || '',
    imgAlt: settings.home_b2b_1_img_alt || SETTINGS_DEFAULTS.home_b2b_1_img_alt,
    bg: settings.home_b2b_1_bg || SETTINGS_DEFAULTS.home_b2b_1_bg,
  };
  const b2b2 = {
    title: settings.home_b2b_2_title || SETTINGS_DEFAULTS.home_b2b_2_title,
    desc: settings.home_b2b_2_desc || SETTINGS_DEFAULTS.home_b2b_2_desc,
    cta: settings.home_b2b_2_cta || SETTINGS_DEFAULTS.home_b2b_2_cta,
    url: settings.home_b2b_2_url || SETTINGS_DEFAULTS.home_b2b_2_url,
    img: settings.home_b2b_2_img || '',
    imgAlt: settings.home_b2b_2_img_alt || SETTINGS_DEFAULTS.home_b2b_2_img_alt,
    bg: settings.home_b2b_2_bg || SETTINGS_DEFAULTS.home_b2b_2_bg,
  };
  const makerTitle = settings.home_maker_title || SETTINGS_DEFAULTS.home_maker_title;
  const makerDesc = settings.home_maker_desc || SETTINGS_DEFAULTS.home_maker_desc;

  const _defShowcase = parseJSON<CategoryShowcaseItem[]>(SETTINGS_DEFAULTS.home_showcase, []);
  const homeShowcase = (() => { const v = parseJSON<CategoryShowcaseItem[]>(settings.home_showcase, _defShowcase); return v.length ? v : _defShowcase; })();
  const _defArtisanVals = parseJSON<ArtisanValueItem[]>(SETTINGS_DEFAULTS.home_artisan_values, []);
  const homeArtisanValues = (() => { const v = parseJSON<ArtisanValueItem[]>(settings.home_artisan_values, _defArtisanVals); return v.length ? v : _defArtisanVals; })();

  // Artisan Story section
  const artisanHeading = settings.home_artisan_heading || SETTINGS_DEFAULTS.home_artisan_heading;
  const artisanBody = settings.home_artisan_body || SETTINGS_DEFAULTS.home_artisan_body;
  const artisanImg = settings.home_artisan_img || SETTINGS_DEFAULTS.home_artisan_img;
  const artisanBodySeo = `${artisanBody} Chúng tôi phát triển đèn vải thủ công, chụp đèn vải cao cấp và lồng đèn Hội An cho không gian quán cafe, nhà hàng, homestay theo từng phong cách ánh sáng.`;

  const showcaseLabel = settings.home_showcase_label || SETTINGS_DEFAULTS.home_showcase_label;
  const showcaseHeading = settings.home_showcase_heading || SETTINGS_DEFAULTS.home_showcase_heading;
  const showcaseDesc = settings.home_showcase_desc || SETTINGS_DEFAULTS.home_showcase_desc;
  const bestsellersLabel = settings.home_bestsellers_label || SETTINGS_DEFAULTS.home_bestsellers_label;
  const bestsellersHeading = settings.home_bestsellers_heading || SETTINGS_DEFAULTS.home_bestsellers_heading;
  const spacesLabel = settings.home_spaces_label || SETTINGS_DEFAULTS.home_spaces_label;
  const spacesHeading = settings.home_spaces_heading || SETTINGS_DEFAULTS.home_spaces_heading;
  const spacesDesc = settings.home_spaces_desc || SETTINGS_DEFAULTS.home_spaces_desc;
  const b2bLabel = settings.home_b2b_label || SETTINGS_DEFAULTS.home_b2b_label;
  const b2bHeading = settings.home_b2b_heading || SETTINGS_DEFAULTS.home_b2b_heading;
  const b2b1Label = settings.home_b2b_1_label || SETTINGS_DEFAULTS.home_b2b_1_label;
  const b2b2Label = settings.home_b2b_2_label || SETTINGS_DEFAULTS.home_b2b_2_label;
  const artisanLabel = settings.home_artisan_label || SETTINGS_DEFAULTS.home_artisan_label;
  const artisanCtaText = settings.home_artisan_cta_text || SETTINGS_DEFAULTS.home_artisan_cta_text;
  const artisanCtaUrl = settings.home_artisan_cta_url || SETTINGS_DEFAULTS.home_artisan_cta_url;

  const artisanStats = [
    { num: settings.home_artisan_stat1_num || SETTINGS_DEFAULTS.home_artisan_stat1_num, label: settings.home_artisan_stat1_label || SETTINGS_DEFAULTS.home_artisan_stat1_label },
    { num: settings.home_artisan_stat2_num || SETTINGS_DEFAULTS.home_artisan_stat2_num, label: settings.home_artisan_stat2_label || SETTINGS_DEFAULTS.home_artisan_stat2_label },
    { num: settings.home_artisan_stat3_num || SETTINGS_DEFAULTS.home_artisan_stat3_num, label: settings.home_artisan_stat3_label || SETTINGS_DEFAULTS.home_artisan_stat3_label },
  ];

  // B2B Visit Store card
  const b2bStore = {
    label:    settings.home_b2b_store_label    || SETTINGS_DEFAULTS.home_b2b_store_label,
    title:    settings.home_b2b_store_title    || SETTINGS_DEFAULTS.home_b2b_store_title,
    address:  settings.home_b2b_store_address  || SETTINGS_DEFAULTS.home_b2b_store_address,
    hours:    settings.home_b2b_store_hours    || SETTINGS_DEFAULTS.home_b2b_store_hours,
    display:  settings.home_b2b_store_display  || SETTINGS_DEFAULTS.home_b2b_store_display,
    mapsUrl:  settings.home_b2b_store_maps_url || SETTINGS_DEFAULTS.home_b2b_store_maps_url,
    phone:    settings.home_b2b_store_phone    || SETTINGS_DEFAULTS.home_b2b_store_phone,
    bg:       settings.home_b2b_store_bg       || SETTINGS_DEFAULTS.home_b2b_store_bg,
  };

  // Reviews section
  const reviewsRating = settings.home_reviews_rating || SETTINGS_DEFAULTS.home_reviews_rating;
  const reviewsCount  = settings.home_reviews_count  || SETTINGS_DEFAULTS.home_reviews_count;

  const trustStats = [
    { num: settings.home_trust_s1_num || SETTINGS_DEFAULTS.home_trust_s1_num, label: settings.home_trust_s1_label || SETTINGS_DEFAULTS.home_trust_s1_label },
    { num: settings.home_trust_s2_num || SETTINGS_DEFAULTS.home_trust_s2_num, label: settings.home_trust_s2_label || SETTINGS_DEFAULTS.home_trust_s2_label },
    { num: settings.home_trust_s3_num || SETTINGS_DEFAULTS.home_trust_s3_num, label: settings.home_trust_s3_label || SETTINGS_DEFAULTS.home_trust_s3_label },
    { num: settings.home_trust_s4_num || SETTINGS_DEFAULTS.home_trust_s4_num, label: settings.home_trust_s4_label || SETTINGS_DEFAULTS.home_trust_s4_label },
    { num: settings.home_trust_s5_num || SETTINGS_DEFAULTS.home_trust_s5_num, label: settings.home_trust_s5_label || SETTINGS_DEFAULTS.home_trust_s5_label },
  ];
  const spaces = [
    { img: settings.home_space_img_1 || SETTINGS_DEFAULTS.home_space_img_1, label: settings.home_space_label_1 || SETTINGS_DEFAULTS.home_space_label_1, desc: settings.home_space_desc_1 || SETTINGS_DEFAULTS.home_space_desc_1, href: settings.home_space_href_1 || SETTINGS_DEFAULTS.home_space_href_1 },
    { img: settings.home_space_img_2 || SETTINGS_DEFAULTS.home_space_img_2, label: settings.home_space_label_2 || SETTINGS_DEFAULTS.home_space_label_2, desc: settings.home_space_desc_2 || SETTINGS_DEFAULTS.home_space_desc_2, href: settings.home_space_href_2 || SETTINGS_DEFAULTS.home_space_href_2 },
    { img: settings.home_space_img_3 || SETTINGS_DEFAULTS.home_space_img_3, label: settings.home_space_label_3 || SETTINGS_DEFAULTS.home_space_label_3, desc: settings.home_space_desc_3 || SETTINGS_DEFAULTS.home_space_desc_3, href: settings.home_space_href_3 || SETTINGS_DEFAULTS.home_space_href_3 },
    { img: settings.home_space_img_4 || SETTINGS_DEFAULTS.home_space_img_4, label: settings.home_space_label_4 || SETTINGS_DEFAULTS.home_space_label_4, desc: settings.home_space_desc_4 || SETTINGS_DEFAULTS.home_space_desc_4, href: settings.home_space_href_4 || SETTINGS_DEFAULTS.home_space_href_4 },
  ];
  const reviewsLabel = settings.home_reviews_label || SETTINGS_DEFAULTS.home_reviews_label;
  const reviewsHeading = settings.home_reviews_heading || SETTINGS_DEFAULTS.home_reviews_heading;
  const reviewsCtaText = settings.home_reviews_cta_text || SETTINGS_DEFAULTS.home_reviews_cta_text;
  const reviewsCtaUrl = settings.home_reviews_cta_url || SETTINGS_DEFAULTS.home_reviews_cta_url;
  const showcaseCtaText = settings.home_showcase_cta_text || SETTINGS_DEFAULTS.home_showcase_cta_text;
  const showcaseCtaUrl = settings.home_showcase_cta_url || SETTINGS_DEFAULTS.home_showcase_cta_url;
  const bestsellersCtaText = settings.home_bestsellers_cta_text || SETTINGS_DEFAULTS.home_bestsellers_cta_text;
  const bestsellersCtaUrl = settings.home_bestsellers_cta_url || SETTINGS_DEFAULTS.home_bestsellers_cta_url;
  const artisanStatsLabel = settings.home_artisan_stats_label || SETTINGS_DEFAULTS.home_artisan_stats_label;
  const b2bBadgeCity = settings.home_b2b_badge_city || SETTINGS_DEFAULTS.home_b2b_badge_city;
  const b2bBadgeCount = settings.home_b2b_badge_count || SETTINGS_DEFAULTS.home_b2b_badge_count;
  const b2bBadgeShip = settings.home_b2b_badge_ship || SETTINGS_DEFAULTS.home_b2b_badge_ship;

  const trustBg = settings.home_trust_bg || SETTINGS_DEFAULTS.home_trust_bg;

  // Logo Marquee
  const marqueeLabel  = settings.home_marquee_label || SETTINGS_DEFAULTS.home_marquee_label;
  const marqueeBrands = parseJSON<string[]>(settings.home_marquee_brands || SETTINGS_DEFAULTS.home_marquee_brands, []);

  // Công trình thực tế
  const congTrinhProjects = parseJSON<import('@/lib/site-settings').CongTrinhProject[]>(
    settings.home_congtrinh_projects || SETTINGS_DEFAULTS.home_congtrinh_projects, []
  );

  const artisanLeftBg = settings.home_artisan_left_bg || SETTINGS_DEFAULTS.home_artisan_left_bg;
  const artisanRightBg = settings.home_artisan_right_bg || SETTINGS_DEFAULTS.home_artisan_right_bg;

  const intlPhotos = [
    { img: settings.home_intl_img_1 || SETTINGS_DEFAULTS.home_intl_img_1, cap: settings.home_intl_cap_1 || SETTINGS_DEFAULTS.home_intl_cap_1 },
    { img: settings.home_intl_img_2 || SETTINGS_DEFAULTS.home_intl_img_2, cap: settings.home_intl_cap_2 || SETTINGS_DEFAULTS.home_intl_cap_2 },
    { img: settings.home_intl_img_3 || SETTINGS_DEFAULTS.home_intl_img_3, cap: settings.home_intl_cap_3 || SETTINGS_DEFAULTS.home_intl_cap_3 },
    { img: settings.home_intl_img_4 || SETTINGS_DEFAULTS.home_intl_img_4, cap: settings.home_intl_cap_4 || SETTINGS_DEFAULTS.home_intl_cap_4 },
  ];

  // Nhà thiết kế ảo
  const advisorLabel    = settings.home_advisor_label    || SETTINGS_DEFAULTS.home_advisor_label;
  const advisorHeading  = settings.home_advisor_heading  || SETTINGS_DEFAULTS.home_advisor_heading;
  const advisorDesc     = settings.home_advisor_desc     || SETTINGS_DEFAULTS.home_advisor_desc;
  const _defAdvisorQs   = parseJSON<AdvisorQuestion[]>(SETTINGS_DEFAULTS.home_advisor_questions, []);
  const advisorQuestions = (() => { const v = parseJSON<AdvisorQuestion[]>(settings.home_advisor_questions, _defAdvisorQs); return v.length ? v : _defAdvisorQs; })();

  // Blog nổi bật — lấy 3 bài mới nhất
  const blogLabel   = settings.home_blog_label    || SETTINGS_DEFAULTS.home_blog_label;
  const blogHeading = settings.home_blog_heading   || SETTINGS_DEFAULTS.home_blog_heading;
  const blogCtaText = settings.home_blog_cta_text  || SETTINGS_DEFAULTS.home_blog_cta_text;
  const blogCtaUrl  = settings.home_blog_cta_url   || SETTINGS_DEFAULTS.home_blog_cta_url;
  type PostItem = { title: string; slug: string; date: string; content: string; excerpt: string; categories: string[]; thumbnail: string | null };
  const featuredBlogSlugs = [
    settings.home_blog_slug_1 || SETTINGS_DEFAULTS.home_blog_slug_1,
    settings.home_blog_slug_2 || SETTINGS_DEFAULTS.home_blog_slug_2,
    settings.home_blog_slug_3 || SETTINGS_DEFAULTS.home_blog_slug_3,
    settings.home_blog_slug_4 || '',
    settings.home_blog_slug_5 || '',
    settings.home_blog_slug_6 || '',
  ].filter(Boolean);
  const latestPosts = (await Promise.all(featuredBlogSlugs.map(slug => getPostBySlug(slug))))
    .filter((p): p is NonNullable<Awaited<ReturnType<typeof getPostBySlug>>> => !!p) as PostItem[];
  const BLOG_THUMB_OVERRIDES: Record<string, string> = {
    'den-long-trang-tri-quan-cafe-y-tuong-dep': '/images/homepage/den-long-trang-tri-quan-cafe-y-tuong-dep-homepage-longdenviet.webp',
  };
  const getHomepageThumb = (post: PostItem) => {
    if (BLOG_THUMB_OVERRIDES[post.slug]) return BLOG_THUMB_OVERRIDES[post.slug];
    if (post.slug.includes('den-long-trang-tri-quan-cafe')) {
      return '/images/homepage/den-long-trang-tri-quan-cafe-y-tuong-dep-homepage-longdenviet.webp';
    }
    return post.thumbnail;
  };

  // B2B Full Section
  const b2bFullLabel    = settings.home_b2b_full_label    || SETTINGS_DEFAULTS.home_b2b_full_label;
  const b2bFullHeading  = settings.home_b2b_full_heading  || SETTINGS_DEFAULTS.home_b2b_full_heading;
  const b2bFullDesc     = settings.home_b2b_full_desc     || SETTINGS_DEFAULTS.home_b2b_full_desc;
  const b2bFullDescSeo  = `${b2bFullDesc} Nhận gia công chụp đèn vải theo yêu cầu, đèn vải thả trần, đèn lồng trang trí quán cafe và đèn lồng nhà hàng với giải pháp thi công đồng bộ.`;
  const b2bFullImg      = settings.home_b2b_full_img      || SETTINGS_DEFAULTS.home_b2b_full_img;
  const b2bFullImgAlt   = settings.home_b2b_full_img_alt  || SETTINGS_DEFAULTS.home_b2b_full_img_alt;
  const b2bFullCta      = settings.home_b2b_full_cta      || SETTINGS_DEFAULTS.home_b2b_full_cta;
  const b2bFullCtaUrl   = settings.home_b2b_full_cta_url  || SETTINGS_DEFAULTS.home_b2b_full_cta_url;
  const _defB2bFeatures = parseJSON<B2bFullFeature[]>(SETTINGS_DEFAULTS.home_b2b_full_features, []);
  const b2bFullFeatures = (() => { const v = parseJSON<B2bFullFeature[]>(settings.home_b2b_full_features, _defB2bFeatures); return v.length ? v : _defB2bFeatures; })();

  // Bundle section
  const _defBundles = parseJSON<BundleItem[]>(SETTINGS_DEFAULTS.home_bundles, []);
  const homeBundles = (() => { const v = parseJSON<BundleItem[]>(settings.home_bundles, _defBundles); return v.length ? v : _defBundles; })();

  // Use Cases section
  const useCasesLabel   = settings.home_use_cases_label   || SETTINGS_DEFAULTS.home_use_cases_label;
  const useCasesHeading = settings.home_use_cases_heading || SETTINGS_DEFAULTS.home_use_cases_heading;
  const useCasesDesc    = settings.home_use_cases_desc    || SETTINGS_DEFAULTS.home_use_cases_desc;
  const useCasesCtaText = settings.home_use_cases_cta_text || SETTINGS_DEFAULTS.home_use_cases_cta_text;
  const useCasesCtaUrl  = settings.home_use_cases_cta_url  || SETTINGS_DEFAULTS.home_use_cases_cta_url;
  const _defUseCases = parseJSON<UseCaseCard[]>(SETTINGS_DEFAULTS.home_use_cases, []);
  const homeUseCases = (() => { const v = parseJSON<UseCaseCard[]>(settings.home_use_cases || '', _defUseCases); return v.length ? v : _defUseCases; })();

  // Newsletter section
  const newsletterLabel    = settings.home_newsletter_label    || SETTINGS_DEFAULTS.home_newsletter_label;
  const newsletterHeading  = settings.home_newsletter_heading  || SETTINGS_DEFAULTS.home_newsletter_heading;
  const newsletterDesc     = settings.home_newsletter_desc     || SETTINGS_DEFAULTS.home_newsletter_desc;
  const newsletterFootnote = settings.home_newsletter_footnote || SETTINGS_DEFAULTS.home_newsletter_footnote;

  // B2B discount badge
  const b2bDiscountPct   = settings.home_b2b_full_discount_pct   || SETTINGS_DEFAULTS.home_b2b_full_discount_pct;
  const b2bDiscountLabel = settings.home_b2b_full_discount_label || SETTINGS_DEFAULTS.home_b2b_full_discount_label;

  const B2B_FEATURE_ICONS: Record<string, React.ReactNode> = {
    discount: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
    custom:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    ship:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    support:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  };

  const BASE = 'https://longdenviet.com';
  const CTA_SECONDARY_CLASS = 'inline-flex items-center gap-1.5 text-[12.5px] font-bold rounded-xl px-4 py-2.5 shrink-0 transition-all';
  const CTA_SECONDARY_STYLE = { color: '#104e2e', border: '1px solid #d8cfbf', background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)' } as const;
  const HOMEPAGE_WEBPAGE_LD = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE}/#webpage-home`,
    url: `${BASE}/`,
    name: settings.seo_home_title || SETTINGS_DEFAULTS.seo_home_title,
    description: settings.seo_home_desc || SETTINGS_DEFAULTS.seo_home_desc,
    inLanguage: 'vi-VN',
    isPartOf: { '@id': `${BASE}/#website` },
    about: [
      { '@type': 'Thing', name: 'đèn vải' },
      { '@type': 'Thing', name: 'đèn lồng Hội An' },
      { '@type': 'Thing', name: 'gia công đèn trang trí' },
    ],
    mainEntity: {
      '@type': 'ItemList',
      name: 'Danh mục đèn vải và đèn lồng nổi bật',
      itemListOrder: 'http://schema.org/ItemListOrderAscending',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Đèn Hội An', url: `${BASE}/c/hoi-an-lantern` },
        { '@type': 'ListItem', position: 2, name: 'Đèn mây tre', url: `${BASE}/c/den-may-tre` },
        { '@type': 'ListItem', position: 3, name: 'Chụp đèn vải', url: `${BASE}/c/chup-den-vai` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Đèn lồng LongDenViet được làm từ chất liệu gì?', acceptedAnswer: { '@type': 'Answer', text: 'LongDenViet chuyên sản xuất đèn lồng thủ công từ tre già tự nhiên, vải lụa, vải organza và mây đan — tất cả chất liệu tự nhiên, không hàng công nghiệp nhập khẩu. Mỗi chiếc đèn được làm bởi nghệ nhân làng nghề Việt Nam có 15–20 năm kinh nghiệm.' } },
          { '@type': 'Question', name: 'Đặt hàng sỉ đèn lồng số lượng lớn có được không?', acceptedAnswer: { '@type': 'Answer', text: 'Có. LongDenViet nhận đơn sỉ từ 20 chiếc trở lên với giá ưu đãi 15–30%, hỗ trợ in logo thương hiệu cho đơn từ 200 chiếc. Phù hợp khách sạn, resort, sự kiện và quà tặng doanh nghiệp. Liên hệ 0989.778.247 để nhận báo giá.' } },
          { '@type': 'Question', name: 'LongDenViet giao hàng đến tỉnh thành nào?', acceptedAnswer: { '@type': 'Answer', text: 'LongDenViet giao hàng toàn quốc 63 tỉnh thành qua GHN và GHTK. Nội thành TP.HCM giao trong ngày, các tỉnh khác 2–5 ngày làm việc. Đóng gói chống sốc, miễn phí vận chuyển đơn từ 500.000đ.' } },
          { '@type': 'Question', name: 'Có thể đặt đèn lồng theo màu sắc và kích thước riêng không?', acceptedAnswer: { '@type': 'Answer', text: 'Có. LongDenViet nhận đặt hàng tùy chỉnh hoàn toàn: màu vải, kích thước từ ø15cm đến ø80cm, hoa văn thêu và in logo. Thời gian sản xuất 7–14 ngày. Số lượng tối thiểu 20 chiếc cho đơn tùy chỉnh.' } },
          { '@type': 'Question', name: 'Đèn lồng thủ công có bền không, bảo hành bao lâu?', acceptedAnswer: { '@type': 'Answer', text: 'Đèn lồng thủ công LongDenViet bền 2–5 năm tùy chất liệu và điều kiện sử dụng. Bảo hành 12 tháng cho lỗi sản xuất. Đổi trả trong 7 ngày nếu hàng không đúng mô tả, LongDenViet chịu phí vận chuyển hoàn hàng.' } },
          { '@type': 'Question', name: 'Showroom LongDenViet ở đâu, có thể ghé xem hàng không?', acceptedAnswer: { '@type': 'Answer', text: 'Showroom và xưởng sản xuất LongDenViet tại: 262/1/93 Phan Anh, Phường Phú Thạnh, Quận Tân Phú, TP.HCM. Mở cửa 8:00–21:00 mỗi ngày kể cả cuối tuần. Liên hệ 0989.778.247 để đặt lịch tư vấn trực tiếp.' } },
        ],
      }).replace(/<\/script>/gi, '<\\/script>') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOMEPAGE_WEBPAGE_LD).replace(/<\/script>/gi, '<\\/script>') }} />

      {/* ═══════════════════════════════════════════
          HERO — text trái 33% + mosaic full-bleed phải
      ═══════════════════════════════════════════ */}
      {sectionsConfig.hero && <section className="bg-white flex flex-col md:flex-row overflow-hidden md:min-h-[500px]">

        {/* Left */}
        <div className="md:w-[38%] shrink-0 flex flex-col justify-center px-6 md:px-12 lg:px-14 py-6 md:py-0">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <span className="block flex-shrink-0" style={{ width: 28, height: 1, background: '#c9822a' }} />
            <p
              className="font-extrabold uppercase text-brand-amber leading-[1.3] max-w-[260px] md:max-w-none"
              style={{ fontSize: 10.5, letterSpacing: '0.2em' }}
            >
              {hero.subtitle}
            </p>
            <span className="block flex-shrink-0" style={{ width: 16, height: 1, background: 'rgba(201,130,42,0.3)' }} />
          </div>

          {/* Headline */}
          <h1 className="mb-5 md:mb-6" style={{ lineHeight: 1.01 }}>
            <span className="block font-extrabold" style={{ fontSize: 'clamp(2.25rem, 4.1vw, 4.1rem)', color: '#113d2b', letterSpacing: '-0.034em' }}>
              Đèn vải
            </span>
            {/* Bridge */}
            <span className="flex items-center gap-3 my-3 md:my-3.5">
              <span style={{ display: 'block', height: 1, width: 26, background: 'rgba(184,116,36,0.42)' }} />
              <span className="font-semibold uppercase" style={{ fontSize: 'clamp(9px, 0.72vw, 10.5px)', letterSpacing: '0.26em', color: '#94795d' }}>được tạo ra bằng</span>
              <span style={{ display: 'block', height: 1, width: 26, background: 'rgba(184,116,36,0.42)' }} />
            </span>
            <span className="block font-black" style={{ fontSize: 'clamp(2.6rem, 4.85vw, 4.9rem)', color: '#b87424', letterSpacing: '-0.033em', lineHeight: 0.95 }}>
              Đôi tay nghệ nhân
            </span>
          </h1>

          {/* Description with left accent */}
          <p className="leading-[1.8] mb-5 md:mb-6" style={{ fontSize: 14.5, maxWidth: '31ch', color: '#635548', paddingLeft: 14, borderLeft: '2px solid #e8d0b0' }}>
            {hero.desc}
          </p>

          {/* CTA */}
          <Link
            href={hero.ctaUrl}
            className="inline-flex items-center gap-2 font-bold rounded-full transition-all hover:-translate-y-0.5 self-start"
            style={{
              fontSize: 11.8,
              letterSpacing: '0.02em',
              padding: '10px 24px',
              color: '#ffffff',
              background: 'linear-gradient(145deg, #1a6b3c, #0f4b2c)',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 6px 16px rgba(16,78,46,0.24)',
            }}
          >
            <span className="md:hidden">Xem bộ sưu tập</span>
            <span className="hidden md:inline">{hero.ctaText}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>

          {/* Link cloud — 8 premium light cards */}
          <div className="mt-4 md:mt-5">
            {(() => {
              const HERO_LINKS = [
                { label: 'Chụp đèn vải', href: '/c/chup-den-vai' },
                { label: 'Đèn lồng gỗ', href: '/c/den-long-go' },
                { label: 'Đèn Nhật Bản', href: '/c/den-kieu-nhat' },
                { label: 'Lồng đèn Trung Thu', href: '/c/den-trung-thu' },
                { label: 'Đèn vải cao cấp', href: '/c/den-vai-cao-cap' },
                { label: 'Đèn lồng Hội An', href: '/c/hoi-an-lantern' },
                { label: 'Đèn thả trần', href: '/c/den-tha-tran' },
                { label: 'Gia công theo yêu cầu', href: '/gia-cong-den-trang-tri' },
              ];
              return (
                <div className="max-w-[430px]">
                  {/* Mobile: 2 columns compact */}
                  <div className="md:hidden grid grid-cols-2 gap-2">
                    {HERO_LINKS.map((item, i) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex items-center gap-1.5 text-[11px] rounded-lg px-2 py-1.5 transition-colors font-medium"
                        style={{
                          color: '#6f6052',
                          background: 'linear-gradient(180deg, rgba(255,253,248,0.95), rgba(250,245,236,0.84))',
                          border: '1px solid rgba(216,207,191,0.65)',
                        }}
                      >
                        <span
                          className="flex-shrink-0"
                          style={{
                            width: 2.5,
                            height: 10,
                            borderRadius: 2,
                            background: i === 0 ? '#c9822a' : '#d4cdc3',
                            display: 'inline-block',
                          }}
                        />
                        {item.label}
                      </Link>
                    ))}
                  </div>

                  {/* Desktop: 2-column premium chip grid */}
                  <div className="hidden md:grid grid-cols-2 gap-2.5">
                    {HERO_LINKS.map((item, i) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex items-center gap-1.5 text-[11px] rounded-lg px-2.5 py-2 transition-all hover:-translate-y-[1px] font-medium"
                        style={{
                          color: '#6f6052',
                          background: 'linear-gradient(180deg, rgba(255,253,248,0.96), rgba(250,245,236,0.86))',
                          border: '1px solid rgba(216,207,191,0.7)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.035)',
                        }}
                      >
                        <span
                          style={{
                            width: 2.5,
                            height: 2.5,
                            borderRadius: '999px',
                            background: i === 0 ? '#c9822a' : '#d0c8c0',
                            display: 'inline-block',
                          }}
                        />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

        {/* Right — flex để tự stretch theo chiều cao cột trái */}
        <div className="flex-1 aspect-[4/3] md:aspect-auto flex gap-1.5 p-2 md:p-1.5 md:pl-3 md:pr-0 md:py-1.5">
          <div className="flex-1 flex flex-col gap-1.5 min-h-0">
            <div className="flex-1 overflow-hidden min-h-0">
              <Link href={hero.url1} className="block w-full h-full">
                <img src={hero.img1} alt="Đèn vải và đèn lồng thủ công Hội An trang trí — LongDenViet" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" fetchPriority="low" loading="lazy" decoding="async" />
              </Link>
            </div>
            <div className="flex-1 overflow-hidden min-h-0">
              <Link href={hero.url2} className="block w-full h-full">
                <img src={hero.img2} alt="Bộ sưu tập đèn vải và đèn lồng tre mây thủ công — LongDenViet" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
              </Link>
            </div>
          </div>
          <div className="flex-1 overflow-hidden min-h-0">
            <Link href={hero.url3} className="block w-full h-full">
              <img src={hero.img3} alt="Đèn vải lụa cao cấp và đèn lồng trang trí nội thất — LongDenViet" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" fetchPriority="high" loading="eager" decoding="async" />
            </Link>
          </div>
        </div>

      </section>}

      {/* Hero already contains full premium internal link cloud */}

      {/* ═══════════════════════════════════════════
          TRUST STATS — 4 con số uy tín
      ═══════════════════════════════════════════ */}
      <section style={{ background: trustBg || '#0a3320' }}>
        {(() => {
          const filtered = trustStats.filter(
            (s) => s.num && !/quốc gia tin dùng/i.test(String(s.label || '')),
          );
          const count = filtered.length;
          const statItem = (s: { num: string; label: string }, i: number, total: number) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center text-center shrink-0"
              style={{
                padding: '20px 20px',
                borderRight: i < total - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                minWidth: 'max(88px, 18vw)',
              }}
            >
              <span className="font-black text-white block mb-1" style={{ fontSize: 'clamp(1.25rem, 4vw, 2.2rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {s.num}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.03em', lineHeight: 1.4, marginTop: 4 }}>
                {s.label}
              </span>
            </div>
          );
          return (
            <>
              {/* Mobile: 2-column grid (no horizontal scroll) */}
              <div className="md:hidden py-2">
                <div className="grid grid-cols-2">
                  {filtered.map((s, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center text-center"
                      style={{
                        padding: '16px 12px',
                        borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        borderBottom: i < filtered.length - (filtered.length % 2 === 0 ? 2 : 1) ? '1px solid rgba(255,255,255,0.08)' : 'none',
                      }}
                    >
                      <span className="font-black text-white block mb-1" style={{ fontSize: 'clamp(1.15rem, 3.8vw, 1.7rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                        {s.num}
                      </span>
                      <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.58)', fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.35 }}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop: equal columns */}
              <div className="hidden md:grid max-w-7xl mx-auto px-10" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
                {filtered.map((s, i) => (
                  <div key={i} className="flex flex-col items-center justify-center py-10 text-center"
                    style={{ borderRight: i < count - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                    <span className="font-black text-white block mb-1.5" style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {s.num}
                    </span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.04em' }}>
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
          LOGO MARQUEE — thương hiệu đã hợp tác
      ═══════════════════════════════════════════ */}
      {sectionsConfig.marquee && (
        <section style={{ background: '#FAF7F2', borderTop: '1px solid #EDE5D8' }} className="pt-7 pb-2">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <LogoMarquee label={marqueeLabel} brands={marqueeBrands} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          CATEGORY SHOWCASE — 4 phong cách đèn
      ═══════════════════════════════════════════ */}
      {sectionsConfig.showcase && <section className="bg-white py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 md:mb-10">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                <span className="w-5 h-px bg-brand-amber" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-amber">{showcaseLabel}</p>
              </div>
              <h2 className="text-h2" style={{ letterSpacing: '-0.028em', color: '#0f2f22' }}>{showcaseHeading}</h2>
              <p className="text-[#666] text-body-sm mt-2 max-w-lg">{showcaseDesc}</p>
            </div>
            <Link
              href={showcaseCtaUrl}
              className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-bold rounded-full px-3.5 py-2 shrink-0 transition-all"
              style={{
                color: '#104e2e',
                border: '1px solid #d8cfbf',
                background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
              }}
            >
              {showcaseCtaText}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
            </Link>
          </div>
          {/* 4 card lớn */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {homeShowcase.slice(0, 4).map(({ href, img, label, sub, tag }) => {
              const slug = href.replace('/c/', '');
              const count = products.filter(p => p.category === slug || p.tags.includes(slug)).length;
              return (
                <Link key={href} href={href}
                  className="group relative rounded-2xl overflow-hidden block aspect-[3/4] md:aspect-[4/5]"
                  style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}
                >
                  <img src={img} alt={`Đèn vải ${label} — danh mục trang trí nội thất`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,15,8,0.88) 0%, rgba(0,0,0,0.06) 55%, transparent 100%)' }} />
                  {tag && (
                    <span className="absolute top-3 left-3 text-[11px] font-black uppercase tracking-[0.08em] px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(135deg,#c9822a,#e8a84a)', color: 'white' }}>{tag}</span>
                  )}
                  {count > 0 && (
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)' }}>
                      {count} mẫu
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                    <p className="text-white font-bold text-[14px] sm:text-[17px] mb-1" style={{ letterSpacing: '-0.02em' }}>{label}</p>
                    <p className="text-white/60 text-[11px] leading-snug mb-3 hidden sm:block">{sub}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold group-hover:gap-2 transition-all" style={{ color: '#e8a84a' }}>Xem ngay →</span>
                  </div>
                  {/* Gold bottom line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: 'linear-gradient(to right,#c9822a,#e8a84a)' }} />
                </Link>
              );
            })}
          </div>

          {/* 6 pill danh mục phụ */}
          {(() => {
            const PILLS = [
              { href: '/c/den-kieu-nhat',  img: '/images/menu/danh-muc-nhat-longdenviet.jpg',      label: 'Đèn Kiểu Nhật' },
              { href: '/c/den-long-go',    img: '/images/menu/danh-muc-go-longdenviet.jpg',        label: 'Đèn Lồng Gỗ' },
              { href: '/c/den-tha-tran',   img: '/images/menu/danh-muc-tha-tran-longdenviet.jpg',  label: 'Đèn Thả Trần' },
              { href: '/c/den-quan-cafe',  img: '/images/menu/danh-muc-cafe-longdenviet.jpg',      label: 'Đèn Quán Cafe' },
              { href: '/c/den-nha-hang',   img: '/images/menu/danh-muc-nha-hang-longdenviet.jpg',  label: 'Đèn Nhà Hàng' },
              { href: '/c/den-vai-cao-cap', img: '/images/menu/danh-muc-vai-longdenviet.jpg',      label: 'Chụp Đèn Vải' },
            ];
            return (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 mt-3 md:mt-4">
                {PILLS.map(({ href, img, label }) => {
                  const slug = href.replace('/c/', '');
                  const count = products.filter(p => p.category === slug || p.tags.includes(slug)).length;
                  return (
                    <Link key={href} href={href}
                      className="group flex items-center gap-2.5 rounded-xl border border-[#e8e0d4] bg-white hover:border-brand-green hover:bg-brand-green-lt transition-all duration-200 px-3 py-2.5"
                    >
                      <img src={img} alt={`Đèn vải ${label} — icon danh mục`} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" loading="lazy" decoding="async" />
                      <div className="min-w-0">
                        <p className="text-[12px] font-700 text-[#1a1a1a] leading-tight truncate" style={{ fontWeight: 700 }}>{label}</p>
                        {count > 0 && <p className="text-[11px] text-[#9a8878]">{count} mẫu</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })()}

          <div className="text-center mt-6 md:hidden">
            <Link
              href={showcaseCtaUrl}
              className="inline-flex items-center gap-1.5 border text-[12px] font-bold px-4 py-2 rounded-full transition-colors"
              style={{
                color: '#104e2e',
                borderColor: 'rgba(16,78,46,0.3)',
                background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
              }}
            >
              {showcaseCtaText}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>}

      {/* ═══════════════════════════════════════════
          BESTSELLERS — Sản phẩm bán chạy
      ═══════════════════════════════════════════ */}
      {sectionsConfig.bestsellers && (() => {
        const EXCLUDE_CATS = ['ngoi-sao-nhua','phu-kien-den','den-trung-thu','phụ kiện'];
        // Chỉ danh mục có ảnh studio chất lượng cao
        const PREMIUM_CATS = ['hoi-an-lantern','den-long-go','den-may-tre','gia-cong-den-trang-tri','den-ban','den-vai-cao-cap','gia-cong-chup-den-vai'];
        const isExcluded = (p: typeof products[0]) =>
          EXCLUDE_CATS.some(c => p.tags.includes(c)) || p.image.includes('kaha') || p.image === '';

        // Admin-pinned product slugs (ưu tiên đầu tiên)
        const pinnedSlugsRaw = settings.home_bestsellers_product_slugs || '';
        const pinnedSlugs = pinnedSlugsRaw.split(/[\n,]+/).map((s: string) => s.trim()).filter(Boolean);
        const pinnedProducts = pinnedSlugs.length > 0
          ? pinnedSlugs.map((slug: string) => products.find(p => p.slug === slug)).filter(Boolean) as typeof products
          : [];

        // Admin-selected categories
        const selectedCats = parseJSON<string[]>(settings.home_bestsellers_categories || '[]', []);

        // TAG_MAP tương tự HomeBestsellersSection
        const CAT_TAG_MAP: Record<string, string[]> = {
          'hoi-an':   ['hoi-an-lantern','den-hoi-an','long-den-hoi-an'],
          'tre-may':  ['den-may-tre','den-tre','den-may'],
          'vai':      ['chup-den-vai','den-vai-cao-cap','long-den-vai-lua','long-den-vai-hoa'],
          'go':       ['den-long-go','long-den-go'],
          'nhat':     ['den-nhat-ban','den-kieu-nhat'],
          'tha-tran': ['den-tha-tran'],
          'trai-tim': ['den-trai-tim'],
          'tron-mau': ['long-den-hinh-tron'],
          'trung-thu':['den-trung-thu'],
          've-tranh': ['den-ve-tranh'],
          'gia-cong': ['gia-cong-den-trang-tri'],
          'phu-kien': ['phu-kien'],
        };

        let catFiltered: typeof products = [];
        if (selectedCats.length > 0) {
          const matchTags = selectedCats.flatMap((k: string) => CAT_TAG_MAP[k] || []);
          catFiltered = products.filter(p =>
            matchTags.some(t => p.tags.includes(t) || p.category === t) && !isExcluded(p)
          );
        }

        // Auto-fallback — chỉ lấy bestseller từ danh mục có ảnh studio
        const featured = products.filter(p =>
          (p.isBestseller || p.badge === 'bestseller') &&
          !isExcluded(p) &&
          PREMIUM_CATS.some(c => p.tags.includes(c) || p.category === c)
        );
        const premiumFallback = products.filter(p => PREMIUM_CATS.some(c => p.tags.includes(c) || p.category === c) && !isExcluded(p));
        const autoDisplay = featured.length >= 5 ? featured : premiumFallback.length >= 5 ? premiumFallback : products.filter(p => !isExcluded(p));

        // Merge: pinned + cat + auto, dedup by slug
        const seen = new Set<string>();
        const allDisplay = [...pinnedProducts, ...(catFiltered.length > 0 ? catFiltered : autoDisplay)]
          .filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; });

        return (
          <HomeBestsellersSection
            products={allDisplay.slice(0, 30)}
            label={bestsellersLabel}
            heading={bestsellersHeading}
            ctaText={bestsellersCtaText}
            ctaUrl={bestsellersCtaUrl}
          />
        );
      })()}

      {/* ═══════════════════════════════════════════
          REVIEWS — Đánh giá khách hàng (đẩy lên sau Bestsellers)
      ═══════════════════════════════════════════ */}
      {sectionsConfig.reviews && homeReviews.length > 0 && (
        <section className="bg-white py-8 md:py-12" style={{ borderTop: '1px solid #EDE5D8' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-px bg-brand-amber" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-amber">{reviewsLabel}</p>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <h2 className="text-h2" style={{ letterSpacing: '-0.028em', color: '#0f2f22' }}>{reviewsHeading}</h2>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-2xl font-black" style={{ letterSpacing: '-0.03em', color: '#0f2f22' }}>{reviewsRating}</span>
                  <div>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#c9822a" stroke="#c9822a" strokeWidth="1.5"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>)}
                    </div>
                    <p className="text-[11px] text-[#999] mt-0.5">{reviewsCount}</p>
                  </div>
                </div>
              </div>
            </div>
            <ReviewsSection reviews={homeReviews} rating={reviewsRating} count={reviewsCount} limit={3} />
            {reviewsCtaUrl && (
              <div className="mt-5 md:mt-6 text-center">
                <Link
                  href={reviewsCtaUrl}
                  className={CTA_SECONDARY_CLASS}
                  style={CTA_SECONDARY_STYLE}
                >
                  {reviewsCtaText || 'Xem tất cả đánh giá'}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          KHÔNG GIAN ỨNG DỤNG — spaces + công trình (gộp)
      ═══════════════════════════════════════════ */}
      {sectionsConfig.spaces && <section style={{ background: '#FAF7F2', borderTop: '1px solid #EDE5D8' }} className="py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-5 h-px" style={{ background: '#c9822a' }} />
                <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: '#c9822a' }}>{spacesLabel}</p>
              </div>
              <h2 className="text-h2" style={{ letterSpacing: '-0.03em', color: '#0f2f22' }}>{spacesHeading}</h2>
              <p className="text-[#666] text-body-sm mt-1.5 max-w-lg">
                {spacesDesc} Từ khóa mở rộng phù hợp cho nhóm này gồm đèn vải trang trí nội thất, đèn lồng quán cafe, chụp đèn vải phòng khách và đèn thả trần nhà hàng.
              </p>
            </div>
          </div>

          {/* Row 1: Space cards — 4 cột desktop, 2 cột mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-0">
            {spaces.filter(s => s.img).map(({ img, label, desc: sub, href }) => (
              <Link
                key={label}
                href={href}
                className="group relative rounded-2xl overflow-hidden block transition-all duration-300 hover:ring-2 hover:ring-brand-amber"
                style={{ aspectRatio: '4/3' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Đèn vải trang trí ${label} — LongDenViet`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.42) 48%, rgba(0,0,0,0.08) 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm mb-0.5" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.55)' }}>{label}</p>
                  <p className="text-white text-[11px] font-semibold leading-snug hidden sm:block" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.52)' }}>{sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Row 2: Công trình thực tế */}
          <CongTrinhSection
            label={settings.home_congtrinh_label || undefined}
            heading={settings.home_congtrinh_heading || undefined}
            desc={`${settings.home_congtrinh_desc || SETTINGS_DEFAULTS.home_congtrinh_desc} Từ khóa khách hàng thường tìm gồm: đèn lồng quán cafe, đèn vải trang trí nhà hàng, đèn thả trần cho homestay, đèn lồng Hội An số lượng lớn.`}
            stat1Num={settings.home_congtrinh_stat1_num || undefined}
            stat1Label={settings.home_congtrinh_stat1_label || undefined}
            stat2Num={settings.home_congtrinh_stat2_num || undefined}
            stat2Label={settings.home_congtrinh_stat2_label || undefined}
            ctaText={settings.home_congtrinh_cta_text || undefined}
            ctaPhone={settings.home_congtrinh_cta_phone || undefined}
            projects={congTrinhProjects.length ? congTrinhProjects : undefined}
          />

        </div>
      </section>}

      {/* ═══════════════════════════════════════════
          ARTISAN STORY — centered 1-col
      ═══════════════════════════════════════════ */}
      {sectionsConfig.artisan && (
        <section className="relative py-8 md:py-14 overflow-hidden" style={{ background: artisanLeftBg || '#F5EDE0' }}>
          {/* Decorative SVG lanterns */}
          <div className="absolute top-8 left-8 opacity-[0.12] pointer-events-none select-none" aria-hidden>
            <svg width="80" height="120" viewBox="0 0 60 86" fill="none">
              <ellipse cx="30" cy="43" rx="22" ry="32" stroke="#c9822a" strokeWidth="2"/>
              <line x1="30" y1="11" x2="30" y2="4" stroke="#c9822a" strokeWidth="2" strokeLinecap="round"/>
              <line x1="30" y1="75" x2="30" y2="82" stroke="#c9822a" strokeWidth="2" strokeLinecap="round"/>
              <ellipse cx="30" cy="43" rx="14" ry="20" stroke="#c9822a" strokeWidth="1.2"/>
            </svg>
          </div>
          <div className="absolute bottom-8 right-8 opacity-[0.10] pointer-events-none select-none" aria-hidden>
            <svg width="60" height="90" viewBox="0 0 60 86" fill="none">
              <ellipse cx="30" cy="43" rx="22" ry="32" stroke="#c9822a" strokeWidth="2"/>
              <line x1="30" y1="11" x2="30" y2="4" stroke="#c9822a" strokeWidth="2" strokeLinecap="round"/>
              <line x1="30" y1="75" x2="30" y2="82" stroke="#c9822a" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">

            {/* Label */}
            <div className="flex items-center gap-2.5 mb-3 justify-center">
              <span className="w-5 h-px bg-brand-amber" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-amber">{artisanLabel}</p>
              <span className="w-5 h-px bg-brand-amber" />
            </div>

            {/* Heading */}
            <h2 className="text-h2 mb-4" style={{ letterSpacing: '-0.025em', color: '#0d2e1a' }}>
              {artisanHeading.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h2>

            {/* Body */}
            <p className="text-[15px] leading-[1.8] mb-6 mx-auto" style={{ color: '#7a6a58', maxWidth: '60ch' }}>
              {artisanBodySeo}
            </p>

            {/* 3 Stats inline */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mb-6">
              {artisanStats.filter(s => s.num).map((s, i) => (
                <div key={i} className="text-center">
                  <span className="block font-black" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.03em', lineHeight: 1, color: '#0d2e1a' }}>
                    {s.num}
                  </span>
                  <span className="block text-[11px] mt-1.5 whitespace-pre-line" style={{ color: '#9a8a7a', fontWeight: 500, letterSpacing: '0.03em' }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Values — 3 cards */}
            {(() => {
              const ARTISAN_ICONS: Record<string, React.ReactNode> = {
                handcraft: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0"/>
                    <path d="M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v2"/>
                    <path d="M10 10.5V6a2 2 0 00-2-2v0a2 2 0 00-2 2v8"/>
                    <path d="M18 8a2 2 0 114 0v6a8 8 0 01-8 8h-2a8 8 0 01-7.4-4.97L3 17a2 2 0 011.4-3.4H9"/>
                  </svg>
                ),
                leaf: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75"/>
                    <path d="M22 2C16 2 10 4 6 8c-2 3-3 6-3 10 4 0 7-1 10-3 4-4 6-10 6-16 0 0 0 0-1 1"/>
                  </svg>
                ),
                truck: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1"/>
                    <path d="M16 8h4l3 3v5h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                ),
              };
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {homeArtisanValues.map(({ icon, title, desc }) => (
                    <div key={title} className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl text-center" style={{ background: 'rgba(201,130,42,0.08)', border: '1px solid rgba(201,130,42,0.15)' }}>
                      <span className="text-brand-amber">{ARTISAN_ICONS[icon] ?? null}</span>
                      <span className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{title}</span>
                      <span className="text-[12px] leading-[1.6]" style={{ color: '#6b5a4a' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* CTA */}
            <Link
              href={artisanCtaUrl}
              className={CTA_SECONDARY_CLASS}
              style={CTA_SECONDARY_STYLE}
            >
              {artisanCtaText}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
            </Link>

          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          BLOG — Bài viết nổi bật
      ═══════════════════════════════════════════ */}
      {sectionsConfig.blog && latestPosts.length > 0 && (
        <section className="bg-white py-8 md:py-14">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8 md:mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-px bg-brand-amber" />
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-amber">{blogLabel}</p>
                </div>
                <h2 className="text-h2" style={{ letterSpacing: '-0.028em', color: '#0f2f22' }}>{blogHeading}</h2>
              </div>
              <Link
                href={blogCtaUrl}
                className={CTA_SECONDARY_CLASS}
                style={CTA_SECONDARY_STYLE}
              >
                {blogCtaText}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
              </Link>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {latestPosts.map((post, idx) => {
                const readMin = Math.max(3, Math.ceil((post.content || '').split(' ').length / 200));
                const cat = post.categories?.[0] || 'Bài viết';
                const dateStr = (() => { try { return new Date(post.date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return post.date; } })();
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ background: '#fff', border: '1px solid #EDE5D8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  >
                    {/* Thumbnail */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #f5efe5, #EDE5D8)' }}>
                      {getHomepageThumb(post) && (
                        <FallbackImage
                          src={getHomepageThumb(post) || ''}
                          alt={`Đèn vải ${post.title}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      )}
                      <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.92)', color: '#104e2e', backdropFilter: 'blur(4px)' }}>
                        {cat}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-[15px] font-bold leading-snug mb-3 transition-colors duration-200 group-hover:text-[#104e2e]"
                        style={{ color: '#1a1a1a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', letterSpacing: '-0.015em' }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-[13px] leading-[1.7] mb-4"
                          style={{ color: '#888', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-[11.5px]" style={{ color: '#aaa' }}>
                        <span>{dateStr}</span>
                        <span className="w-1 h-1 rounded-full" style={{ background: '#ddd' }} />
                        <span>{readMin} phút đọc</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Newsletter — embedded as rounded dark card */}
            <div className="mt-7 md:mt-8 rounded-2xl px-5 md:px-7 py-7 md:py-8 text-center" style={{ background: '#0a3320' }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2.5" style={{ color: '#c9822a' }}>{newsletterLabel}</p>
              <h2 className="text-[1.6rem] md:text-h2 leading-[1.2] mb-2" style={{ letterSpacing: '-0.028em', WebkitTextFillColor: '#FAF7F2', background: 'none' }}>{newsletterHeading}</h2>
              <p className="text-white/60 text-[13px] mb-5 md:mb-6 max-w-md mx-auto leading-[1.65]">
                {newsletterDesc}
              </p>
              <NewsletterForm />
              <p className="text-white/30 text-[11px] mt-3">{newsletterFootnote}</p>
            </div>

          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          B2B FULL + DELIVERY — Đặt hàng sỉ & Giao hàng toàn quốc
      ═══════════════════════════════════════════ */}
      {sectionsConfig.b2b && <section style={{ background: '#FAF7F2' }} className="py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — content */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-px bg-brand-amber" />
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-amber">{b2bFullLabel}</p>
              </div>
              <h2 className="text-h2 mb-4" style={{ letterSpacing: '-0.028em', color: '#0f2f22' }}>{b2bFullHeading}</h2>
              <p className="text-[15px] leading-[1.8] mb-8" style={{ color: '#666', maxWidth: '44ch' }}>{b2bFullDescSeo}</p>

              {/* Features 2×2 grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {b2bFullFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(16,78,46,0.08)', color: '#104e2e' }}>
                      {B2B_FEATURE_ICONS[f.icon] ?? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold mb-0.5" style={{ color: '#1a1a1a' }}>{f.title}</p>
                      <p className="text-[12px] leading-[1.65]" style={{ color: '#888' }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={b2bFullCtaUrl}
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', boxShadow: '0 3px 12px rgba(16,78,46,0.30), inset 0 1px 0 rgba(255,255,255,0.12)' }}
              >
                {b2bFullCta}
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
              </Link>

              {/* Store info strip */}
              <div className="mt-6 pt-6 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(16,78,46,0.12)' }}>
                <div className="flex items-start gap-2">
                  <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="text-[12px] leading-[1.6]" style={{ color: '#666' }}>{b2bStore.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-[12px]" style={{ color: '#666' }}>{b2bStore.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19h16"/><path d="M5 19V8l7-4 7 4v11"/><path d="M9 10h6"/><path d="M9 13h6"/></svg>
                  <span className="text-[12px]" style={{ color: '#666' }}>Có khu trưng bày mẫu + tư vấn phối đèn theo không gian</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <a href={b2bStore.mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-colors border hover:bg-[#f0f8f3]"
                    style={{ color: '#104e2e', borderColor: 'rgba(16,78,46,0.2)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Bản đồ
                  </a>
                  <a href="tel:0989778247"
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-full transition-colors border hover:bg-[#f0f8f3]"
                    style={{ color: '#104e2e', borderColor: 'rgba(16,78,46,0.2)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 9.81 19.79 19.79 0 01.02 1.18 2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                    0989.778.247
                  </a>
                </div>
                {/* Local SEO — city delivery links */}
                <div className="flex items-start gap-2 mt-2">
                  <svg className="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  <p className="text-[12px] leading-[1.8]" style={{ color: '#666' }}>
                    Giao hàng toàn quốc:{' '}
                    {[
                      { slug: 'tp-hcm', label: 'TP.HCM' },
                      { slug: 'ha-noi', label: 'Hà Nội' },
                      { slug: 'da-nang', label: 'Đà Nẵng' },
                      { slug: 'hoi-an', label: 'Hội An' },
                      { slug: 'can-tho', label: 'Cần Thơ' },
                    ].map(({ slug, label }, i, arr) => (
                      <span key={slug}>
                        <Link href={`/mua-den-long-tai/${slug}`} className="hover:underline underline-offset-2 transition-colors" style={{ color: '#104e2e', fontWeight: 500 }}>{label}</Link>
                        {i < arr.length - 1 && <span style={{ color: '#bbb' }}>, </span>}
                      </span>
                    ))}
                    <span style={{ color: '#999' }}>{' '}và 58 tỉnh thành</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right — image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden" style={{ aspectRatio: '4/3', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b2bFullImg}
                  alt={`Đèn vải ${b2bFullImgAlt}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl px-5 py-4 shadow-lg"
                style={{ background: '#104e2e' }}>
                <p className="text-white text-lg font-bold" style={{ letterSpacing: '-0.02em' }}>{b2bDiscountPct}</p>
                <p className="text-white/70 text-[11px]">{b2bDiscountLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-6 md:mt-8">
          <div style={{ borderTop: '1px solid #EDE8E0' }} />
        </div>

        {/* Delivery embedded */}
        <DeliverySection />

      </section>}

    </>
  );
}
