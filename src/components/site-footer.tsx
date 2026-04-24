import { SiteNavLinks } from "@/components/site-nav-links";
import { getSiteSettings } from "@/server/site-settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  return (
    <footer className="border-t border-hairline bg-paper">
      <div className="mx-auto grid max-w-[1600px] gap-px bg-hairline md:grid-cols-4">
        <div className="bg-paper p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Hotline</p>
          <p className="mt-3 text-lg text-ink-900">{settings.hotline}</p>
          <p className="mt-1 text-sm text-ink-600">{settings.tagline}</p>
        </div>
        <div className="bg-paper p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Email</p>
          <p className="mt-3 text-lg text-ink-900">{settings.email}</p>
          <p className="mt-1 text-sm text-ink-600">Nhan RFQ va ban ve</p>
        </div>
        <div className="bg-paper p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Dia chi</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-700">{settings.address}</p>
        </div>
        <div className="bg-paper p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Dieu huong</p>
          <nav
            className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-600"
            aria-label="Chan trang"
          >
            <SiteNavLinks showHome showRss />
          </nav>
        </div>
      </div>
      <div className="border-t border-hairline px-5 py-4 md:px-12">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between text-[12px] uppercase tracking-[0.08em] text-ink-500">
          <p>{settings.footerCopyright}</p>
          <div className="flex items-center gap-4">
            {settings.facebookUrl ? (
              <a href={settings.facebookUrl} className="hover:text-ink-900">
                Facebook
              </a>
            ) : null}
            {settings.instagramUrl ? (
              <a href={settings.instagramUrl} className="hover:text-ink-900">
                Instagram
              </a>
            ) : null}
            {settings.youtubeUrl ? (
              <a href={settings.youtubeUrl} className="hover:text-ink-900">
                YouTube
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
