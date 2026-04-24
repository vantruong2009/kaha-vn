import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { SiteNavLinks } from "@/components/site-nav-links";
import { getLatestPosts, getShopFacets } from "@/server/content";
import { getSiteSettings } from "@/server/site-settings";

const LOGO_PATH = path.join(process.cwd(), "public/images/logo.png");

export async function SiteHeader() {
  const settings = await getSiteSettings();
  const [facets, posts] = await Promise.all([
    getShopFacets(),
    getLatestPosts(6, 0),
  ]);
  const topCategories = facets.categories.slice(0, 8);
  const topTags = facets.tags.slice(0, 8);
  const hasLogo = fs.existsSync(LOGO_PATH);

  return (
    <header className="border-b border-hairline">
      <div className="border-b border-hairline bg-ink-900 px-5 py-2 text-center md:px-12">
        <Link
          href={settings.topbarHref || "/showroom"}
          className="text-[11px] uppercase tracking-[0.1em] text-paper/85 transition-colors hover:text-paper"
        >
          {settings.topbarText}
        </Link>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-12 md:py-5">
        <Link
          href="/"
          className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-platinum-deep"
        >
          {hasLogo ? (
            <Image
              src="/images/logo.png"
              alt={settings.siteName}
              width={210}
              height={64}
              className="h-9 w-auto max-w-[230px] object-contain object-left"
              priority
              sizes="210px"
            />
          ) : (
            <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-700">
              {settings.logoText || settings.siteName}
            </span>
          )}
        </Link>
        <div className="hidden min-w-[280px] flex-1 border border-hairline bg-paper px-3 py-2 md:flex">
          <input
            readOnly
            placeholder="Tìm sản phẩm, danh mục…"
            className="w-full bg-transparent text-sm text-ink-500 outline-none placeholder:text-ink-400"
            aria-label="Ô tìm kiếm (mở Shop)"
          />
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${settings.hotline.replace(/[^\d+]/g, "")}`}
            className="hidden border border-hairline px-4 py-2 text-xs uppercase tracking-[0.08em] text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900 md:inline-flex"
          >
            {settings.hotline}
          </a>
          <Link
            href={settings.primaryCtaHref || "/showroom"}
            className="border border-ink-900 bg-ink-900 px-4 py-2 text-xs uppercase tracking-[0.08em] text-paper transition-colors hover:bg-paper hover:text-ink-900"
          >
            {settings.primaryCtaLabel || "Đặt lịch"}
          </Link>
        </div>
      </div>
      <div className="border-t border-hairline px-5 md:px-12">
        <nav
          className="mx-auto hidden max-w-[1600px] items-center gap-7 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-600 md:flex"
          aria-label="Điều hướng chính"
        >
          <div className="group relative">
            <Link href="/shop" className="hover:text-ink-900">
              Shop
            </Link>
            <div className="invisible absolute left-0 top-full z-50 mt-3 w-[780px] border border-hairline bg-paper p-6 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Danh mục nổi bật</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {topCategories.map((c) => (
                      <Link
                        key={c.value}
                        href={`/shop?category=${encodeURIComponent(c.value)}`}
                        className="border border-hairline px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900"
                      >
                        {c.value} ({c.n})
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Tag phổ biến</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topTags.map((t) => (
                      <Link
                        key={t.value}
                        href={`/shop?tag=${encodeURIComponent(t.value)}`}
                        className="border border-hairline px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900"
                      >
                        {t.value}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/shop"
                    className="mt-5 inline-flex border border-ink-900 bg-ink-900 px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-paper transition-colors hover:bg-paper hover:text-ink-900"
                  >
                    Xem toàn bộ Shop
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative">
            <Link href="/journal" className="hover:text-ink-900">
              Journal
            </Link>
            <div className="invisible absolute left-0 top-full z-50 mt-3 w-[620px] border border-hairline bg-paper p-6 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Bài viết gần đây</p>
              <div className="mt-4 grid gap-2">
                {posts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="border-b border-hairline pb-2 text-sm text-ink-700 transition-colors hover:text-ink-900"
                  >
                    {p.title ?? p.slug}
                  </Link>
                ))}
              </div>
              <Link
                href="/journal"
                className="mt-5 inline-flex border border-hairline px-4 py-2 text-[11px] uppercase tracking-[0.08em] text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900"
              >
                Vào Journal
              </Link>
            </div>
          </div>
          <SiteNavLinks includePrimary={false} />
          {process.env.NEXT_PUBLIC_SHOW_ADMIN_NAV === "1" ? (
            <Link href="/admin/settings" className="ml-auto text-ink-500 hover:text-ink-900">
              Cài đặt
            </Link>
          ) : null}
        </nav>
        <nav className="mx-auto flex max-w-[1600px] items-center gap-5 overflow-x-auto py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-600 md:hidden">
          <Link href="/shop" className="whitespace-nowrap">Shop</Link>
          <Link href="/journal" className="whitespace-nowrap">Journal</Link>
          <Link href="/showroom" className="whitespace-nowrap">Showroom</Link>
          <Link href="/lookbook" className="whitespace-nowrap">Lookbook</Link>
          <Link href="/moodboard" className="whitespace-nowrap">Moodboard</Link>
          <a
            href={`tel:${settings.hotline.replace(/[^\d+]/g, "")}`}
            className="ml-auto whitespace-nowrap border border-hairline px-3 py-1.5 text-[11px]"
          >
            Gọi {settings.hotline}
          </a>
        </nav>
      </div>
    </header>
  );
}
