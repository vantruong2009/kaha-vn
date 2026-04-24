import type { Metadata } from "next";
import Link from "next/link";
import { JsonLdJournalItemList } from "@/components/json-ld-journal-item-list";
import { PageShell } from "@/components/page-shell";
import { plainTextFromHtml } from "@/lib/plain-text-from-html";
import { getSiteUrl } from "@/lib/site-url";
import { countPublishedPosts, getLatestPosts } from "@/server/content";

const PAGE_SIZE = 12;
const site = getSiteUrl();

export const dynamic = "force-dynamic";

type PageProps = { searchParams?: Promise<{ page?: string }> };

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const total = await countPublishedPosts();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, totalPages);
  const canonical =
    page <= 1 ? `${site}/journal` : `${site}/journal?page=${page}`;

  return {
    title: page <= 1 ? "Journal" : `Journal — trang ${page}`,
    description: "Bài viết KAHA.VN",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      title:
        page <= 1 ? "Journal · KAHA.VN" : `Journal (trang ${page}) · KAHA.VN`,
      description: "Bài viết KAHA.VN",
      url: canonical,
      locale: "vi_VN",
    },
  };
}

function formatViDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export default async function JournalPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const requested = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const total = await countPublishedPosts();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requested, totalPages);
  const offset = (page - 1) * PAGE_SIZE;
  const posts = await getLatestPosts(PAGE_SIZE, offset);

  const prevHref =
    page <= 1 ? null : page === 2 ? "/journal" : `/journal?page=${page - 1}`;
  const nextHref =
    page >= totalPages ? null : `/journal?page=${page + 1}`;

  return (
    <PageShell mainClassName="flex-1 px-5 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-[1600px]">
          {posts.length > 0 ? (
            <JsonLdJournalItemList
              siteUrl={site}
              items={posts.map((p) => ({ slug: p.slug, title: p.title }))}
            />
          ) : null}
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
            KAHA.VN
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,2.75rem)] font-normal leading-tight tracking-tight text-ink-900 [font-family:var(--font-display),serif]">
            Journal
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">
            Tài liệu kỹ thuật, case B2B và hướng dẫn từ xưởng KAHA — giúp kiến trúc sư và chủ dự án ra quyết định đúng trước khi đặt hàng.{" "}
            <Link
              href="/feed.xml"
              className="text-platinum-deep underline underline-offset-4 hover:text-ink-900"
            >
              RSS
            </Link>
          </p>

          {posts.length === 0 ? (
            <p className="mt-16 text-ink-600">
              Chưa có bài post trong DB — chạy import XML hoặc thêm nội dung.
            </p>
          ) : (
            <>
              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
                <ul className="space-y-0 border border-hairline bg-paper px-6 md:px-10">
                {posts.map((p) => {
                  const excerptPlain = plainTextFromHtml(p.excerpt, {
                    maxLength: 280,
                  });
                  return (
                    <li key={p.slug} className="border-b border-hairline py-10 first:pt-8">
                      <Link href={`/${p.slug}`} className="group block">
                        {p.published_at ? (
                          <time
                            dateTime={p.published_at}
                            className="text-[13px] uppercase tracking-[0.06em] text-ink-500"
                          >
                            {formatViDate(p.published_at)}
                          </time>
                        ) : null}
                        <h2 className="mt-3 text-xl font-semibold leading-snug text-ink-900 transition-colors group-hover:text-platinum-deep md:text-2xl [font-family:var(--font-display),serif]">
                          {p.title ?? p.slug}
                        </h2>
                        {excerptPlain ? (
                          <p className="mt-3 line-clamp-2 text-base leading-relaxed text-ink-600">
                            {excerptPlain}
                          </p>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
                </ul>
                <aside className="h-fit space-y-5 border border-hairline bg-paper p-6 lg:sticky lg:top-24">
                  <p className="text-[12px] uppercase tracking-[0.12em] text-ink-500">Chủ đề nổi bật</p>
                  {[
                    ["Vật liệu đèn vải", "/journal"],
                    ["Case khách sạn", "/journal"],
                    ["Hướng dẫn RFQ", "/journal"],
                    ["Bảo trì và bảo hành", "/journal"],
                  ].map(([label, href]) => (
                    <Link key={label} href={href} className="block border-b border-hairline pb-3 text-sm text-ink-700 hover:text-ink-900">
                      {label}
                    </Link>
                  ))}
                  <Link
                    href="/showroom"
                    className="mt-4 inline-flex border border-ink-900 bg-ink-900 px-4 py-2 text-xs uppercase tracking-[0.08em] text-paper hover:bg-paper hover:text-ink-900"
                  >
                    Đặt lịch tư vấn
                  </Link>
                </aside>
              </div>
              {totalPages > 1 ? (
                <nav
                  className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-10 text-[13px] font-medium uppercase tracking-[0.08em] text-ink-600"
                  aria-label="Phân trang Journal"
                >
                  {prevHref ? (
                    <Link
                      href={prevHref}
                      className="text-ink-600 underline-offset-4 transition-colors hover:text-ink-900 hover:underline hover:decoration-platinum-deep"
                    >
                      ← Trang trước
                    </Link>
                  ) : (
                    <span className="text-ink-400">← Trang trước</span>
                  )}
                  <span className="text-ink-500">
                    {page} / {totalPages}
                  </span>
                  {nextHref ? (
                    <Link
                      href={nextHref}
                      className="text-ink-600 underline-offset-4 transition-colors hover:text-ink-900 hover:underline hover:decoration-platinum-deep"
                    >
                      Trang sau →
                    </Link>
                  ) : (
                    <span className="text-ink-400">Trang sau →</span>
                  )}
                </nav>
              ) : null}
            </>
          )}
        </div>
    </PageShell>
  );
}
