import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = "/" + (slug?.join("/") ?? "");
  return {
    title: path,
    robots: { index: false, follow: true },
  };
}

export default async function LegacyPathPlaceholder({ params }: Props) {
  const { slug } = await params;
  const path = "/" + (slug?.join("/") ?? "");

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
