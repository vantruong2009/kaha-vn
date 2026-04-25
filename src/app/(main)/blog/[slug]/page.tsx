import type { Metadata } from 'next';
import Link from 'next/link';
import FallbackImage from '@/components/FallbackImage';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { getAllPosts, getPostBySlug, type Post } from '@/lib/getPosts';
import BlogShareButtons from './BlogShareButtons';
import { products } from '@/lib/products';
import type { Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import {
  fetchDeletedPostSlugsPg,
  fetchPostDateOverridesPg,
  hasPostgresConfigured,
} from '@/lib/postgres/commerce';

// Cache ngày đăng override từ Postgres (1 lần / 24h)
const getPostDateOverrides = unstable_cache(
  async (): Promise<Record<string, string>> => {
    if (!hasPostgresConfigured()) return {};
    try {
      return await fetchPostDateOverridesPg();
    } catch {
      return {};
    }
  },
  ['post-date-overrides'],
  { revalidate: 3600 * 24, tags: ['post-date-overrides'] }
);

const getDeletedSlugs = unstable_cache(
  async (): Promise<string[]> => {
    if (!hasPostgresConfigured()) return [];
    try {
      return await fetchDeletedPostSlugsPg();
    } catch {
      return [];
    }
  },
  ['deleted-slugs'],
  { revalidate: 3600 }
);

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  // Không pre-build tất cả 914+ bài — tránh tải DB nặng khi build
  // dynamicParams=true bên dưới đảm bảo trang vẫn render on-demand (ISR) khi có request
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const post = await getPostBySlug(normalizedSlug);
  if (!post) return { title: 'Bài viết không tồn tại' };
  const shouldIndex = !post.noindex;
  return {
    title: { absolute: `${post.title} | KAHA` },
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    robots: shouldIndex ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      siteName: 'KAHA',
      locale: 'vi_VN',
      publishedTime: post.date,
      authors: ['https://kaha.vn/ve-chung-toi'],
      ...(post.thumbnail ? { images: [{ url: post.thumbnail.startsWith('http') ? post.thumbnail : `https://kaha.vn${post.thumbnail}`, alt: post.title, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(post.thumbnail ? { images: [post.thumbnail.startsWith('http') ? post.thumbnail : `https://kaha.vn${post.thumbnail}`] } : {}),
    },
  };
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function unescapeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function getReadingTime(content: string): string {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} phút đọc`;
}

// Tên hiển thị cho từng category slug — dùng trong CTA link
const CAT_LABEL: Record<string, string> = {
  'hoi-an-lantern':    'Đèn Lồng Hội An',
  'den-kieu-nhat':     'Đèn Kiểu Nhật',
  'den-trung-thu':     'Đèn Trung Thu',
  'den-long-tet':      'Đèn Tết & Lễ Hội',
  'den-quan-cafe':     'Đèn Quán Cafe',
  'den-nha-hang':      'Đèn Nhà Hàng',
  'den-khach-san':     'Đèn Khách Sạn & Resort',
  'ngoai-troi':        'Đèn Ngoài Trời',
  'phong-ngu':         'Đèn Phòng Ngủ',
  'phong-khach':       'Đèn Phòng Khách',
  'den-may-tre':       'Đèn Tre & Mây',
  'den-long-go':       'Đèn Lồng Gỗ',
  'den-ban':           'Đèn Bàn Trang Trí',
  'den-tha-tran':      'Đèn Thả Trần',
  'den-vai-cao-cap':   'Đèn Vải Cao Cấp',
  'den-trai-tim':      'Đèn Trái Tim',
  'den-tron-10-mau':   'Đèn Tròn 10 Màu',
  'den-ve-tranh':      'Đèn Vẽ Tranh',
  'qua-tang-den-long': 'Quà Tặng Đèn Lồng',
};

// Phát hiện category phù hợp với nội dung bài viết dựa trên categories/tags/slug
function getPostCatSlug(post: Post): string {
  const terms = [
    ...(post.categories ?? []),
    ...(post.tags ?? []),
    post.slug.replace(/-/g, ' '),
  ].map(t => t?.toLowerCase() ?? '');

  const has = (...needles: string[]) =>
    needles.some(n => terms.some(t => t.includes(n)));

  if (has('hội an', 'hoi an', 'hoian'))                                                    return 'hoi-an-lantern';
  if (has('nhật bản', 'nhat ban', 'nhat', 'japan', 'ramen', 'yakiniku', 'izakaya'))        return 'den-kieu-nhat';
  if (has('trung thu', 'mid-autumn', 'lồng đèn trẻ'))                                      return 'den-trung-thu';
  if (has('tết', 'tet ', 'tết nguyên', 'tet nguyen'))                                      return 'den-long-tet';
  if (has('quán cafe', 'quan cafe', 'cà phê', 'ca phe', 'coffee', 'boho', 'vintage', 'industrial')) return 'den-quan-cafe';
  if (has('nhà hàng', 'nha hang', 'restaurant', 'sushi', 'bbq', 'hải sản', 'hai san'))    return 'den-nha-hang';
  if (has('spa', 'resort', 'khách sạn', 'khach san', 'biệt thự', 'biet thu', '5 sao'))    return 'den-khach-san';
  if (has('sân vườn', 'san vuon', 'ngoài trời', 'ngoai troi', 'ban công', 'ban cong'))    return 'ngoai-troi';
  if (has('phòng ngủ', 'phong ngu', 'bedroom'))                                            return 'phong-ngu';
  if (has('phòng khách', 'phong khach', 'sofa', 'living room'))                            return 'phong-khach';
  if (has('may tre', 'mây tre', 'tre may', 'bamboo', 'eco'))                               return 'den-may-tre';
  if (has('gỗ', ' go ', 'wood', 'carved'))                                                 return 'den-long-go';
  if (has('đèn bàn', 'den ban', 'desk lamp'))                                              return 'den-ban';
  if (has('đèn thả', 'den tha', 'pendant', 'đèn tha tran'))                               return 'den-tha-tran';
  if (has('quà tặng', 'qua tang', 'gift', 'doanh nghiệp'))                                return 'qua-tang-den-long';
  if (has('văn phòng', 'van phong', 'office', 'workspace'))                               return 'den-quan-cafe';
  if (has('lễ hội', 'le hoi', 'khai trương', 'sự kiện', 'lễ 30', 'lễ 8', 'lễ 20'))      return 'den-long-tet';
  return '';
}

function getRecommendedProducts(post: Post): Product[] {
  const primarySlug = getPostCatSlug(post);
  const catSlugs = primarySlug ? [primarySlug] : [];

  // Fallback: thêm sub-slugs cho một số category tổng hợp
  const expandedSlugs = primarySlug === 'den-kieu-nhat'
    ? ['den-nhat-ban', 'den-long-nhat-ban', 'den-kieu-nhat']
    : primarySlug === 'den-khach-san'
    ? ['den-khach-san', 'den-resort']
    : catSlugs;

  let matched: Product[] = [];
  if (expandedSlugs.length > 0) {
    matched = products.filter(p =>
      expandedSlugs.some(slug => (p.tags ?? []).includes(slug) || p.category === slug || (p.space ?? []).includes(slug))
    );
  }

  // Fallback: top bestsellers by reviewCount
  if (matched.length < 4) {
    const fallback = [...products]
      .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      .filter(p => !matched.find(m => m.id === p.id));
    matched = [...matched, ...fallback].slice(0, 4);
  }

  return matched.slice(0, 4);
}

function getRelatedPosts(post: Post, allPosts: Post[]): Post[] {
  const candidates = allPosts.filter(
    (p) => p.slug !== post.slug && p.content?.length > 300
  );

  if ((post.tags ?? []).length === 0 && (post.categories ?? []).length === 0) {
    return candidates.slice(0, 3);
  }

  // Tags weight ×2 (more specific) vs categories weight ×1 (broader)
  const scored = candidates
    .map((p) => {
      const tagScore = (post.tags ?? []).filter((t) => (p.tags ?? []).includes(t)).length * 2;
      const catScore = (post.categories ?? []).filter((c) => (p.categories ?? []).includes(c)).length;
      return { post: p, score: tagScore + catScore };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length >= 3) return scored.slice(0, 3).map((x) => x.post);

  const used = new Set(scored.map((x) => x.post.slug));
  const extra = candidates.filter((p) => !used.has(p.slug));
  return [...scored.map((x) => x.post), ...extra].slice(0, 3);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();
  const post = await getPostBySlug(normalizedSlug);
  if (!post) notFound();

  // Kiểm tra soft-delete qua cached list — không gọi DB trực tiếp mỗi trang
  const deletedSlugs = await getDeletedSlugs();
  if (deletedSlugs.includes(normalizedSlug)) notFound();

  // Date override từ bulk-schedule (cached 24h, không chặn page nếu DB chậm)
  const dateOverrides = await getPostDateOverrides();
  const postDate = dateOverrides[normalizedSlug] || post.date;

  // Sanitize blog content:
  // 1. Strip <script> tags (WP embeds ld+json FAQPage)
  // 2. Strip event handler attributes (XSS prevention)
  // 3. Add rel="nofollow noopener noreferrer" cho external links
  // 4. Add loading="lazy" cho images trong prose
  const cleanContent = post.content
    ? post.content
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/<a\s+([^>]*href\s*=\s*["']https?:\/\/(?!longdenviet\.com)[^"']+["'][^>]*)>/gi,
          (match, attrs) => {
            if (/rel\s*=/i.test(attrs)) return match;
            return `<a ${attrs} rel="nofollow noopener noreferrer" target="_blank">`;
          })
        .replace(/<img\s+(?![^>]*loading\s*=)/gi, '<img loading="lazy" ')
    : '';

  const allPostsForRelated = await getAllPosts();
  const relatedPosts = getRelatedPosts(post, allPostsForRelated);
  const recommendedProducts = getRecommendedProducts(post);
  const postCatSlug = getPostCatSlug(post);
  const postCatLabel = postCatSlug ? (CAT_LABEL[postCatSlug] ?? '') : '';
  const readingTime = getReadingTime(cleanContent);
  const postUrl = `https://kaha.vn/blog/${post.slug}`;

  const author = {
    '@type': 'Person',
    name: 'Đội Ngũ KAHA',
    url: 'https://kaha.vn/ve-chung-toi',
  };

  const publisher = {
    '@type': 'Organization',
    '@id': 'https://kaha.vn/#organization',
    name: 'KAHA® — Xưởng Đèn Lồng',
    url: 'https://kaha.vn',
    logo: { '@type': 'ImageObject', url: 'https://kaha.vn/logo.webp' },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    articleBody: cleanContent.replace(/<[^>]{0,500}>/g, '').replace(/\s{2,}/g, ' ').trim().slice(0, 5000),
    datePublished: postDate,
    dateModified: post.updatedAt || postDate,
    author,
    publisher,
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    ...(post.thumbnail ? {
      image: (() => {
        const imgUrl = post.thumbnail.startsWith('http') ? post.thumbnail : `https://kaha.vn${post.thumbnail}`;
        return {
          '@type': 'ImageObject',
          url: imgUrl,
          contentUrl: imgUrl,
          creator: { '@type': 'Organization', name: 'KAHA', url: 'https://kaha.vn' },
          copyrightHolder: { '@type': 'Organization', name: 'KAHA', url: 'https://kaha.vn' },
          copyrightNotice: `© ${new Date().getFullYear()} KAHA — kaha.vn. All rights reserved.`,
          license: 'https://kaha.vn/dieu-khoan',
          acquireLicensePage: 'https://kaha.vn/lien-he',
          creditText: 'KAHA — kaha.vn',
        };
      })(),
    } : {}),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://kaha.vn' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://kaha.vn/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  // Auto-generate FAQ schema from <h3>...</h3><p>...</p> pairs in content
  // Chỉ lấy h3 có dấu "?" hoặc bắt đầu bằng từ hỏi → tín hiệu sạch cho Google
  const faqLd = (() => {
    if (!cleanContent) return null;
    const pairs: { question: string; answer: string }[] = [];
    const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
    const questionWords = /^(Tại sao|Có thể|Làm sao|Nên|Khi nào|Cách|Giá|Mua|Ở đâu|Đèn|Làm thế|Bao nhiêu|Loại nào|Chất liệu|Kích thước|Thời gian|Có nên|Phân biệt|So sánh|Hướng dẫn)/i;
    let m;
    while ((m = re.exec(cleanContent)) !== null) {
      const q = unescapeHtml(m[1].replace(/<[^>]+>/g, '').trim());
      const a = unescapeHtml(m[2].replace(/<[^>]+>/g, '').trim());
      if (q && a && (q.includes('?') || questionWords.test(q))) pairs.push({ question: q, answer: a });
    }
    if (pairs.length < 2) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pairs.map(p => ({
        '@type': 'Question',
        name: p.question,
        acceptedAnswer: { '@type': 'Answer', text: p.answer },
      })),
    };
  })();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, '<\\/script>') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/<\/script>/gi, '<\\/script>') }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/<\/script>/gi, '<\\/script>') }}
        />
      )}
      <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
        <div className="max-w-4xl mx-auto px-4 py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 flex-wrap" style={{ fontSize: '11px', color: '#a0907a' }}>
            <Link href="/" className="transition-colors hover:text-[#104e2e]" style={{ color: '#a0907a' }}>Trang chủ</Link>
            <span style={{ color: '#c0b0a0' }}>›</span>
            <Link href="/blog" className="transition-colors hover:text-[#104e2e]" style={{ color: '#a0907a' }}>Blog</Link>
            <span style={{ color: '#c0b0a0' }}>›</span>
            <span className="line-clamp-1" style={{ color: '#1a1a1a', fontWeight: 500 }}>{post.title}</span>
          </nav>

          {/* Article */}
          <article className="bg-white rounded-2xl border border-[#EDE5D8] overflow-hidden mb-10">
            {/* Thumbnail */}
            {post.thumbnail ? (
              <div className="relative w-full max-h-96 overflow-hidden">
                <FallbackImage
                  src={post.thumbnail}
                  alt={`${post.title} | KAHA`}
                  className="w-full object-cover max-h-96"
                  loading="eager"
                />
              </div>
            ) : (
              <div className="h-48 bg-brand-green-lt flex items-center justify-center">
                <svg width="42" height="60" viewBox="0 0 60 86" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.3">
                  <line x1="30" y1="0" x2="30" y2="10" stroke="#104e2e" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="18" y="8" width="24" height="5" rx="1.5" fill="#104e2e"/>
                  <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#104e2e" strokeWidth="1.5" fill="rgba(16,78,46,0.1)"/>
                  <line x1="22" y1="14" x2="22" y2="76" stroke="#104e2e" strokeWidth="0.8" opacity="0.5"/>
                  <line x1="30" y1="14" x2="30" y2="76" stroke="#104e2e" strokeWidth="0.8" opacity="0.5"/>
                  <line x1="38" y1="14" x2="38" y2="76" stroke="#104e2e" strokeWidth="0.8" opacity="0.5"/>
                  <rect x="18" y="74" width="24" height="5" rx="1.5" fill="#104e2e"/>
                  <line x1="30" y1="79" x2="30" y2="86" stroke="#104e2e" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            )}

            <div className="p-8 md:p-10">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] font-bold uppercase tracking-widest text-brand-green bg-brand-green-lt px-2 py-0.5 rounded"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-3 leading-tight">
                {post.title}
              </h1>

              {/* Author + Date + Reading time */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6 text-sm" style={{ color: '#888' }}>
                <Link href="/ve-chung-toi" style={{ color: '#104e2e', fontWeight: 500 }}>Xưởng KAHA</Link>
                <span>·</span>
                <time dateTime={postDate}>{formatDate(postDate)}</time>
                <span>·</span>
                <span>{readingTime}</span>
              </div>

              {/* Content — dùng cleanContent (đã strip script tags) để tránh duplicate FAQPage schema */}
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: cleanContent }}
              />

              {/* Tags */}
              {(post.tags ?? []).length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#EDE5D8] flex flex-wrap gap-2">
                  {(post.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-[#4a4a4a] border border-[#EDE5D8] px-2.5 py-1 rounded-full" style={{ background: '#FAF7F2' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share buttons */}
              <BlogShareButtons url={postUrl} title={post.title} />
            </div>
          </article>

          {/* Recommended products */}
          {recommendedProducts.length > 0 && (
            <section className="mb-10">
              <div className="mb-5">
                <h2 className="text-2xl font-semibold text-[#1a1a1a]">
                  Sản Phẩm Liên Quan
                </h2>
                <p className="text-sm text-[#888] mt-1">Xem và mua ngay tại KAHA</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {postCatSlug && postCatLabel && (
                <div className="mt-5 flex justify-end">
                  <Link
                    href={`/c/${postCatSlug}`}
                    className="inline-flex items-center gap-2 text-[13px] font-bold transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #1a6b3c, #104e2e)', color: '#fff', padding: '9px 18px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(16,78,46,.25)' }}
                  >
                    Xem tất cả {postCatLabel}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-5">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="bg-white rounded-xl border border-[#EDE5D8] overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {rp.thumbnail ? (
                      <div className="relative h-36 w-full overflow-hidden bg-brand-green-lt">
                        <FallbackImage
                          src={rp.thumbnail}
                          alt={rp.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="h-36 bg-brand-green-lt flex items-center justify-center">
                        <svg width="28" height="40" viewBox="0 0 60 86" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.3">
                          <line x1="30" y1="0" x2="30" y2="10" stroke="#104e2e" strokeWidth="2" strokeLinecap="round"/>
                          <rect x="18" y="8" width="24" height="5" rx="1.5" fill="#104e2e"/>
                          <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#104e2e" strokeWidth="1.5" fill="rgba(16,78,46,0.1)"/>
                          <rect x="18" y="74" width="24" height="5" rx="1.5" fill="#104e2e"/>
                        </svg>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-[#1a1a1a] leading-snug line-clamp-2 mb-1">
                        {rp.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 text-center">
            <Link href="/blog" className="text-sm text-brand-green hover:underline font-semibold">
              ← Quay lại Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
