import type { Metadata } from "next";
import Link from "next/link";
import { ProductTeaserGrid } from "@/components/product-teaser-grid";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/site-url";
import { getFeaturedProducts } from "@/server/content";

const site = getSiteUrl();

export const metadata: Metadata = {
  title: "Home mockup · KAHA.VN",
  description: "Bản xem thử homepage B2B — không index.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${site}/home-mockup` },
};

const STATS = [
  { v: "477+", l: "SKU publish", d: "Đèn treo, chụp, chùm — cập nhật theo import." },
  { v: "12", l: "Tháng bảo hành", d: "Khung sản xuất KAHA; điều khoản theo hợp đồng dự án." },
  { v: "48h", l: "Mục tiêu phản hồi", d: "Báo giá sơ bộ sau khi nhận đủ bản vẽ & số lượng." },
];

const SCOPE = [
  {
    t: "Khách sạn & resort",
    p: "Hành lang, sảnh, phòng tiệc: đèn vải in, khung sắt sơn tĩnh điện, dim theo master lighting. Bản vẽ LOD 300 phối hợp QS.",
  },
  {
    t: "Nhà hàng & F&B",
    p: "Chochin, andon, bonbori — đồng bộ nhận diện chuỗi. MOQ gia công và timeline sản xuất thống nhất trên toàn cửa hàng.",
  },
  {
    t: "Showroom & bán lẻ cao cấp",
    p: "Trưng bày theo storyboard; packshot và catalogue in song ngữ khi cần xuất khẩu mẫu.",
  },
  {
    t: "Sự kiện & không gian tạm",
    p: "Lắp dựng nhanh, kiểm định an toàn treo; thu hồi và cất kho theo batch cho tour roadshow.",
  },
];

const STEPS = [
  { n: "01", t: "Brief & hiện trường", d: "Nhận moodboard, lux level, CA/CE nếu có. Khảo sát ảnh 360 hoặc bản vẽ kiến trúc." },
  { n: "02", t: "Thuyết minh kỹ thuật", d: "Chốt vật liệu vải, nguồn sáng, driver, tiêu chuẩn chống chói. Bản vẽ shop drawing nội bộ." },
  { n: "03", t: "Mẫu & duyệt", d: "Mẫu đơn / mẫu nhỏ dây chuyền trước khi chạy hàng loạt. Checklist QC ký nhận." },
  { n: "04", t: "Sản xuất & bàn giao", d: "Đóng gói kiện, chứng từ CO nếu xuất; hỗ trợ hiệu chỉnh tại công trình trong phạm vi hợp đồng." },
];

const FAQ = [
  {
    q: "MOQ gia công in logo trên đèn vải?",
    a: "Theo từng dòng đèn và mùa vải; thông thường từ 20 chiếc / mã màu. Số chính xác nằm trong báo giá sau khi có file logo vector và Pantone.",
  },
  {
    q: "Có hỗ trợ thiết kế ánh sáng không?",
    a: "KAHA tập trung sản xuất & hoàn thiện đèn theo bản vẽ chủ đầu tư hoặc đơn vị lighting design. Có thể phối hợp workshop với đối tác LD bạn chỉ định.",
  },
  {
    q: "Thời gian giao hàng trung bình?",
    a: "Mẫu duyệt: 5–10 ngày làm việc. Đơn hàng loạt: 15–35 ngày tùy số lượng và độ phức tạp in/thêu. Giao GHN/GHTK hoặc xe chuyên dụng theo hợp đồng.",
  },
  {
    q: "Thanh toán & hợp đồng B2B?",
    a: "Đặt cọc theo tiến độ cố định; hóa đơn VAT; điều khoản bảo mật bản vẽ và mẫu độc quyền có thể ký NDA riêng.",
  },
];

/**
 * Mockup homepage dày hơn — editorial B2B, Obsidian / platinum (không gradient, không emoji).
 */
