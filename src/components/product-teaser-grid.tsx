import Image from "next/image";
import Link from "next/link";
import type { ProductTeaser } from "@/server/content";
import { plainTextFromHtml } from "@/lib/plain-text-from-html";
import { isNextImageRemoteSrc } from "@/lib/remote-image-host";
import { rewriteKahaMediaUrls } from "@/lib/rewrite-kaha-media-url";

export function ProductTeaserGrid({
  items,
  heading = "Sản phẩm",
}: {
  items: ProductTeaser[];
  /**
   * Tiêu đề section. Truyền chuỗi rỗng `""` để ẩn heading hoàn toàn
   * (khi caller tự render header riêng phía trên).
   */
  heading?: string;
}) {
  if (items.length === 0) return null;
  const showHeading = heading.trim().length > 0;

  return (
    <section
      className={`px-5 md:px-12 ${showHeading ? "border-t border-hairline py-16 md:py-24" : "py-16 md:py-20"}`}
    >
      <div className="mx-auto max-w-[1600px]">
        {showHeading ? (
          <h2 className="font-display text-center text-[clamp(1.5rem,3vw,2.25rem)] leading-tight text-ink-900 md:text-left">
            {heading}
          </h2>
        ) : null}
        <ul
          className={`grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 ${
            showHeading ? "mt-14" : ""
          }`}
        >
          {items.map((p) => {
            const raw = p.featured_image_source_url?.trim();
            const src = raw ? rewriteKahaMediaUrls(raw).trim() : "";
            const alt = (p.title ?? "Sản phẩm").trim();
            const excerptPlain = plainTextFromHtml(p.excerpt, {
              maxLength: 140,
            });

            return (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden border border-hairline bg-paper">
                    {src ? (
                      isNextImageRemoteSrc(src) ? (
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={alt}
                          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                        />
                      )
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-ink-400">
                          KAHA
                        </span>
                        <div className="h-px w-8 bg-platinum-deep" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="mt-5">
                    <p className="font-display text-[18px] leading-snug text-ink-900 transition-colors group-hover:text-ink-700">
                      {p.title ?? p.slug}
                    </p>
                    {excerptPlain ? (
                      <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.6] text-ink-600">
                        {excerptPlain}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
