import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { SiteNavLinks } from "@/components/site-nav-links";
import { getSiteSettings } from "@/server/site-settings";

const LOGO_PATH = path.join(process.cwd(), "public/images/logo.png");

export async function SiteHeader() {
  const settings = await getSiteSettings();
  const hasLogo = fs.existsSync(LOGO_PATH);

  return (
    <header className="border-b border-hairline">
      <div className="border-b border-hairline bg-ink-900 px-5 py-2 text-center md:px-12">
        <Link
          href={settings.topbarHref || "/showroom"}
          className="text-[11px] uppercase tracking-[0.1em] text-paper/85 transition-colors hover:text-paper"
        >
          {settings.topbarText}
        </Link>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-12 md:py-5">
        <Link
          href="/"
          className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-platinum-deep"
        >
          {hasLogo ? (
            <Image
              src="/images/logo.png"
              alt={settings.siteName}
              width={210}
              height={64}
              className="h-9 w-auto max-w-[230px] object-contain object-left"
              priority
              sizes="210px"
            />
          ) : (
            <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-700">
              {settings.logoText || settings.siteName}
            </span>
          )}
        </Link>
        <div className="hidden min-w-[280px] flex-1 border border-hairline bg-paper px-3 py-2 md:flex">
          <input
            readOnly
            value="Tim san pham, danh muc..."
            className="w-full bg-transparent text-sm text-ink-500 outline-none"
            aria-label="Search placeholder"
          />
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${settings.hotline.replace(/[^\d+]/g, "")}`}
            className="hidden border border-hairline px-4 py-2 text-xs uppercase tracking-[0.08em] text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900 md:inline-flex"
          >
            {settings.hotline}
          </a>
          <Link
            href={settings.primaryCtaHref || "/showroom"}
            className="border border-ink-900 bg-ink-900 px-4 py-2 text-xs uppercase tracking-[0.08em] text-paper transition-colors hover:bg-paper hover:text-ink-900"
          >
            {settings.primaryCtaLabel || "Dat lich"}
          </Link>
        </div>
      </div>
      <div className="border-t border-hairline px-5 md:px-12">
        <nav
          className="mx-auto flex max-w-[1600px] items-center gap-7 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-600"
          aria-label="Chinh"
        >
          <SiteNavLinks />
          <Link href="/admin/settings" className="ml-auto text-ink-500 hover:text-ink-900">
            Admin settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