export default async function HomeMockupPage() {
  const products = await getFeaturedProducts(9);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper-warm">
      <SiteHeader />

      <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col">
        {/* Hero — editorial split */}
        <section className="border-b border-hairline">
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
            <div className="flex flex-col justify-between border-b border-hairline px-5 py-16 md:border-b-0 md:border-r md:px-10 md:py-24 lg:px-14 lg:py-28">
              <div>
                <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
                  KAHA · Gia công đèn trang trí · B2B
                </p>
                <h1 className="mt-6 max-w-[16ch] text-balance text-[clamp(2.25rem,5.5vw,3.75rem)] font-normal leading-[1.06] tracking-tight text-ink-900 [font-family:var(--font-display),serif]">
                  Ánh sáng theo bản vẽ — không theo template sẵn.
                </h1>
                <div className="mt-8 h-px w-20 bg-platinum-deep" aria-hidden />
                <p className="mt-8 max-w-xl text-base leading-[1.75] text-ink-600 md:text-[17px]">
                  Chúng tôi sản xuất đèn vải, đèn treo và hệ khung kim loại theo thông số dự án: kích thước,
                  nguồn sáng, dim, hoàn thiện bề mặt. Trang này minh họa cấu trúc homepage khi chuyển từ
                  WordPress sang Next — nhiều lớp nội dung, ít “tiếng marketing”, nhiều thông tin để chủ
                  đầu tư và đơn vị mua hàng đối chiếu nhanh.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-3 md:mt-16">
                <Link
                  href="/shop"
                  className="border border-ink-900 bg-ink-900 px-7 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-200 hover:bg-transparent hover:text-ink-900"
                >
                  Catalog shop
                </Link>
                <Link
                  href="/journal"
                  className="border border-hairline bg-paper px-7 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors duration-200 hover:border-ink-300 hover:text-ink-900"
                >
                  Journal kỹ thuật
                </Link>
                <Link
                  href="/showroom"
                  className="border border-hairline bg-paper px-7 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors duration-200 hover:border-ink-300 hover:text-ink-900"
                >
                  Showroom
                </Link>
              </div>
            </div>
            <div className="flex min-h-[320px] flex-col justify-between bg-paper px-5 py-12 md:min-h-[420px] md:px-10 md:py-16 lg:px-14">
              <div className="relative flex-1 border border-hairline bg-hairline/30">
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                  <p className="max-w-xs text-[13px] leading-relaxed text-ink-500">
                    Khối hero ảnh 4:5 hoặc 16:9 — ảnh R2 crop editorial, không text watermark trên ảnh.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-[12px] leading-relaxed text-ink-500">
                Lighting specification · DALI / 0–10V theo hợp đồng · IES file cung cấp khi dự án yêu cầu.
              </p>
            </div>
          </div>

          <div className="border-t border-hairline bg-paper">
            <div className="mx-auto grid max-w-[1600px] divide-y divide-hairline md:grid-cols-3 md:divide-x md:divide-y-0 md:divide-hairline">
              {STATS.map((s) => (
                <div key={s.l} className="px-5 py-8 md:px-10 md:py-10">
                  <p className="font-mono text-[clamp(1.75rem,3vw,2.25rem)] font-medium leading-none text-ink-900">
                    {s.v}
                  </p>
                  <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-500">
                    {s.l}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Phạm vi */}
        <section className="border-b border-hairline px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
              Phạm vi dự án
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(1.5rem,2.8vw,2.25rem)] font-semibold leading-snug text-ink-900 [font-family:var(--font-display),serif]">
              Một đối tác sản xuất cho nhiều loại hình không gian — cùng một quy trình báo giá và QC.
            </h2>
            <div className="mt-14 grid gap-px bg-hairline sm:grid-cols-2">
              {SCOPE.map((x) => (
                <article key={x.t} className="bg-paper p-8 md:p-10">
                  <h3 className="text-lg font-semibold text-ink-900 [font-family:var(--font-display),serif]">
                    {x.t}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-600 md:text-[15px]">{x.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Quy trình */}
        <section className="border-b border-hairline bg-paper px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
              Quy trình làm việc
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-ink-900 [font-family:var(--font-display),serif]">
              Bốn bước chuẩn hóa — có thể map vào hợp đồng mẫu.
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
              {STEPS.map((s) => (
                <li key={s.n} className="border-t border-hairline pt-8 md:pt-10">
                  <span className="font-mono text-sm text-platinum-deep">{s.n}</span>
                  <h3 className="mt-3 text-lg font-semibold text-ink-900">{s.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600 md:text-[15px]">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Ba trụ + dịch vụ kèm */}
        <section className="border-b border-hairline px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
              Nguyên tắc hiển thị
            </p>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-snug text-ink-900 [font-family:var(--font-display),serif]">
              Premium so với sườn catalog: một accent kim loại lạnh, khoảng trống có chủ đích, chữ làm trục.
            </h2>
            <div className="mt-14 grid gap-px bg-hairline md:grid-cols-3">
              {[
                {
                  k: "01",
                  t: "Typography",
                  d: "Playfair cho display, Inter cho body. Caption 13px uppercase cố định — hierarchy rõ trước khi cuộn tới hình.",
                },
                {
                  k: "02",
                  t: "Viền & lớp",
                  d: "Chỉ hairline 1px; không đổ bóng, không shimmer skeleton. Thẻ sản phẩm phẳng, hover chỉ đổi viền và scale ảnh nhẹ.",
                },
                {
                  k: "03",
                  t: "B2B first",
                  d: "Ưu tiên báo giá, spec sheet PDF, showroom booking. Giỏ hàng không chen vào hero; CTA thứ cấp dạng ghost.",
                },
              ].map((x) => (
                <article key={x.k} className="bg-paper p-8 md:p-10 lg:p-12">
                  <p className="font-mono text-xs text-platinum-deep">{x.k}</p>
                  <h3 className="mt-4 text-lg font-semibold text-ink-900 [font-family:var(--font-display),serif]">
                    {x.t}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{x.d}</p>
                </article>
              ))}
            </div>

            <div className="mt-16 border border-hairline bg-paper-warm px-6 py-8 md:px-10 md:py-10">
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-ink-500">
                Dịch vụ kèm theo sản xuất
              </p>
              <ul className="mt-6 grid gap-4 text-sm leading-relaxed text-ink-700 md:grid-cols-2 md:gap-x-12">
                <li className="border-l-2 border-platinum-deep pl-4">
                  Packshot nền trung tính và file TIFF cho đấu thầu / catalogue in.
                </li>
                <li className="border-l-2 border-platinum-deep pl-4">
                  Gắn nhãn serial + phiếu QC theo lô; lưu mẫu vải dư trong kho mẫu 24 tháng.
                </li>
                <li className="border-l-2 border-platinum-deep pl-4">
                  Hướng dẫn treo & moment siết bulong — tài liệu PDF song ngữ Việt / English.
                </li>
                <li className="border-l-2 border-platinum-deep pl-4">
                  Hiệu chỉnh tại công trình trong bán kính TP.HCM theo gói SLA (chi tiết trong báo giá).
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Trích dẫn + chính sách rút gọn */}
        <section className="border-b border-hairline px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <blockquote className="text-[clamp(1.35rem,2.4vw,1.75rem)] font-normal leading-snug text-ink-900 [font-family:var(--font-display),serif]">
                “Chúng tôi không bán ‘mẫu có sẵn’ như retail thuần — chúng tôi bán khả năng lặp lại cùng một
                chất lượng trên hàng trăm chiếc cho cùng một thương hiệu F&B hoặc khách sạn.”
              </blockquote>
              <p className="mt-6 text-[13px] uppercase tracking-[0.08em] text-ink-500">
                Ghi chú mockup — thay quote thật từ chủ dự án khi có case study.
              </p>
            </div>
            <div className="border-t border-hairline pt-10 lg:col-span-7 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
              <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
                Chính sách rút gọn (đối chiếu WP)
              </p>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-ink-700 md:text-[15px]">
                <li>Bảo hành khung và hoàn thiện sơn tĩnh điện theo hạng mục hợp đồng; vải in theo tiêu chuẩn đã duyệt mẫu.</li>
                <li>Đổi trả lỗi kỹ thuật sản xuất trong cửa sổ 30 ngày kể từ biên bản nghiệm thu (trừ hư hỏng do lắp đặt sai).</li>
                <li>Tùy chỉnh kích thước / Pantone / in logo: báo giá theo bậc MOQ; không phát sinh khi đã ký phụ lục.</li>
                <li>Vận chuyển: đóng kiện gỗ + PE foam; cửa khẩu khai báo đầy đủ theo Incoterms thỏa thuận.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-hairline bg-paper px-5 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
              Câu hỏi thường gặp
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-ink-900 [font-family:var(--font-display),serif]">
              Trước khi gửi RFQ — đọc nhanh 4 ý.
            </h2>
            <div className="mt-10 space-y-0 border border-hairline bg-paper-warm">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-hairline last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-ink-900 transition-colors hover:bg-paper md:px-6 md:py-5 md:text-[15px]">
                    <span>{f.q}</span>
                    <span className="shrink-0 text-platinum-deep transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="border-t border-hairline bg-paper px-5 py-4 text-sm leading-relaxed text-ink-600 md:px-6 md:text-[15px]">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Liên hệ ngang */}
        <section className="border-b border-hairline px-5 py-14 md:px-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-12">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-ink-500">Hotline</p>
              <p className="mt-2 text-lg text-ink-900">090.5151.701</p>
              <p className="mt-1 text-sm text-ink-600">Zalo / WhatsApp — 8:00–21:00</p>
            </div>
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-ink-500">Email</p>
              <p className="mt-2 text-lg text-ink-900">hi@kaha.vn</p>
              <p className="mt-1 text-sm text-ink-600">RFQ kèm bản vẽ & deadline</p>
            </div>
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-ink-500">Xưởng & showroom</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-700">
                262/1/93 Phan Anh, Phường Phú Thạnh, Tân Phú, TP.HCM — hẹn lịch qua /showroom.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex border border-ink-900 px-6 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-paper md:self-center"
            >
              Gửi yêu cầu qua shop
            </Link>
          </div>
        </section>

        {/* Sản phẩm thật từ DB */}
        {products.length > 0 ? (
          <ProductTeaserGrid items={products} heading="Sản phẩm gợi ý từ catalog" />
        ) : (
          <section className="border-t border-hairline px-5 py-16 text-center text-sm text-ink-600 md:px-12">
            Chưa có sản phẩm trong DB — chạy import XML để lấp lưới ảnh thật tại đây.
          </section>
        )}

        {/* CTA cuối */}
        <section className="px-5 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-3xl border border-hairline bg-paper px-8 py-12 text-center md:px-14 md:py-16">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">
              Bước tiếp theo
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-ink-900 [font-family:var(--font-display),serif]">
              Chốt mockup này → gộp block vào trang chủ `/` và đồng bộ copy với pháp chế / marketing.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              Route vẫn <span className="font-mono text-ink-700">/home-mockup</span>, noindex. Khi go-live có thể xóa route
              hoặc redirect 301 về `/` nếu không cần lưu bản so sánh.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="border border-hairline px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900"
              >
                Về trang chủ hiện tại
              </Link>
              <Link
                href="/lookbook"
                className="border border-ink-900 bg-ink-900 px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-paper transition-colors hover:bg-transparent hover:text-ink-900"
              >
                Lookbook
              </Link>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
