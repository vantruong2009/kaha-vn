import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site-url";

const site = getSiteUrl();

export const metadata: Metadata = {
  title: "Home mockup (3 boards) · KAHA.VN",
  description: "Bản xem thử layout premium — không index.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${site}/home-mockup` },
};

/**
 * 3 “bảng” homepage — hướng editorial / luxury (Obsidian + platinum).
 * Xem tại /home-mockup. Không thay thế trang / cho tới khi chốt.
 */
export default function HomeMockupPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper-warm">
      <SiteHeader />

      <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
        {/* —— Bảng 1: Hero “catalogue ra mắt” —— */}
        <section className="relative flex min-h-[min(92vh,900px)] flex-col justify-end border-b border-hairline px-5 pb-20 pt-32 md:px-12 md:pb-28 md:pt-40">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, oklch(0.12 0 0) 0 1px, transparent 1px 72px)",
            }}
          />
          <p className="relative text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
            KAHA · Gia công đèn trang trí
          </p>
          <h1
            className="relative mt-5 max-w-[14ch] text-balance text-[clamp(2.5rem,7vw,4.5rem)] font-normal leading-[1.05] tracking-tight text-ink-900 [font-family:var(--font-display),serif]"
          >
            Không gian
            <span className="block text-ink-700">im lặng.</span>
            <span className="mt-2 block text-ink-900">Ánh sáng nói.</span>
          </h1>
          <div className="relative mt-10 h-px max-w-md bg-gradient-to-r from-platinum-deep via-platinum to-transparent" />
          <p className="relative mt-8 max-w-lg text-base leading-relaxed text-ink-600 md:text-lg">
            B2B · khách sạn · nhà hàng · resort. Khung sắt, vải in, hoàn thiện
            theo bản vẽ — không xếp chồng banner đỏ; một luồng thị giác, một
            chất liệu kim loại lạnh.
          </p>
          <div className="relative mt-10 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="border border-ink-900 bg-ink-900 px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-200 hover:bg-transparent hover:text-ink-900"
            >
              Vào shop
            </Link>
            <Link
              href="/showroom"
              className="border border-hairline bg-paper px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors duration-200 hover:border-ink-300 hover:text-ink-900"
            >
              Showroom
            </Link>
          </div>
        </section>

        {/* —— Bảng 2: Tam liệt “chứng minh tĩnh” —— */}
        <section className="border-b border-hairline px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
              Tại sao premium hơn “sườn catalog”
            </p>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-snug text-ink-900 [font-family:var(--font-display),serif]">
              Ba trụ — không slider, không đếm giả.
            </h2>
            <div className="mt-14 grid gap-px bg-hairline md:grid-cols-3">
              {[
                {
                  k: "01",
                  t: "Một accent",
                  d: "Platinum / hairline thay vì nhiều màu khuyến mãi. Mắt nghỉ trước khi đọc.",
                },
                {
                  k: "02",
                  t: "Khoảng cách",
                  d: "Section dày 120px desktop — longdenviet thường nhồi block; KAHA nhường không khí cho sản phẩm.",
                },
                {
                  k: "03",
                  t: "Chữ là hero",
                  d: "Playfair + Inter, tracking caption cố định. Hình ảnh phụ, không chen headline.",
                },
              ].map((x) => (
                <article
                  key={x.k}
                  className="bg-paper p-8 md:p-10 lg:p-12"
                >
                  <p className="font-mono text-xs text-platinum-deep">{x.k}</p>
                  <h3 className="mt-4 text-lg font-semibold text-ink-900 [font-family:var(--font-display),serif]">
                    {x.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">
                    {x.d}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* —— Bảng 3: Lưới ảnh im lặng + CTA B2B —— */}
        <section className="px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
                  Sản phẩm chọn
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-ink-900 [font-family:var(--font-display),serif]">
                  Tile lớn, viền tóc, không price tag la hét.
                </h2>
              </div>
              <Link
                href="/shop"
                className="shrink-0 self-start border-b border-platinum-deep pb-1 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors hover:text-ink-900 md:self-auto"
              >
                Xem toàn bộ →
              </Link>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
              {["Chochin / đèn treo", "Khách sạn", "Dự án"].map((label) => (
                <div
                  key={label}
                  className="group relative aspect-[4/5] overflow-hidden border border-hairline bg-paper"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink-900/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <div className="flex h-full flex-col justify-end p-6">
                    <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-ink-500">
                      {label}
                    </p>
                    <p className="mt-2 text-sm text-ink-700">
                      Placeholder ảnh — thay bằng ảnh R2 crop editorial.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-16 max-w-2xl border border-hairline bg-paper px-8 py-10 text-center md:px-12 md:py-14">
              <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
                B2B
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink-700">
                Báo giá theo bản vẽ — form ngắn, phản hồi có SLA. Không giỏ
                hàng chen vào hero.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-block border border-ink-900 px-10 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-paper"
              >
                Shop & báo giá
              </Link>
            </div>
          </div>
        </section>

        <p className="border-t border-hairline px-5 py-6 text-center text-xs text-ink-500 md:px-12">
          Mockup nội bộ — truy cập <span className="font-mono">/home-mockup</span>.
          Chốt xong có thể gộp nội dung vào <span className="font-mono">/</span>.
        </p>
      </div>

      <SiteFooter />
    </div>
  );
}
