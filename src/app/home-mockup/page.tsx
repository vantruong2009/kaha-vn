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
  { v: "10+", l: "Năm kinh nghiệm", d: "Xưởng gia công đèn vải tại TP.HCM" },
  { v: "477+", l: "Mã sản phẩm", d: "Đèn treo, chụp vải, đèn chùm" },
  { v: "48h", l: "Phản hồi RFQ", d: "Kể từ khi nhận đủ bản vẽ & số lượng" },
  { v: "12T", l: "Bảo hành khung", d: "Theo hợp đồng; vải in theo mẫu duyệt" },
];

const MATERIALS = [
  {
    cat: "Vải bọc",
    items: [
      "Linen tự nhiên — texture mịn, giữ màu tốt dưới UV đèn trong nhà",
      "Polyester phủ lớp — chống ẩm, phù hợp không gian F&B và SPA",
      "Lưới organza & vải dệt thoi — tạo hiệu ứng khuếch tán mềm",
      "In kỹ thuật số trực tiếp trên vải (DTF) — Pantone matching theo mẫu",
    ],
  },
  {
    cat: "Khung & kết cấu",
    items: [
      "Sắt ống & thép hộp sơn tĩnh điện — RAL theo bảng màu dự án",
      "Inox 304 đánh bóng hoặc hairline — khu vực ẩm, coastal resort",
      "Nhôm định hình đúc — giảm tải cho hệ treo trần thạch cao",
      "Tre định hình + khung thép ẩn — phong cách Đông Á, Japandi",
    ],
  },
  {
    cat: "Nguồn sáng",
    items: [
      "LED COB & SMD CRI ≥ 90 — màu sắc trung thực, tiết kiệm điện",
      "Driver DALI / 0–10V — tích hợp hệ BMS khách sạn & showroom",
      "CCT 2700K – 4000K theo từng vùng chức năng không gian",
      "IES file cung cấp khi dự án yêu cầu tính toán AGI32 / DIALux",
    ],
  },
];

const SCOPE = [
  {
    t: "Khách sạn & Resort",
    d: "Lobby, hành lang, phòng tiệc. Dim theo master lighting DALI. Bản vẽ shop drawing LOD 300 phối hợp QS và MEP.",
    tag: "Contract lighting",
  },
  {
    t: "Nhà hàng & F&B",
    d: "Chochin, andon, bonbori đồng bộ nhận diện chuỗi. MOQ linh hoạt cho chuỗi 5–100 mặt bằng.",
    tag: "F&B chain",
  },
  {
    t: "Showroom & Retail cao cấp",
    d: "Đèn trưng bày theo storyboard. Packshot + catalogue in song ngữ Việt/English khi cần xuất khẩu mẫu.",
    tag: "Visual merchandising",
  },
  {
    t: "Sự kiện & không gian tạm",
    d: "Lắp dựng nhanh, kiểm định an toàn treo, thu hồi và cất kho theo batch cho tour roadshow toàn quốc.",
    tag: "Event & pop-up",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Brief & khảo sát",
    d: "Nhận moodboard, lux level, bản vẽ kiến trúc hoặc ảnh 360. Xác định CA/CE nếu xuất khẩu. Họp kỹ thuật online/offline.",
  },
  {
    n: "02",
    t: "Thuyết minh & shop drawing",
    d: "Chốt vật liệu vải, khung, nguồn sáng, driver. Bản vẽ nội bộ có kích thước gia công, điểm đấu nối điện.",
  },
  {
    n: "03",
    t: "Mẫu & duyệt QC",
    d: "Mẫu đơn hoặc mini-batch trước khi chạy loạt. Checklist QC ký nhận. Chụp packshot lưu hồ sơ dự án.",
  },
  {
    n: "04",
    t: "Sản xuất & bàn giao",
    d: "Đóng kiện gỗ + PE foam. Chứng từ CO/CQ nếu xuất. Hỗ trợ hiệu chỉnh tại công trình TP.HCM theo SLA.",
  },
];

