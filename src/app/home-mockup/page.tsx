import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ProductTeaserGrid } from "@/components/product-teaser-grid";
import { getSiteUrl } from "@/lib/site-url";
import { getFeaturedProducts } from "@/server/content";

const site = getSiteUrl();

export const metadata: Metadata = {
  title: "Xưởng gia công đèn vải cao cấp · KAHA.VN",
  description:
    "KAHA — xưởng gia công đèn vải cao cấp tại TP.HCM. Sản xuất theo thông số dự án cho khách sạn, F&B, showroom. Báo giá trong 48h.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${site}/home-mockup` },
};

/* ─── Data ─────────────────────────────────────────────── */

const PROOF = [
  { v: "10", suffix: "năm", l: "Kinh nghiệm xưởng", d: "Thành lập 2015 · TP. Hồ Chí Minh" },
  { v: "477", suffix: "+", l: "Mã sản phẩm", d: "Đèn treo · chụp vải · đèn chùm" },
  { v: "48", suffix: "h", l: "Phản hồi RFQ", d: "Từ khi nhận bản vẽ & số lượng" },
  { v: "12", suffix: "tháng", l: "Bảo hành khung", d: "Theo hợp đồng; vải in theo mẫu duyệt" },
];

const CAPABILITIES: Array<[string, string]> = [
  ["Vải bọc", "Linen · Polyester phủ · Organza · In DTF Pantone matching"],
  ["Khung & kết cấu", "Sắt RAL · Inox 304 hairline · Nhôm đúc · Tre định hình"],
  ["Nguồn sáng", "LED COB & SMD · CRI ≥ 90 · CCT 2700–4000K"],
  ["Driver & điều khiển", "DALI / 0–10V · DMX · tích hợp BMS khách sạn"],
  ["Hoàn thiện", "Sơn tĩnh điện RAL · mạ điện · hairline brushed"],
  ["QC & tài liệu", "Serial · IES · PDF song ngữ · mẫu vải lưu 24 tháng"],
];

const PLATES = [
  { n: "01", cap: "CHOCHIN · LINEN TỰ NHIÊN", aspect: "3/4" },
  { n: "02", cap: "IN DTF · PANTONE MATCHING", aspect: "3/4" },
  { n: "03", cap: "KHUNG THÉP · SƠN TĨNH ĐIỆN RAL", aspect: "4/3" },
  { n: "04", cap: "ANDON · BONBORI CHO F&B", aspect: "3/4" },
  { n: "05", cap: "HAIRLINE BRUSHED · INOX 304", aspect: "4/3" },
];

/* ─── Museum plate placeholder ─────────────────────────── */

