import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SpecPrintButton } from "@/components/spec-print-button";
import { plainTextFromHtml } from "@/lib/plain-text-from-html";
import { getSiteUrl } from "@/lib/site-url";
import { getContentBySlugPath } from "@/server/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentBySlugPath([slug]);
  if (!content || content.post_type !== "product") {
    return {
      title: "Spec sheet",
      robots: { index: false, follow: true },
    };
  }
  const base = getSiteUrl();
  const title = `Spec sheet — ${content.title ?? content.slug}`;
  return {
    title,
    description: plainTextFromHtml(content.excerpt, { maxLength: 160 }) || undefined,
    alternates: { canonical: `${base}/spec/${content.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function SpecSheetPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContentBySlugPath([slug]);
  if (!content || content.post_type !== "product") {
    notFound();
  }
  const excerpt = plainTextFromHtml(content.excerpt, { maxLength: 1400 });
  const seoDesc = plainTextFromHtml(content.seo_description, { maxLength: 400 });

  return (
    <main id="main-content" tabIndex={-1} className="min-h-full bg-paper px-5 py-10 text-ink-900 md:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-3 border-b border-hairline pb-5">
          <div>
            <p className="text-[12px] uppercase tracking-[0.08em] text-ink-500">KAHA.VN</p>
            <h1 className="mt-2 text-2xl [font-family:var(--font-display),serif]">
              Spec Sheet
            </h1>
          </div>
          <SpecPrintButton />
        </div>

        <section className="space-y-5">
          <h2 className="text-xl [font-family:var(--font-display),serif] text-ink-900">
            {content.title ?? content.slug}
          </h2>
          <p className="text-sm text-ink-600">
            Product URL:{" "}
            <Link href={`/${content.slug}`} className="underline underline-offset-4">
              /{content.slug}
            </Link>
          </p>
          {excerpt ? <p className="text-base leading-relaxed text-ink-700">{excerpt}</p> : null}
          {seoDesc ? (
            <div className="rounded-sm border border-hairline p-4 text-sm text-ink-700">
              <p className="font-medium uppercase tracking-[0.06em] text-ink-500">
                SEO Description
              </p>
              <p className="mt-2 leading-relaxed">{seoDesc}</p>
            </div>
          ) : null}
          <div className="grid gap-4 border-t border-hairline pt-6 text-sm md:grid-cols-2">
            <div>
              <p className="uppercase tracking-[0.06em] text-ink-500">Danh mục</p>
              <p className="mt-1 text-ink-800">
                {(content.categories ?? []).join(", ") || "-"}
              </p>
            </div>
            <div>
              <p className="uppercase tracking-[0.06em] text-ink-500">Tags</p>
              <p className="mt-1 text-ink-800">{(content.tags ?? []).join(", ") || "-"}</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.06em] text-ink-500">Slug</p>
              <p className="mt-1 text-ink-800">{content.slug}</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.06em] text-ink-500">Ngày xuất bản</p>
              <p className="mt-1 text-ink-800">{content.published_at ?? "-"}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
