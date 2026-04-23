import type { Metadata } from "next";
import { ProductTeaserGrid } from "@/components/product-teaser-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFeaturedProducts } from "@/server/content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const products = await getFeaturedProducts(6);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper-warm">
      <SiteHeader />

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
            <p className="mt-4 text-sm font-medium text-platinum-deep">
              Thêm sản phẩm trong DB hoặc chạy import WP XML.
            </p>
          ) : null}
        </div>
      </main>

      <ProductTeaserGrid items={products} />

      <SiteFooter />
    </div>
  );
}