function Plate({
  n,
  caption,
  aspect = "4/5",
  tone = "paper",
  className = "",
}: {
  n: string;
  caption: string;
  aspect?: string;
  tone?: "paper" | "ink";
  className?: string;
}) {
  const bg = tone === "ink" ? "bg-ink-900" : "bg-paper";
  const labelColor = tone === "ink" ? "text-ink-300" : "text-ink-400";
  const captionColor = tone === "ink" ? "text-ink-300/80" : "text-ink-500";
  const lineColor = tone === "ink" ? "bg-platinum" : "bg-platinum-deep";
  const borderColor = tone === "ink" ? "border-ink-700" : "border-hairline";

  return (
    <div
      className={`relative w-full overflow-hidden border ${borderColor} ${bg} ${className}`}
      style={{ aspectRatio: aspect }}
      aria-label={`Placeholder ảnh ${n} — ${caption}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
        <span className={`font-mono text-[10px] font-medium uppercase tracking-[0.28em] ${labelColor}`}>
          Plate {n}
        </span>
        <div className={`h-px w-10 ${lineColor}`} aria-hidden />
        <span
          className={`max-w-[20ch] text-[10.5px] font-medium uppercase leading-[1.6] tracking-[0.12em] ${captionColor}`}
        >
          {caption}
        </span>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */

/**
 * Homepage mockup v2 — premium editorial redesign.
 * 6 sections, Obsidian design system, noindex.
 */
export default async function HomeMockupPage() {
  const products = await getFeaturedProducts(9);

  return (
    <PageShell mainClassName="flex flex-1 flex-col p-0">

      {/* ─── ① HERO — Editorial split ─────────────────── */}
      <section className="border-b border-hairline">
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[1fr_1fr]">
          {/* Text */}
          <div className="flex flex-col justify-between border-b border-hairline px-6 pb-16 pt-20 md:border-b-0 md:border-r md:px-14 md:pb-28 md:pt-32 lg:px-20 lg:pb-36 lg:pt-40">
            <div>
              <p className="u-eyebrow-lg">
                KAHA · Xưởng gia công đèn vải · Est. 2015
              </p>
              <h1 className="mt-10 font-display text-[clamp(2.75rem,7.2vw,6rem)] leading-[0.98] text-ink-900">
                Đèn vải.
                <br />
                Gia công
                <br />
                <span className="font-display-italic">theo bản vẽ.</span>
              </h1>
              <div className="mt-10 h-px w-14 bg-platinum-deep" aria-hidden />
              <p className="mt-10 max-w-[46ch] text-[15px] leading-[1.85] text-ink-700">
                KAHA sản xuất đèn vải, đèn treo và hệ khung kim loại theo đúng thông số
                dự án — kích thước, Pantone, nguồn sáng, driver dim. Một đầu mối, một
                timeline, từ mẫu thử đến giao hàng loạt cho khách sạn và F&B.
              </p>
            </div>
            <div className="mt-14 flex flex-col gap-8">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/showroom"
                  className="border border-ink-900 bg-ink-900 px-10 py-3.5 text-[12px] font-medium uppercase tracking-[0.14em] text-paper transition-colors duration-200 hover:bg-transparent hover:text-ink-900"
                >
                  Đặt lịch xưởng
                </Link>
                <Link
                  href="/shop"
                  className="border border-ink-900 bg-transparent px-10 py-3.5 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-paper"
                >
                  Xem catalog
                </Link>
              </div>
              <p className="u-caption">
                Phản hồi RFQ 48h · MOQ từ 10 chiếc · Hợp đồng B2B / xuất khẩu
              </p>
            </div>
          </div>

          {/* Plate */}
          <div className="relative bg-paper">
            <div className="h-full min-h-[520px] p-6 md:p-12 lg:p-16">
              <Plate n="01" caption="Chochin · Linen tự nhiên · D40 · LED 2700K" aspect="3/4" className="h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── ② PROOF STRIP — dark ──────────────────────── */}
      <section className="bg-ink-900">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 md:grid-cols-4">
          {PROOF.map((p, i) => (
            <div
              key={p.l}
              className={`flex flex-col items-start gap-3 px-8 py-14 md:px-12 md:py-20 ${
                i < PROOF.length - 1 ? "md:border-r md:border-ink-700" : ""
              } ${i < 2 ? "border-b border-ink-700 md:border-b-0" : ""}`}
            >
              <p className="u-tnum font-mono text-[clamp(2.5rem,4.5vw,3.75rem)] font-normal leading-none text-paper">
                {p.v}
                <span className="ml-1 text-[0.4em] font-medium uppercase tracking-[0.12em] text-ink-300">
                  {p.suffix}
                </span>
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper/70">
                {p.l}
              </p>
              <p className="text-[13px] leading-[1.6] text-ink-300">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ③ MOODWALL — material study ───────────────── */}
      <section className="border-b border-hairline bg-paper-warm px-6 py-24 md:px-12 md:py-32 lg:py-40">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <p className="u-eyebrow">Section 03 — Material study</p>
              <h2 className="mt-8 font-display text-[clamp(2rem,4.8vw,3.75rem)] leading-[1.04] text-ink-900">
                Xưởng gia công
                <br />
                <span className="font-display-italic">đèn vải cao cấp.</span>
              </h2>
            </div>
            <div className="flex items-end">
              <p className="max-w-[52ch] text-[15px] leading-[1.85] text-ink-700">
                Chúng tôi kiểm soát cả ba lớp cấu thành một chiếc đèn — vải, khung kim
                loại và nguồn sáng — trong cùng một xưởng tại Tân Phú, TP.HCM. Không thuê
                ngoài công đoạn cốt lõi, không báo giá ước chừng. Mỗi lô hàng đi kèm
                serial, phiếu QC và mẫu vải lưu 24 tháng.
              </p>
            </div>
          </div>

          {/* Mosaic */}
          <div className="mt-20 grid gap-4 md:gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 lg:row-span-2">
              <Plate n={PLATES[0].n} caption={PLATES[0].cap} aspect="3/4" className="h-full min-h-[420px]" />
            </div>
            <div className="lg:col-span-8">
              <Plate n={PLATES[2].n} caption={PLATES[2].cap} aspect="16/9" />
            </div>
            <div className="lg:col-span-4">
              <Plate n={PLATES[1].n} caption={PLATES[1].cap} aspect="4/3" />
            </div>
            <div className="lg:col-span-4">
              <Plate n={PLATES[3].n} caption={PLATES[3].cap} aspect="4/3" />
            </div>
          </div>

          {/* Caption strip */}
          <div className="mt-10 border-t border-hairline pt-6">
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
              {PLATES.slice(0, 4).map((p) => (
                <div key={p.n} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-platinum-deep">
                    {p.n}
                  </span>
                  <span className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-500">
                    {p.cap}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ④ CAPABILITIES — precision table ──────────── */}
      <section className="border-b border-hairline bg-paper px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="u-eyebrow">Section 04 — Capabilities</p>
            <h2 className="mt-8 font-display text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.05] text-ink-900">
              Năng lực sản xuất
              <br />
              <span className="font-display-italic">khép kín.</span>
            </h2>
            <div className="mt-8 h-px w-12 bg-platinum-deep" aria-hidden />
            <p className="mt-8 max-w-[38ch] text-[15px] leading-[1.8] text-ink-700">
              Bạn liên hệ một đầu mối, nhận một bộ hồ sơ, kiểm soát một timeline. Không
              trung gian, không đẩy trách nhiệm qua các bên phụ.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/journal"
                className="border border-ink-900 bg-transparent px-7 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-paper"
              >
                Đọc spec kỹ thuật
              </Link>
            </div>
          </div>
          <dl className="divide-y divide-hairline border-y border-hairline">
            {CAPABILITIES.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[minmax(120px,180px)_1fr] gap-6 py-7 md:gap-10 md:py-8"
              >
                <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-500">
                  {k}
                </dt>
                <dd className="text-[15px] leading-[1.65] text-ink-800">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── ⑤ CATALOG ─────────────────────────────────── */}
      <section className="border-b border-hairline bg-paper-warm px-6 pt-24 md:px-12 md:pt-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="u-eyebrow">Section 05 — In stock</p>
              <h2 className="mt-8 font-display text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.05] text-ink-900">
                Catalog mẫu — <span className="font-display-italic">gia công theo thông số.</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="self-start border-b border-ink-900 pb-1 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-900 transition-opacity hover:opacity-60 md:self-end"
            >
              Xem toàn bộ catalog →
            </Link>
          </div>
        </div>
        {products.length > 0 ? (
          <div className="-mx-6 md:-mx-12">
            <ProductTeaserGrid items={products} heading="" />
          </div>
        ) : (
          <div className="mt-16 border border-hairline px-8 py-20 text-center">
            <p className="u-eyebrow">Empty state</p>
            <p className="mt-4 text-sm text-ink-600">
              Chưa có sản phẩm trong DB — chạy import XML để lấp lưới ảnh thật.
            </p>
          </div>
        )}
      </section>

      {/* ─── ⑥ FINAL — Editorial closing ────────────────── */}
      <section className="bg-ink-900 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1400px]">
          <p className="u-eyebrow text-paper/60">Bắt đầu dự án</p>
          <h2 className="mt-10 max-w-[22ch] font-display text-[clamp(2.25rem,5.2vw,4.5rem)] leading-[1.05] text-paper">
            Gửi brief — báo giá
            <br />
            <span className="font-display-italic">trong 48 giờ.</span>
          </h2>
          <div className="mt-12 h-px w-14 bg-platinum" aria-hidden />
          <p className="mt-10 max-w-[48ch] text-[15px] leading-[1.85] text-ink-300">
            Chỉ cần moodboard, bản vẽ sơ bộ hoặc tên đèn tham chiếu. Không cần hồ sơ
            hoàn chỉnh để nhận tư vấn đầu tiên.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/showroom"
              className="border border-paper bg-paper px-10 py-3.5 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-900 transition-colors duration-200 hover:bg-transparent hover:text-paper"
            >
              Đặt lịch xưởng
            </Link>
            <Link
              href="/shop"
              className="border border-paper/30 bg-transparent px-10 py-3.5 text-[12px] font-medium uppercase tracking-[0.14em] text-paper transition-colors duration-200 hover:border-paper"
            >
              Xem catalog
            </Link>
          </div>

          {/* Contact grid */}
          <div className="mt-24 grid gap-10 border-t border-ink-700 pt-14 md:grid-cols-4 md:gap-8">
            <div>
              <p className="u-eyebrow text-paper/50">Hotline / Zalo</p>
              <p className="mt-4 font-display text-[22px] text-paper">090 515 1701</p>
              <p className="mt-2 text-[12.5px] text-ink-300">8:00 – 21:00 mỗi ngày</p>
            </div>
            <div>
              <p className="u-eyebrow text-paper/50">Email RFQ</p>
              <p className="mt-4 font-display text-[22px] text-paper">hi@kaha.vn</p>
              <p className="mt-2 text-[12.5px] text-ink-300">Kèm bản vẽ &amp; số lượng</p>
            </div>
            <div>
              <p className="u-eyebrow text-paper/50">Xưởng &amp; Showroom</p>
              <p className="mt-4 text-[14px] leading-[1.65] text-paper">
                262/1/93 Phan Anh, P. Phú Thạnh
                <br />
                Tân Phú, TP. Hồ Chí Minh
              </p>
            </div>
            <div>
              <p className="u-eyebrow text-paper/50">Xuất khẩu</p>
              <p className="mt-4 text-[14px] leading-[1.65] text-paper">
                CO/CQ · Incoterms theo hợp đồng
                <br />
                Kiện gỗ + PE foam
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
