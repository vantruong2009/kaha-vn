export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper-warm">
      <header className="border-b border-hairline px-5 py-6 md:px-12">
        <span className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
          KAHA.VN
        </span>
      </header>

      <main className="flex flex-1 flex-col justify-center px-5 py-16 md:px-12 md:py-[120px]">
        <div className="mx-auto max-w-[720px] text-center md:text-left">
          <h1
            className="text-balance text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.1] tracking-tight text-ink-900 [font-family:var(--font-display),serif]"
          >
            Ánh sáng dẫn không gian
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-700">
            Đèn trang trí cao cấp — bản Next.js đang khởi tạo (Obsidian / platinum).
          </p>
          <p className="mt-4 text-sm font-medium text-platinum-deep">
            Giá & catalogue — sắp có
          </p>
        </div>
      </main>

      <footer className="border-t border-hairline px-5 py-8 md:px-12">
        <p className="text-[13px] uppercase tracking-[0.08em] text-ink-500">
          © KAHA.VN
        </p>
      </footer>
    </div>
  );
}
