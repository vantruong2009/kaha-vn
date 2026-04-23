import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MoodboardClient } from "./ui-client";

export const metadata: Metadata = {
  title: "Moodboard",
  description: "Bảng lưu sản phẩm yêu thích cho dự án chiếu sáng.",
  alternates: { canonical: "/moodboard" },
  robots: { index: true, follow: true },
};

export default function MoodboardPage() {
  return (
    <div className="flex min-h-full flex-col bg-paper-warm">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 px-5 py-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
            KAHA.VN
          </p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,2.6rem)] [font-family:var(--font-display),serif] text-ink-900">
            Moodboard
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-700">
            Lưu nhanh các mẫu đèn để so sánh và gửi yêu cầu báo giá theo dự án.
          </p>
          <MoodboardClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
