import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col bg-paper-warm">
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-ink-900 md:text-3xl [font-family:var(--font-display),serif]">
          Không tìm thấy trang
        </h1>
        <Link
          href="/"
          className="mt-8 border border-ink-900 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-900 hover:text-paper"
        >
          Về trang chủ
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
