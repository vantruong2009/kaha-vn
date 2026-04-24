"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-paper-warm">
      <header className="border-b border-hairline">
        <div className="border-b border-hairline bg-ink-900 px-5 py-2 text-center md:px-12">
          <Link
            href="/showroom"
            className="text-[11px] uppercase tracking-[0.1em] text-paper/85 transition-colors hover:text-paper"
          >
            Xưởng KAHA — gia công đèn vải theo thông số dự án
          </Link>
        </div>
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-12">
          <Link
            href="/"
            className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-platinum-deep"
          >
            KAHA.VN
          </Link>
          <nav
            className="flex flex-wrap items-center gap-6 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-600"
            aria-label="Điều hướng"
          >
            <Link href="/shop" className="transition-colors hover:text-ink-900">
              Shop
            </Link>
            <Link href="/journal" className="transition-colors hover:text-ink-900">
              Journal
            </Link>
            <Link href="/showroom" className="transition-colors hover:text-ink-900">
              Showroom
            </Link>
          </nav>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
          Lỗi
        </p>
        <h1 className="mt-4 text-xl font-semibold text-ink-900 [font-family:var(--font-display),serif] md:text-2xl">
          Không tải được trang
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-700">
          {error.message || "Đã xảy ra lỗi."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-10 border border-ink-900 bg-ink-900 px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-paper hover:text-ink-900"
        >
          Thử lại
        </button>
      </main>
      <footer className="border-t border-hairline px-5 py-10 md:px-12">
        <p className="text-[12px] uppercase tracking-[0.08em] text-ink-500">© KAHA.VN</p>
      </footer>
    </div>
  );
}
