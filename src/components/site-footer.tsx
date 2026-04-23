import { SiteNavLinks } from "@/components/site-nav-links";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline px-5 py-10 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <nav
          className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] font-medium uppercase tracking-[0.08em] text-ink-600"
          aria-label="Chân trang"
        >
          <SiteNavLinks showHome showRss />
        </nav>
        <p className="text-[13px] uppercase tracking-[0.08em] text-ink-500">
          © KAHA.VN
        </p>
      </div>
    </footer>
  );
}
