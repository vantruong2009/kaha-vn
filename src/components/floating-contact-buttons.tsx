import Link from "next/link";
import type { SiteSettings } from "@/server/site-settings";

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function FloatingContactButtons({ settings }: { settings: SiteSettings }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <a
        href={telHref(settings.hotline)}
        className="inline-flex items-center gap-2 border border-ink-900 bg-ink-900 px-4 py-2 text-xs uppercase tracking-[0.08em] text-paper transition-colors hover:bg-paper hover:text-ink-900"
      >
        Gọi {settings.hotline}
      </a>
      <Link
        href={settings.primaryCtaHref || "/showroom"}
        className="inline-flex items-center justify-center border border-hairline bg-paper px-4 py-2 text-xs uppercase tracking-[0.08em] text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900"
      >
        {settings.primaryCtaLabel || "Đặt lịch"}
      </Link>
    </div>
  );
}
