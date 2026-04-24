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
  const products = await getFeaturedProducts(9);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper-warm">
      <SiteHeader />

      <div id="main-content" tabIndex={-1} className="flex min-h-0 flex-1 flex-col">
        <section className="border-b border-hairline">
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[56%_44%]">
            <div className="border-b border-hairline px-5 py-16 md:border-b-0 md:border-r md:px-12 md:py-24">
              <p className="text-[12px] uppercase tracking-[0.14em] text-ink-500">KAHA · Xuong san xuat tai Viet Nam</p>
              <h1 className="mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1.04] tracking-tight text-ink-900 [font-family:var(--font-display),serif]">
                Gia cong den vai cao cap
                <br />
                theo ban ve du an
              </h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.8] text-ink-700">
                Khung giao dien da doi sang storefront day du: co dieu huong ro, danh muc, CTA
                tu van va lop trinh bay san pham. Du lieu van dung ruot KAHA tu Postgres.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/shop" className="border border-ink-900 bg-ink-900 px-7 py-2.5 text-[12px] uppercase tracking-[0.08em] text-paper hover:bg-paper hover:text-ink-900">
                  Xem san pham
                </Link>
                <Link href="/showroom" className="border border-hairline px-7 py-2.5 text-[12px] uppercase tracking-[0.08em] text-ink-700 hover:border-ink-300 hover:text-ink-900">
                  Dat lich xuong
                </Link>
                <Link href="/journal" className="border border-hairline px-7 py-2.5 text-[12px] uppercase tracking-[0.08em] text-ink-700 hover:border-ink-300 hover:text-ink-900">
                  Blog ky thuat
                </Link>
              </div>
            </div>
            <div className="grid gap-px bg-hairline p-px">
              {[
                ["477+", "SKU da import"],
                ["48h", "Phan hoi RFQ"],
                ["B2B", "Khach san · F&B · Retail"],
                ["12T", "Bao hanh khung"],
              ].map(([v, l]) => (
                <div key={l} className="bg-paper p-8">
                  <p className="font-mono text-3xl text-ink-900">{v}</p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.1em] text-ink-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProductTeaserGrid items={products} heading="San pham noi bat" />

        <section className="border-y border-hairline px-5 py-14 md:px-12">
          <div className="mx-auto grid max-w-[1600px] gap-px bg-hairline md:grid-cols-3">
            {[
              ["Danh muc", "Duyet danh muc / tag theo bo loc tuong tu storefront longdenviet.", "/shop"],
              ["Blog", "Doc huong dan vat lieu, case B2B va checklist truoc khi dat hang.", "/journal"],
              ["Lien he", "Nhan bao gia theo ban ve, so luong va tien do cong trinh.", "/showroom"],
            ].map(([title, desc, href]) => (
              <Link key={title} href={href} className="bg-paper p-8 transition-colors hover:bg-paper-warm">
                <p className="text-lg [font-family:var(--font-display),serif] text-ink-900">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