const WHY = [
  {
    t: "Tất cả dưới một mái xưởng",
    d: "Cắt vải, may, in DTF, hàn khung, sơn tĩnh điện, lắp nguồn sáng — không thuê ngoài công đoạn cốt lõi. Kiểm soát chất lượng từ nguyên liệu đến thành phẩm.",
  },
  {
    t: "MOQ thực tế, timeline rõ ràng",
    d: "Đặt hàng từ 10 chiếc / mã màu cho mẫu thử. Lịch sản xuất cập nhật tuần. Không báo giao 'khoảng' — có ngày cụ thể trong hợp đồng.",
  },
  {
    t: "Hồ sơ kỹ thuật đầy đủ",
    d: "Mỗi lô hàng kèm phiếu QC, serial gắn sản phẩm, lưu mẫu vải tại kho 24 tháng. IES file, PDF hướng dẫn lắp song ngữ khi cần.",
  },
];

const FAQ = [
  {
    q: "MOQ gia công in logo / Pantone riêng?",
    a: "Từ 20 chiếc / mã màu cho vải in DTF. Số chính xác tùy dòng đèn và độ phức tạp file. Gửi logo vector + Pantone để nhận báo giá lô nhỏ.",
  },
  {
    q: "Thời gian giao hàng trung bình?",
    a: "Mẫu duyệt: 5–10 ngày làm việc. Đơn hàng loạt: 15–35 ngày tùy số lượng và công đoạn in/thêu. Giao GHN, GHTK hoặc xe chuyên dụng theo hợp đồng.",
  },
  {
    q: "Có hỗ trợ thiết kế ánh sáng không?",
    a: "KAHA tập trung sản xuất và hoàn thiện đèn theo bản vẽ chủ đầu tư hoặc đơn vị lighting design. Có thể phối hợp workshop với LD partner bạn chỉ định.",
  },
  {
    q: "Hợp đồng B2B, bảo mật mẫu?",
    a: "Đặt cọc theo tiến độ cố định. Hóa đơn VAT đầy đủ. Điều khoản bảo mật bản vẽ và mẫu độc quyền có thể ký NDA riêng khi cần.",
  },
  {
    q: "Xuất khẩu sang thị trường nước ngoài?",
    a: "Có chứng từ CO/CQ, đóng gói xuất khẩu tiêu chuẩn. Đã cung cấp cho dự án tại Singapore, Nhật và châu Âu qua đối tác B2B.",
  },
];

/* ─── Page ──────────────────────────────────────────────── */

/**
 * Homepage mockup — "gia công đèn vải cao cấp" B2B
 * Bố cục logic 10 section, Obsidian design system, noindex.
 */
