import type { Metadata } from "next";
import Link from "next/link";
import { ProductTeaserGrid } from "@/components/product-teaser-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site-url";
import { getFeaturedProducts } from "@/server/content";

const site = getSiteUrl();
const homeDesc =
  "Đèn trang trí cao cấp KAHA.VN — thiết kế editorial, Obsidian / platinum.";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: homeDesc,
  openGraph: {
    type: "website",
    title: "KAHA.VN — Đèn cao cấp",
    description: homeDesc,
    url: `${site}/`,
    locale: "vi_VN",
  },
};

export default async function Home() {
  const products = await getFeaturedProducts(6);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper-warm">
      <SiteHeader />

      <div
        id="main-content"
        tabIndex={-1}
        className="flex min-h-0 flex-1 flex-col"
      >
        <main className="flex flex-1 flex-col justify-center px-5 py-16 md:px-12 md:py-[120px]">
          <div className="mx-auto max-w-[720px] text-center md:text-left">
            <h1
              className="text-balance text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.1] tracking-tight text-ink-900 [font-family:var(--font-display),serif]"
            >
              Ánh sáng dẫn không gian
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-700">
              Đèn trang trí cao cấp — Obsidian / platinum; nội dung từ Postgres sau
              import.
            </p>
            {products.length === 0 ? (
              <div className="mt-6 space-y-4">
                <p className="text-sm font-medium text-platinum-deep">
                  Thêm sản phẩm trong DB hoặc chạy import WP XML.
                </p>
                <p className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] font-medium uppercase tracking-[0.08em] text-ink-600 md:justify-start">
                  <Link
                    href="/journal"
                    className="transition-colors hover:text-ink-900 hover:underline hover:decoration-platinum-deep hover:underline-offset-4"
                  >
                    Journal
                  </Link>
                  <Link
                    href="/shop"
                    className="transition-colors hover:text-ink-900 hover:underline hover:decoration-platinum-deep hover:underline-offset-4"
                  >
                    Shop
                  </Link>
                  <Link
                    href="/feed.xml"
                    className="transition-colors hover:text-ink-900 hover:underline hover:decoration-platinum-deep hover:underline-offset-4"
                  >
                    RSS
                  </Link>
                </p>
              </div>
            ) : null}
          </div>
        </main>

        <ProductTeaserGrid items={products} />
      </div>

      <SiteFooter />
    </div>
  );
}
