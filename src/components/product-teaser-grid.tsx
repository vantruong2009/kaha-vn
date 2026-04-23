import Image from "next/image";
import Link from "next/link";
import type { ProductTeaser } from "@/server/content";
import { rewriteKahaMediaUrls } from "@/lib/rewrite-kaha-media-url";

function imgOk(src: string): boolean {
  try {
    const h = new URL(src).hostname;
    return (
      h === "kaha.vn" ||
      h === "www.kaha.vn" ||
      h.endsWith(".r2.dev") ||
      h.includes("r2.cloudflarestorage.com")
    );
  } catch {
    return false;
  }
}

export function ProductTeaserGrid({ items }: { items: ProductTeaser[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-hairline px-5 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-xl font-semibold tracking-tight text-ink-900 md:text-left md:text-2xl [font-family:var(--font-display),serif]">
          Sản phẩm
        </h2>
        <ul className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const raw = p.featured_image_source_url?.trim();
            const src = raw ? rewriteKahaMediaUrls(raw).trim() : "";
            const alt = (p.title ?? "Sản phẩm").trim();

            return (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  className="group block border border-hairline bg-paper transition-colors hover:border-ink-300"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-hairline">
                    {src ? (
                      imgOk(src) ? (
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt={alt}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-[13px] text-ink-500">
                        KAHA
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-base font-semibold leading-snug text-ink-900 group-hover:text-platinum-deep">
                      {p.title ?? p.slug}
                    </p>
                    {p.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">
                        {p.excerpt}
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
