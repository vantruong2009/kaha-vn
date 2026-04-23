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
      <header className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-hairline px-5 py-6 md:px-12">
        <Link
          href="/"
          className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-platinum-deep"
        >
          KAHA.VN
        </Link>
        <nav
          className="flex items-center gap-8 text-[13px] font-medium uppercase tracking-[0.08em] text-ink-600"
          aria-label="Chính"
        >
          <Link href="/shop" className="transition-colors hover:text-ink-900">
            Shop
          </Link>
          <Link href="/journal" className="transition-colors hover:text-ink-900">
            Journal
          </Link>
          <Link href="/lookbook" className="transition-colors hover:text-ink-900">
            Lookbook
          </Link>
        </nav>
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
          className="mt-10 border border-ink-900 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-900 hover:text-paper"
        >
          Thử lại
        </button>
      </main>
      <footer className="border-t border-hairline px-5 py-10 md:px-12">
        <p className="text-[13px] uppercase tracking-[0.08em] text-ink-500">
          © KAHA.VN
        </p>
      </footer>
    </div>
  );
}
