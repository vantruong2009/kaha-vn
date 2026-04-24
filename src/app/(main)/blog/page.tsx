import type { Metadata } from 'next';
import Link from 'next/link';
import FallbackImage from '@/components/FallbackImage';
import { getAllPosts, getPostsContentBySlug, extractFirstImageFromContent, isValidThumbnail, type Post } from '@/lib/getPosts';

export const revalidate = 86400;

const POSTS_PER_PAGE = 12;

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const cat = params.cat || '';

  const title = cat
    ? `${cat} | Blog LongDenViet`
    : 'Blog & Tin Tức | LongDenViet';
  const description =
    'Tin tức, câu chuyện về đèn lồng thủ công truyền thống Việt Nam — Đèn Hội An, đèn trung thu, nghệ nhân làng nghề.';

  const isFiltered = !!cat;
  const canonicalBase = page > 1 && !cat ? `/blog?page=${page}` : '/blog';

  return {
    title,
    description,
    alternates: { canonical: canonicalBase },
    robots: isFiltered ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const activeCat = params.cat || '';

  const allValidPosts = await getAllPosts();

  const allCategories = Array.from(
    new Set(allValidPosts.flatMap((p) => p.categories))
  ).sort((a, b) => a.localeCompare(b, 'vi'));

  const filteredPosts = activeCat
    ? allValidPosts.filter((p) => p.categories.includes(activeCat))
    : allValidPosts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  let pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  const slugsMissingThumb = pagePosts
    .filter(p => !isValidThumbnail(p.thumbnail))
    .map(p => p.slug);

  if (slugsMissingThumb.length > 0) {
    const contentMap = await getPostsContentBySlug(slugsMissingThumb);
    pagePosts = pagePosts.map(p => {
      if (isValidThumbnail(p.thumbnail)) return p;
      const extracted = extractFirstImageFromContent(contentMap[p.slug] || '');
      return extracted ? { ...p, thumbnail: extracted } : p;
    });
  }

  const featuredPost = !activeCat && page === 1 && pagePosts.length > 0 ? pagePosts[0] : null;
  const gridPosts = featuredPost ? pagePosts.slice(1) : pagePosts;

  function pageHref(p: number) {
    const catPart = activeCat ? `&cat=${encodeURIComponent(activeCat)}` : '';
    return p === 1 && !activeCat ? '/blog' : `/blog?page=${p}${catPart}`;
  }

  function catHref(cat: string) {
    return cat ? `/blog?cat=${encodeURIComponent(cat)}` : '/blog';
  }

  const isFiltered = !!activeCat;

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://longdenviet.com/blog',
    name: 'Blog LongDenViet — Đèn Lồng Thủ Công Việt Nam',
    url: 'https://longdenviet.com/blog',
    publisher: { '@id': 'https://longdenviet.com/#organization' },
    blogPost: pagePosts.slice(0, 10).map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://longdenviet.com/blog/${p.slug}`,
      datePublished: p.date,
      description: p.excerpt,
      ...(p.thumbnail ? { image: p.thumbnail } : {}),
    })),
  };

  const LanternPlaceholder = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={Math.round(size * 1.44)} viewBox="0 0 60 86" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ opacity: 0.25 }}>
      <line x1="30" y1="0" x2="30" y2="10" stroke="#a0907a" strokeWidth="2" strokeLinecap="round"/>
      <rect x="18" y="8" width="24" height="5" rx="1.5" fill="#a0907a"/>
      <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#a0907a" strokeWidth="1.5" fill="rgba(160,144,122,0.1)"/>
      <line x1="22" y1="14" x2="22" y2="76" stroke="#a0907a" strokeWidth="0.8" opacity="0.5"/>
      <line x1="30" y1="14" x2="30" y2="76" stroke="#a0907a" strokeWidth="0.8" opacity="0.5"/>
      <line x1="38" y1="14" x2="38" y2="76" stroke="#a0907a" strokeWidth="0.8" opacity="0.5"/>
      <rect x="18" y="74" width="24" height="5" rx="1.5" fill="#a0907a"/>
      <line x1="30" y1="79" x2="30" y2="86" stroke="#a0907a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      {!isFiltered && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/<\/script>/gi, '<\\/script>') }} />}

      {/* ── Header Band ──────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 pt-8 pb-0">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] mb-6 font-medium" style={{ color: '#a0907a' }}>
            <Link href="/" className="transition-colors hover:text-[#104e2e]">Trang chủ</Link>
            <span style={{ color: '#c0b0a0' }}>›</span>
            {activeCat ? (
              <>
                <Link href="/blog" className="transition-colors hover:text-[#104e2e]">Blog</Link>
                <span style={{ color: '#c0b0a0' }}>›</span>
                <span style={{ color: '#1a1a1a' }}>{activeCat}</span>
              </>
            ) : (
              <span style={{ color: '#1a1a1a' }}>Blog</span>
            )}
          </nav>

          {/* Title */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.24em] font-bold mb-3" style={{ color: '#c9822a' }}>
              {activeCat ? 'Danh mục' : 'Góc bài viết'}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>
              {activeCat ? (
                <span style={{ color: '#1a6b3c' }}>{activeCat}</span>
              ) : (
                <>Blog <span style={{ color: '#1a6b3c' }}>&amp; Tin Tức</span></>
              )}
            </h1>
            <p className="text-sm" style={{ color: '#a0907a', lineHeight: 1.7 }}>
              {activeCat
                ? `${filteredPosts.length} bài viết trong danh mục này`
                : `${allValidPosts.length} bài viết về đèn lồng thủ công, nghề truyền thống và văn hóa Việt Nam`}
            </p>
          </div>

          {/* Category filter tabs */}
          {allCategories.length > 0 && (
            <div className="-mx-4 md:-mx-10 px-4 md:px-10 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-center gap-0 min-w-max" style={{ borderTop: '1px solid #EDE5D8' }}>
                <Link
                  href={catHref('')}
                  className={[
                    'relative inline-flex items-center gap-1.5 px-4 py-3.5 text-[12px] font-bold whitespace-nowrap transition-colors duration-150 border-t-2 -mt-px',
                    !activeCat
                      ? 'border-[#1a6b3c] text-[#1a6b3c]'
                      : 'border-transparent hover:text-[#1a1a1a]',
                  ].join(' ')}
                  style={!activeCat ? {} : { color: '#a0907a' }}
                >
                  Tất cả
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                    style={!activeCat
                      ? { background: '#1a6b3c', color: '#fff' }
                      : { background: '#f0ece5', color: '#a0907a' }
                    }
                  >
                    {allValidPosts.length}
                  </span>
                </Link>

                {allCategories.map((cat) => {
                  const count = allValidPosts.filter((p) => p.categories.includes(cat)).length;
                  const isActive = activeCat === cat;
                  return (
                    <Link
                      key={cat}
                      href={catHref(cat)}
                      className={[
                        'relative inline-flex items-center gap-1.5 px-4 py-3.5 text-[12px] font-bold whitespace-nowrap transition-colors duration-150 border-t-2 -mt-px',
                        isActive
                          ? 'border-[#1a6b3c] text-[#1a6b3c]'
                          : 'border-transparent hover:text-[#1a1a1a]',
                      ].join(' ')}
                      style={isActive ? {} : { color: '#a0907a' }}
                    >
                      {cat}
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none"
                        style={isActive
                          ? { background: '#1a6b3c', color: '#fff' }
                          : { background: '#f0ece5', color: '#a0907a' }
                        }
                      >
                        {count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">

        {/* ── Featured Post ─────────────────────────────────────── */}
        {featuredPost && (
          <article
            className="relative overflow-hidden mb-10 group"
            style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail */}
              <Link href={`/blog/${featuredPost.slug}`} className="block md:w-[52%] shrink-0">
                {featuredPost.thumbnail ? (
                  <div className="relative overflow-hidden" style={{ height: '300px', minHeight: '300px', borderRadius: '24px 0 0 24px', background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}>
                    <FallbackImage
                      src={featuredPost.thumbnail}
                      alt={`${featuredPost.title} | LongDenViet`}
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out w-full h-full"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent 50%)' }} aria-hidden="true" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center" style={{ height: '300px', background: 'linear-gradient(135deg, #f5efe5, #ede5d8)', borderRadius: '24px 0 0 24px' }}>
                    <LanternPlaceholder size={56} />
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="flex-1 p-7 md:p-10 flex flex-col justify-between">
                <div>
                  {/* Labels */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: '#c9822a' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="#c9822a" aria-hidden="true"><circle cx="4" cy="4" r="4"/></svg>
                      Nổi bật
                    </span>
                    {featuredPost.categories.length > 0 && (
                      <Link
                        href={catHref(featuredPost.categories[0])}
                        className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg transition-colors hover:bg-[#1a6b3c] hover:text-white"
                        style={{ background: 'rgba(26,107,60,0.08)', color: '#1a6b3c' }}
                      >
                        {featuredPost.categories[0]}
                      </Link>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-bold mb-4 leading-snug" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1a1a1a', letterSpacing: '-0.03em' }}>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="transition-colors hover:text-[#1a6b3c]"
                    >
                      {featuredPost.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-[14px] mb-0 line-clamp-3" style={{ color: '#6a5840', lineHeight: 1.85 }}>
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-7 pt-6" style={{ borderTop: '1px solid #EDE5D8' }}>
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a0907a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="text-[12px]" style={{ color: '#a0907a' }}>{formatDate(featuredPost.date)}</span>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="flex items-center gap-2 text-[13px] font-bold transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #1a6b3c, #104e2e)', borderRadius: '14px', padding: '10px 20px', color: '#fff', boxShadow: '0 4px 14px rgba(16,78,46,.28)' }}
                  >
                    Đọc bài viết
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* ── Section divider ──────────────────────────────────── */}
        {featuredPost && gridPosts.length > 0 && (
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px" style={{ background: '#EDE5D8' }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] shrink-0" style={{ color: '#a0907a' }}>
              Tất cả bài viết
            </span>
            <div className="flex-1 h-px" style={{ background: '#EDE5D8' }} />
          </div>
        )}

        {/* ── Grid ─────────────────────────────────────────────── */}
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {gridPosts.map((post) => (
              <article
                key={post.slug}
                className="relative overflow-hidden group flex flex-col hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:border-[#d0c8bc]"
                style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s' }}
              >
                {/* Thumbnail with floating category badge */}
                <Link href={`/blog/${post.slug}`} className="block relative shrink-0">
                  {post.thumbnail ? (
                    <div className="relative overflow-hidden" style={{ height: '220px', background: 'linear-gradient(135deg, #f5efe5, #ede5d8)', borderRadius: '20px 20px 0 0' }}>
                      <FallbackImage
                        src={post.thumbnail}
                        alt={`${post.title} | LongDenViet`}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out w-full h-full"
                      />
                      {/* Bottom gradient for readability */}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)' }} aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center" style={{ height: '220px', background: 'linear-gradient(135deg, #f5efe5, #ede5d8)', borderRadius: '20px 20px 0 0' }}>
                      <LanternPlaceholder size={40} />
                    </div>
                  )}

                  {/* Category badge — floats on image */}
                  {post.categories.length > 0 && (
                    <span
                      className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.92)', color: '#1a6b3c', backdropFilter: 'blur(4px)' }}
                    >
                      {post.categories[0]}
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  {/* Title */}
                  <h2 className="text-[16px] font-bold mb-2.5 leading-snug line-clamp-2 flex-1" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-[#1a6b3c]"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-[13px] line-clamp-2 mb-4" style={{ color: '#8a7560', lineHeight: 1.75 }}>
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid #EDE5D8' }}>
                    <span className="text-[11px]" style={{ color: '#a0907a' }}>{formatDate(post.date)}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-[12px] font-bold transition-colors hover:text-[#104e2e]"
                      style={{ color: '#1a6b3c' }}
                    >
                      Đọc bài
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : pagePosts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="flex justify-center mb-5">
              <LanternPlaceholder size={44} />
            </div>
            <p className="text-base font-semibold mb-1" style={{ color: '#6a5840' }}>Không có bài viết nào trong danh mục này.</p>
            <p className="text-sm mb-5" style={{ color: '#a0907a' }}>Thử xem tất cả bài viết hoặc chọn danh mục khác.</p>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #1a6b3c, #104e2e)', color: '#fff', padding: '10px 20px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(16,78,46,.25)' }}>
              Xem tất cả bài viết
            </Link>
          </div>
        ) : null}

        {/* ── Pagination ────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={pageHref(page - 1)}
                className="px-4 py-2.5 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: '#FFFFFF', border: '1px solid #E8DDD0', borderRadius: '12px', color: '#6a5840', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                ← Trước
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`dots-${idx}`} className="px-2" style={{ color: '#a0907a' }}>…</span>
                ) : (
                  <Link
                    key={p}
                    href={pageHref(p as number)}
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold rounded-xl transition-all duration-150 hover:-translate-y-0.5"
                    style={p === page
                      ? { background: 'linear-gradient(135deg, #1a6b3c, #104e2e)', color: '#fff', border: 'none', boxShadow: '0 4px 14px rgba(16,78,46,.3)' }
                      : { background: '#FFFFFF', border: '1px solid #E8DDD0', color: '#6a5840', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }
                    }
                  >
                    {p}
                  </Link>
                )
              )}
            {page < totalPages && (
              <Link
                href={pageHref(page + 1)}
                className="px-4 py-2.5 text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: '#FFFFFF', border: '1px solid #E8DDD0', borderRadius: '12px', color: '#6a5840', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                Sau →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
