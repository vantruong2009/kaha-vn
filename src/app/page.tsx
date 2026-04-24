import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ProductTeaserGrid } from "@/components/product-teaser-grid";
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
    <PageShell mainClassName="flex min-h-0 flex-1 flex-col p-0">
        <section className="border-b border-hairline">
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[56%_44%]">
            <div className="border-b border-hairline px-5 py-16 md:border-b-0 md:border-r md:px-12 md:py-24">
              <p className="text-[12px] uppercase tracking-[0.14em] text-ink-500">
                KAHA · Xưởng sản xuất tại Việt Nam
              </p>
              <h1 className="mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1.04] tracking-tight text-ink-900 [font-family:var(--font-display),serif]">
                Gia công đèn vải cao cấp
                <br />
                theo bản vẽ dự án
              </h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-[1.8] text-ink-700">
                Chúng tôi sản xuất đèn vải, đèn treo và khung kim loại theo đúng brief kiến trúc —
                kích thước, chất liệu, nguồn sáng và tiêu chuẩn lắp đặt. Một đầu mối từ mẫu thử đến
                giao hàng loạt cho khách sạn, nhà hàng và không gian thương mại.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/shop" className="border border-ink-900 bg-ink-900 px-7 py-2.5 text-[12px] uppercase tracking-[0.08em] text-paper hover:bg-paper hover:text-ink-900">
                  Xem sản phẩm
                </Link>
                <Link href="/showroom" className="border border-hairline px-7 py-2.5 text-[12px] uppercase tracking-[0.08em] text-ink-700 hover:border-ink-300 hover:text-ink-900">
                  Đặt lịch xưởng
                </Link>
                <Link href="/journal" className="border border-hairline px-7 py-2.5 text-[12px] uppercase tracking-[0.08em] text-ink-700 hover:border-ink-300 hover:text-ink-900">
                  Journal kỹ thuật
                </Link>
              </div>
            </div>
            <div className="grid gap-px bg-hairline p-px">
              {[
                ["477+", "SKU đã xuất bản"],
                ["48h", "Phản hồi RFQ"],
                ["B2B", "Khách sạn · F&B · Retail"],
                ["12T", "Bảo hành khung"],
              ].map(([v, l]) => (
                <div key={l} className="bg-paper p-8">
                  <p className="font-mono text-3xl text-ink-900">{v}</p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.1em] text-ink-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ProductTeaserGrid items={products} heading="Sản phẩm nổi bật" />

        <section className="border-y border-hairline px-5 py-14 md:px-12">
          <div className="mx-auto grid max-w-[1600px] gap-px bg-hairline md:grid-cols-3">
            {[
              [
                "Danh mục",
                "Lọc theo nhóm sản phẩm và tag — cùng một luồng duyệt như catalog chuyên nghiệp.",
                "/shop",
              ],
              [
                "Journal",
                "Vật liệu, quy trình gia công, case B2B và những điểm cần chốt trước khi đặt hàng.",
                "/journal",
              ],
              [
                "Liên hệ",
                "Gửi bản vẽ và số lượng — nhận báo giá sơ bộ và lịch xưởng phù hợp dự án.",
                "/showroom",
              ],
            ].map(([title, desc, href]) => (
              <Link key={title} href={href} className="bg-paper p-8 transition-colors hover:bg-paper-warm">
                <p className="text-lg [font-family:var(--font-display),serif] text-ink-900">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{desc}</p>
              </Link>
            ))}
          </div>
        </section>
    </PageShell>
  );
}
