import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { ContentBreadcrumb } from "@/components/content-breadcrumb";
import { JsonLdArticle } from "@/components/json-ld-article";
import { JsonLdBreadcrumbList } from "@/components/json-ld-breadcrumb";
import { JsonLdProduct } from "@/components/json-ld-product";
import { JsonLdWebPage } from "@/components/json-ld-webpage";
import { MoodboardToggle } from "@/components/moodboard-toggle";
import { QuoteRequestForm } from "@/components/quote-request-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { plainTextFromHtml } from "@/lib/plain-text-from-html";
import { rewriteKahaMediaUrls } from "@/lib/rewrite-kaha-media-url";
import { getSiteUrl } from "@/lib/site-url";
import { isNextImageRemoteSrc } from "@/lib/remote-image-host";
import {
  getContentBySlugPath,
  getShopArchiveRedirectPath,
} from "@/server/content";

function featuredSrcForDisplay(url: string): string {
  return rewriteKahaMediaUrls(url).trim();
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const segs = slug ?? [];
  const path = "/" + segs.join("/");
  const base = getSiteUrl();
  const canonical = `${base}${path === "//" ? "/" : path}`;

  const content = await getContentBySlugPath(segs);
  const singleSeg = segs.filter(Boolean);
  if (!content && singleSeg.length === 1) {
    const shopPath = await getShopArchiveRedirectPath(singleSeg[0]);
    if (shopPath) permanentRedirect(shopPath);
  }
  if (content) {
    const title = (content.seo_title || content.title || path).trim();
    const description =
      plainTextFromHtml(
        (content.seo_description || content.excerpt || "").trim(),
        { maxLength: 165 },
      ) || undefined;
    const ogImage = content.featured_image_source_url
      ? featuredSrcForDisplay(content.featured_image_source_url)
      : undefined;

    const isPost = content.post_type === "post";
    const openGraph: NonNullable<Metadata["openGraph"]> = {
      type: isPost ? "article" : "website",
      url: canonical,
      title,
      description,
      locale: "vi_VN",
      ...(isPost && content.published_at
        ? { publishedTime: content.published_at }
        : {}),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    };

    return {
      title,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph,
      twitter: {
        card: ogImage ? "summary_large_image" : "summary",
        title,
        description,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    };
  }

  return {
    title: path,
    description:
      "Trang đang chờ nội dung sau import WordPress — không index tạm thời.",
    alternates: { canonical },
    robots: { index: false, follow: true },
  };
}

export default async function LegacyPathPlaceholder({ params }: Props) {
  const { slug } = await params;
  const segs = slug ?? [];
  const path = "/" + segs.join("/");

  const content = await getContentBySlugPath(segs);
  const singleSeg = segs.filter(Boolean);
  if (!content && singleSeg.length === 1) {
    const shopPath = await getShopArchiveRedirectPath(singleSeg[0]);
    if (shopPath) permanentRedirect(shopPath);
  }

  if (content) {
    const html = content.body_html
      ? rewriteKahaMediaUrls(content.body_html)
      : null;

    const hero = content.featured_image_source_url
      ? featuredSrcForDisplay(content.featured_image_source_url)
      : null;
    const heroAlt = (content.title ?? "").trim() || "KAHA";

    const base = getSiteUrl();
    const pathSegments = segs.filter(Boolean);
    const articleUrl = `${base}/${pathSegments.join("/")}`;
    const headline = (content.seo_title || content.title || path).trim();
    const schemaDesc =
      plainTextFromHtml(
        (content.seo_description || content.excerpt || "").trim(),
        { maxLength: 320 },
      ) || undefined;
    const excerptLead = plainTextFromHtml(content.excerpt, {
      maxLength: 420,
    });

    return (
      <div className="flex min-h-full flex-col bg-paper-warm">
        <SiteHeader />
        <article
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-5 py-16 md:px-12"
        >
          {content.post_type === "post" ? (
            <JsonLdArticle
              url={articleUrl}
              headline={headline}
              description={schemaDesc}
              datePublished={content.published_at}
            />
          ) : null}
          {content.post_type === "product" ? (
            <JsonLdProduct
              url={articleUrl}
              name={headline}
              description={schemaDesc}
              image={hero ?? undefined}
            />
          ) : null}
          {content.post_type === "page" ? (
            <JsonLdWebPage
              url={articleUrl}
              name={headline}
              description={schemaDesc}
            />
          ) : null}
          <JsonLdBreadcrumbList base={base} segments={pathSegments} />
          <header className="mx-auto max-w-5xl">
            <ContentBreadcrumb segments={pathSegments} />
            <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
              {content.post_type}
            </p>
            {content.title ? (
              <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight tracking-tight text-ink-900 [font-family:var(--font-display),serif]">
                {content.title}
              </h1>
            ) : null}
            {excerptLead ? <p className="mt-5 text-lg leading-relaxed text-ink-600">{excerptLead}</p> : null}
            {content.post_type === "product" ? (
              <MoodboardToggle
                item={{
                  slug: content.slug,
                  title: content.title ?? content.slug,
                  image: hero ?? undefined,
                }}
              />
            ) : null}
            {content.post_type === "product" ? (
              <p className="mt-3">
                <Link
                  href={`/spec/${content.slug}`}
                  className="text-xs uppercase tracking-[0.06em] text-ink-600 underline-offset-4 transition-colors hover:text-ink-900 hover:underline hover:decoration-platinum-deep"
                >
                  Spec sheet (in / lưu PDF)
                </Link>
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
            <div className="mx-auto mt-10 grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-hairline">
                {isNextImageRemoteSrc(hero) ? (
                  <Image
                    src={hero}
                    alt={heroAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 900px"
                    priority
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- host ngoài chưa khai báo remotePatterns
                  <img src={hero} alt={heroAlt} className="h-full w-full object-cover" />
                )}
              </div>
              {content.post_type === "product" ? (
                <aside className="h-fit border border-hairline bg-paper p-6">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink-500">Thông tin nhanh</p>
                  <ul className="mt-4 space-y-3 text-sm text-ink-700">
                    <li className="border-b border-hairline pb-3">Gia công theo kích thước và chất liệu đã duyệt</li>
                    <li className="border-b border-hairline pb-3">Hỗ trợ mẫu thử trước khi chạy lô</li>
                    <li className="border-b border-hairline pb-3">Bảo hành theo hợp đồng dự án</li>
                    <li>Phản hồi RFQ trong 48 giờ</li>
                  </ul>
                  <div className="mt-5 flex flex-col gap-2">
                    <Link href="/showroom" className="border border-ink-900 bg-ink-900 px-4 py-2 text-center text-xs uppercase tracking-[0.08em] text-paper hover:bg-paper hover:text-ink-900">
                      Đặt lịch xưởng
                    </Link>
                    <Link href="/shop" className="border border-hairline px-4 py-2 text-center text-xs uppercase tracking-[0.08em] text-ink-700 hover:border-ink-300 hover:text-ink-900">
                      Quay về catalog
                    </Link>
                  </div>
                </aside>
              ) : null}
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
          {content.post_type === "product" ? (
            <QuoteRequestForm
              productSlug={content.slug}
              productTitle={content.title ?? content.slug}
            />
          ) : null}
        </article>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-paper-warm">
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col px-5 py-16 md:px-12"
      >
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