export default async function HomeMockupPage() {
  const products = await getFeaturedProducts(9);

  return (
    <PageShell mainClassName="flex flex-1 flex-col p-0">

        {/* ① HERO — Editorial split, identity statement */}
        <section className="border-b border-hairline">
          <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[52%_48%]">
            {/* Text column */}
            <div className="flex flex-col justify-between border-b border-hairline px-5 py-16 md:border-b-0 md:border-r md:px-12 md:py-24 lg:px-16 lg:py-28">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-500">
                  KAHA · Xưởng sản xuất · Hồ Chí Minh, Việt Nam
                </p>
                <h1 className="mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.01em] text-ink-900 [font-family:var(--font-display),serif]">
                  Gia công đèn vải
                  <br />
                  cao cấp theo bản vẽ
                  <br />
                  — không theo template.
                </h1>
                <div className="mt-8 h-px w-16 bg-platinum-deep" aria-hidden />
                <p className="mt-8 max-w-lg text-[16px] leading-[1.8] text-ink-600">
                  Chúng tôi sản xuất đèn vải, đèn treo và hệ khung kim loại theo đúng thông số dự án —
                  kích thước, màu vải Pantone, nguồn sáng, driver dim. Từ 1 mẫu thử đến cả nghìn chiếc
                  cho chuỗi khách sạn và F&B.
                </p>
              </div>
              <div className="mt-12 flex flex-wrap gap-3 md:mt-16">
                <Link
                  href="/showroom"
                  className="border border-ink-900 bg-ink-900 px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-200 hover:bg-transparent hover:text-ink-900"
                >
                  Đặt lịch xưởng
                </Link>
                <Link
                  href="/shop"
                  className="border border-hairline bg-paper px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors duration-200 hover:border-ink-400 hover:text-ink-900"
                >
                  Xem catalog
                </Link>
                <Link
                  href="/journal"
                  className="border border-hairline bg-paper px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors duration-200 hover:border-ink-400 hover:text-ink-900"
                >
                  Kỹ thuật &amp; vật liệu
                </Link>
              </div>
            </div>
            {/* Image column */}
            <div className="relative min-h-[360px] bg-paper md:min-h-[520px]">
              <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
                <div className="flex-1 border border-hairline bg-hairline/20">
                  <div className="flex h-full items-center justify-center p-10 text-center">
                    <p className="max-w-[22ch] text-[13px] leading-relaxed text-ink-400">
                      Ảnh editorial 4:5 — đèn vải chụp trên nền studio trắng hoặc in-situ tại công trình.
                      Nguồn R2, chưa import.
                    </p>
                  </div>
                </div>
                <p className="mt-6 text-[12px] leading-relaxed text-ink-500">
                  Ví dụ: Chochin D40cm · Linen thiên nhiên · LED 2700K · Driver DALI
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ② PROOF BAR — 4 chỉ số tin cậy */}
        <section className="border-b border-hairline bg-paper">
          <div className="mx-auto grid max-w-[1600px] divide-y divide-hairline sm:grid-cols-2 sm:divide-y-0 md:grid-cols-4 md:divide-x">
            {PROOF.map((p) => (
              <div key={p.l} className="px-8 py-8 md:px-10 md:py-10">
                <p className="font-mono text-[clamp(1.75rem,2.8vw,2.5rem)] font-medium leading-none text-ink-900">
                  {p.v}
                </p>
                <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-ink-500">
                  {p.l}
                </p>
                <p className="mt-2 text-[13px] leading-snug text-ink-600">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ③ NĂNG LỰC CỐT LÕI — editorial 2-col, dark background */}
        <section className="border-b border-hairline bg-ink-900 px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-300/60">
                Năng lực sản xuất
              </p>
              <h2 className="mt-5 text-[clamp(1.75rem,3.2vw,2.75rem)] font-normal leading-[1.15] text-paper [font-family:var(--font-display),serif]">
                Xưởng khép kín — từ vải thô đến đèn hoàn thiện.
              </h2>
              <div className="mt-6 h-px w-12 bg-platinum" aria-hidden />
              <p className="mt-7 text-[15px] leading-[1.85] text-ink-300">
                KAHA không thuê ngoài công đoạn cốt lõi. Cắt vải, may, in DTF kỹ thuật số, hàn khung,
                sơn tĩnh điện, lắp driver và nguồn sáng — tất cả trong cùng một xưởng tại Tân Phú, TP.HCM.
                Điều đó có nghĩa là bạn liên hệ một đầu mối, nhận một bộ hồ sơ, kiểm soát một timeline.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <ul className="space-y-0 border border-ink-700">
                {[
                  ["Vải", "Linen, polyester, organza — in DTF Pantone matching"],
                  ["Khung", "Sắt / inox 304 / nhôm đúc / tre định hình"],
                  ["Nguồn sáng", "LED COB & SMD CRI ≥ 90 · DALI / 0–10V driver"],
                  ["Hoàn thiện", "Sơn tĩnh điện RAL · mạ điện · hairline brushed"],
                  ["QC & tài liệu", "Serial gắn sản phẩm · IES · PDF song ngữ"],
                  ["Xuất khẩu", "CO/CQ · Incoterms theo thỏa thuận · kiện gỗ PE"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="grid grid-cols-[120px_1fr] border-b border-ink-700 last:border-b-0"
                  >
                    <span className="border-r border-ink-700 px-5 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-300/70">
                      {k}
                    </span>
                    <span className="px-5 py-4 text-[14px] leading-snug text-ink-300">
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ④ CATALOG — Sản phẩm từ DB */}
        {products.length > 0 ? (
          <ProductTeaserGrid items={products} heading="Catalog mẫu — gia công theo thông số" />
        ) : (
          <section className="border-b border-hairline px-5 py-20 text-center md:px-12">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-500">Catalog</p>
            <p className="mt-4 text-sm text-ink-600">
              Chưa có sản phẩm trong DB — chạy import XML để lấp lưới ảnh thật tại đây.
            </p>
          </section>
        )}

        {/* ⑤ VẬT LIỆU — 3 cột: Vải / Khung / Nguồn sáng */}
        <section className="border-b border-hairline px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-500">
              Nguyên liệu & vật liệu sản xuất
            </p>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,2.8vw,2.25rem)] font-normal leading-snug text-ink-900 [font-family:var(--font-display),serif]">
              Ba lớp cấu thành chất lượng — vải, khung và ánh sáng.
            </h2>
            <div className="mt-14 grid gap-px bg-hairline md:grid-cols-3">
              {MATERIALS.map((m) => (
                <article key={m.cat} className="bg-paper px-8 py-10 md:px-10">
                  <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-platinum-deep">
                    {m.cat}
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {m.items.map((item) => (
                      <li key={item} className="flex gap-3 text-[14px] leading-snug text-ink-700">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-platinum-deep" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ⑥ PHẠM VI DỰ ÁN — 4 loại không gian */}
        <section className="border-b border-hairline bg-paper px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-500">
              Phạm vi dự án
            </p>
            <h2 className="mt-4 max-w-2xl text-[clamp(1.5rem,2.8vw,2.25rem)] font-normal leading-snug text-ink-900 [font-family:var(--font-display),serif]">
              Một đối tác sản xuất — nhiều loại hình không gian.
            </h2>
            <div className="mt-14 grid gap-px bg-hairline sm:grid-cols-2">
              {SCOPE.map((x) => (
                <article key={x.t} className="group bg-paper-warm p-8 md:p-10">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-platinum-deep">
                    {x.tag}
                  </p>
                  <h3 className="mt-3 text-[18px] font-semibold text-ink-900 [font-family:var(--font-display),serif]">
                    {x.t}
                  </h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-600">{x.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ⑦ QUY TRÌNH — 4 bước */}
        <section className="border-b border-hairline px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-500">
              Quy trình làm việc
            </p>
            <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] font-normal text-ink-900 [font-family:var(--font-display),serif]">
              Bốn bước — từ brief đến bàn giao.
            </h2>
            <ol className="mt-14 grid gap-0 border border-hairline md:grid-cols-4 md:divide-x md:divide-hairline">
              {STEPS.map((s, i) => (
                <li key={s.n} className={`px-8 py-10 ${i < STEPS.length - 1 ? "border-b border-hairline md:border-b-0" : ""}`}>
                  <span className="font-mono text-[13px] font-medium text-platinum-deep">{s.n}</span>
                  <h3 className="mt-4 text-[16px] font-semibold text-ink-900">{s.t}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-600">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ⑧ TẠI SAO KAHA — 3 lý do, editorial strip */}
        <section className="border-b border-hairline bg-paper px-5 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-500">
              Tại sao KAHA
            </p>
            <h2 className="mt-4 max-w-xl text-[clamp(1.5rem,2.6vw,2rem)] font-normal text-ink-900 [font-family:var(--font-display),serif]">
              Ba điểm khác biệt của xưởng gia công đèn vải chuyên nghiệp.
            </h2>
            <div className="mt-14 grid gap-0 border-t border-hairline md:grid-cols-3 md:border-t-0">
              {WHY.map((w, i) => (
                <article
                  key={w.t}
                  className={`py-10 md:py-0 ${i < WHY.length - 1 ? "border-b border-hairline md:border-b-0 md:border-r" : ""} md:px-10 md:py-12 lg:px-12`}
                >
                  <div className="h-px w-8 bg-platinum-deep" aria-hidden />
                  <h3 className="mt-6 text-[17px] font-semibold text-ink-900 [font-family:var(--font-display),serif]">
                    {w.t}
                  </h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-600">{w.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ⑨ QUOTE — Inverted strip */}
        <section className="border-b border-hairline bg-ink-900 px-5 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <blockquote className="text-[clamp(1.5rem,3vw,2.25rem)] font-normal leading-snug text-paper [font-family:var(--font-display),serif]">
              "Chúng tôi không bán mẫu có sẵn như retail thuần — chúng tôi bán khả năng lặp lại
              cùng một chất lượng trên hàng trăm chiếc cho cùng một thương hiệu."
            </blockquote>
            <p className="mt-8 text-[12px] uppercase tracking-[0.14em] text-ink-300/60">
              KAHA · Xưởng gia công đèn vải · TP. Hồ Chí Minh
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/showroom"
                className="border border-paper/30 px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink-900"
              >
                Đặt lịch xưởng
              </Link>
              <Link
                href="/shop"
                className="border border-paper/30 bg-paper/10 px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-paper/80 transition-colors duration-200 hover:bg-paper/20 hover:text-paper"
              >
                Xem catalog
              </Link>
            </div>
          </div>
        </section>

        {/* ⑩ FAQ — Accordion */}
        <section className="border-b border-hairline px-5 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-500">
              Câu hỏi thường gặp
            </p>
            <h2 className="mt-4 text-[22px] font-semibold text-ink-900 [font-family:var(--font-display),serif]">
              Trước khi gửi RFQ — đọc nhanh 5 ý.
            </h2>
            <div className="mt-10 border border-hairline">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-hairline last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-5 text-left text-[14px] font-medium text-ink-900 transition-colors duration-150 hover:bg-paper-warm md:text-[15px]">
                    <span>{f.q}</span>
                    <span className="mt-px shrink-0 text-platinum-deep transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="border-t border-hairline bg-paper px-6 py-5 text-[14px] leading-relaxed text-ink-600 md:text-[15px]">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* LIÊN HỆ — Strip ngang */}
        <section className="border-b border-hairline bg-paper px-5 py-14 md:px-12">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4 md:gap-10">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">
                Hotline / Zalo
              </p>
              <p className="mt-3 text-[18px] font-medium text-ink-900">090 515 1701</p>
              <p className="mt-1 text-[13px] text-ink-600">8:00 – 21:00 mỗi ngày</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">Email RFQ</p>
              <p className="mt-3 text-[18px] font-medium text-ink-900">hi@kaha.vn</p>
              <p className="mt-1 text-[13px] text-ink-600">Gửi kèm bản vẽ &amp; số lượng</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-500">
                Xưởng &amp; Showroom
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-700">
                262/1/93 Phan Anh, P. Phú Thạnh
                <br />
                Tân Phú, TP.HCM
              </p>
            </div>
            <div className="flex items-center md:justify-end">
              <Link
                href="/showroom"
                className="inline-block border border-ink-900 bg-ink-900 px-8 py-3 text-[13px] font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-200 hover:bg-transparent hover:text-ink-900"
              >
                Đặt lịch tham quan
              </Link>
            </div>
          </div>
        </section>

        {/* CTA cuối trang */}
        <section className="px-5 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl border border-hairline bg-paper px-8 py-14 text-center md:px-16 md:py-20">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink-500">
              Bắt đầu dự án
            </p>
            <h2 className="mt-4 text-[clamp(1.5rem,2.8vw,2.25rem)] font-normal text-ink-900 [font-family:var(--font-display),serif]">
              Gửi brief — nhận báo giá sơ bộ trong 48 giờ.
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-[14px] leading-relaxed text-ink-600">
              Chỉ cần moodboard, bản vẽ sơ bộ hoặc tên đèn tham chiếu. Không cần hồ sơ hoàn chỉnh
              để nhận tư vấn đầu tiên.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/showroom"
                className="border border-ink-900 bg-ink-900 px-10 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-paper transition-colors duration-200 hover:bg-transparent hover:text-ink-900"
              >
                Đặt lịch xưởng
              </Link>
              <Link
                href="/shop"
                className="border border-hairline px-10 py-3.5 text-[13px] font-medium uppercase tracking-[0.1em] text-ink-700 transition-colors duration-200 hover:border-ink-400 hover:text-ink-900"
              >
                Xem catalog
              </Link>
            </div>
          </div>
        </section>

    </PageShell>
  );
}
