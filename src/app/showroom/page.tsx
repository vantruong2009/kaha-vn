import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Gửi RFQ & Đặt lịch xưởng",
  description: "Gửi brief và yêu cầu báo giá cho KAHA — phản hồi trong 48h. Đặt lịch tham quan xưởng và xem mẫu trực tiếp tại TP.HCM.",
  alternates: { canonical: "/showroom" },
  robots: { index: true, follow: true },
};

type Props = {
  searchParams?: Promise<{ status?: string }>;
};

export default async function ShowroomPage({ searchParams }: Props) {
  const status = (await searchParams)?.status ?? "";
  return (
    <PageShell mainClassName="flex-1 px-5 py-16 md:px-12 md:py-24">
        <section className="mx-auto max-w-3xl">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
            KAHA.VN
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,2.6rem)] [font-family:var(--font-display),serif] text-ink-900">
            Gửi RFQ & Đặt lịch xưởng
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">
            Gửi brief dự án — kích thước, số lượng, timeline. KAHA phản hồi báo giá sơ bộ trong 48h và sắp xếp lịch tham quan xưởng, xem mẫu trực tiếp tại TP.HCM.
          </p>
          {status === "ok" ? (
            <p className="mt-4 text-sm text-ink-700">
              Đã nhận lịch hẹn. KAHA sẽ liên hệ xác nhận sớm.
            </p>
          ) : null}
          {status === "invalid" ? (
            <p className="mt-4 text-sm text-platinum-deep">
              Thiếu dữ liệu bắt buộc. Vui lòng kiểm tra lại biểu mẫu.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="mt-4 text-sm text-platinum-deep">
              Gửi lịch hẹn thất bại. Vui lòng thử lại.
            </p>
          ) : null}
          {status === "rate_limited" ? (
            <p className="mt-4 text-sm text-platinum-deep">
              Gửi quá nhanh. Vui lòng đợi vài phút rồi thử lại.
            </p>
          ) : null}

          <form
            action="/api/showroom-booking"
            method="post"
            className="mt-10 grid gap-4 border border-hairline bg-paper p-6 md:grid-cols-2 md:p-8"
          >
            <label className="flex flex-col gap-2 text-sm text-ink-600">
              Họ tên *
              <input
                required
                name="name"
                className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-ink-600">
              Số điện thoại *
              <input
                required
                name="phone"
                className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-ink-600">
              Email
              <input
                type="email"
                name="email"
                className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-ink-600">
              Ngày hẹn *
              <input
                required
                name="visitDate"
                type="date"
                className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-ink-600">
              Khung giờ
              <select
                name="slot"
                defaultValue="09:00-11:00"
                className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
              >
                <option value="09:00-11:00">09:00 - 11:00</option>
                <option value="13:30-15:30">13:30 - 15:30</option>
                <option value="16:00-18:00">16:00 - 18:00</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-ink-600 md:col-span-2">
              Brief dự án (loại công trình, số lượng, kích thước, timeline...)
              <textarea
                rows={4}
                name="note"
                placeholder="Ví dụ: 50 đèn thả trần cho khách sạn boutique, ø40cm, vải linen, giao Q3/2026..."
                className="border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
              />
            </label>
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              name="website"
              className="hidden"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                className="border border-ink-900 bg-ink-900 px-6 py-2 text-sm uppercase tracking-[0.06em] text-paper transition-colors hover:bg-paper hover:text-ink-900"
              >
                Gửi yêu cầu báo giá
              </button>
            </div>
          </form>
        </section>
    </PageShell>
  );
}
