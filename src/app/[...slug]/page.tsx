import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { rewriteKahaMediaUrls } from "@/lib/rewrite-kaha-media-url";
import { getSiteUrl } from "@/lib/site-url";
import { getContentBySlugPath } from "@/server/content";

function featuredSrcForDisplay(url: string): string {
  return rewriteKahaMediaUrls(url).trim();
}

function useNextImageForRemote(src: string): boolean {
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

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const segs = slug ?? [];
  const path = "/" + segs.join("/");
  const base = getSiteUrl();
  const canonical = `${base}${path === "//" ? "/" : path}`;

  const content = await getContentBySlugPath(segs);
  if (content) {
    const title = (content.seo_title || content.title || path).trim();
    const description = (
      content.seo_description ||
      content.excerpt ||
      ""
    ).trim();
    const ogImage = content.featured_image_source_url
      ? featuredSrcForDisplay(content.featured_image_source_url)
      : undefined;
    return {
      title,
      description: description || undefined,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
    };
  }

  return {
    title: path,
    robots: { index: false, follow: true },
  };
}

export default async function LegacyPathPlaceholder({ params }: Props) {
  const { slug } = await params;
  const segs = slug ?? [];
  const path = "/" + segs.join("/");

  const content = await getContentBySlugPath(segs);

  if (content) {
    const html = content.body_html
      ? rewriteKahaMediaUrls(content.body_html)
      : null;

    const hero = content.featured_image_source_url
      ? featuredSrcForDisplay(content.featured_image_source_url)
      : null;
    const heroAlt = (content.title ?? "").trim() || "KAHA";

    return (
      <div className="flex min-h-full flex-col bg-paper-warm">
        <SiteHeader />
        <article className="flex-1 px-5 py-16 md:px-12">
          <header className="mx-auto max-w-3xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
              {content.post_type}
            </p>
            {content.title ? (
              <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight tracking-tight text-ink-900 [font-family:var(--font-display),serif]">
                {content.title}
              </h1>
            ) : null}
            {content.excerpt ? (
              <p className="mt-5 text-lg leading-relaxed text-ink-600">
                {content.excerpt}
              </p>
            ) : null}
            {(content.categories?.length || content.tags?.length) ? (
              <p className="mt-4 text-[13px] uppercase tracking-[0.06em] text-ink-500">
                {[...(content.categories ?? []), ...(content.tags ?? [])].join(
                  " · ",
                )}
              </p>
            ) : null}
          </header>
          {hero ? (
            <div className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-xl overflow-hidden bg-hairline">
              {useNextImageForRemote(hero) ? (
                <Image
                  src={hero}
                  alt={heroAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 576px"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- host ngoài chưa khai báo remotePatterns
                <img
                  src={hero}
                  alt={heroAlt}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ) : null}
          {html ? (
            <div
              className="mx-auto mt-12 max-w-3xl space-y-4 text-base leading-relaxed text-ink-800 [&_a]:text-platinum-deep [&_a]:underline [&_h2]:mt-10 [&_h2]:font-semibold [&_h2]:text-ink-900 [&_img]:my-6 [&_img]:max-w-full [&_p]:my-4"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <p className="mx-auto mt-10 max-w-3xl text-ink-600">
              Chưa có nội dung HTML cho trang này.
            </p>
          )}
        </article>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-paper-warm">
      <SiteHeader />
      <main className="flex flex-1 flex-col px-5 py-16 md:px-12">
        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
          Migration
        </p>
        <p className="mt-3 font-mono text-sm text-ink-700">{path}</p>
        <p className="mt-8 max-w-lg text-base leading-relaxed text-ink-700">
          Slug giữ nguyên so với WordPress; nội dung render sau import DB / R2.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
