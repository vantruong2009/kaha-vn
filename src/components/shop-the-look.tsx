"use client";

import Image from "next/image";
import Link from "next/link";

type Hotspot = {
  label: string;
  href: string;
  x: number;
  y: number;
};

type Props = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  caption: string;
  hotspots: Hotspot[];
};

/** Editorial block với hotspot để dẫn sang sản phẩm/collection. */
export function ShopTheLook({
  imageSrc,
  imageAlt,
  title,
  caption,
  hotspots,
}: Props) {
  return (
    <section className="grid gap-8 border border-hairline bg-paper p-4 md:grid-cols-[1.2fr_1fr] md:p-6">
      <div className="relative aspect-[4/3] overflow-hidden bg-hairline">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          priority
        />
        {hotspots.map((h) => (
          <Link
            key={`${h.label}-${h.x}-${h.y}`}
            href={h.href}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-900 bg-paper/90 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-ink-900 backdrop-blur transition-colors hover:bg-ink-900 hover:text-paper"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            {h.label}
          </Link>
        ))}
      </div>
      <div className="self-center">
        <p className="text-[12px] uppercase tracking-[0.08em] text-ink-500">
          Shop the look
        </p>
        <h2 className="mt-2 text-2xl [font-family:var(--font-display),serif] text-ink-900">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-700">{caption}</p>
        <p className="mt-5">
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.06em] text-ink-600 underline underline-offset-4 decoration-platinum-deep"
          >
            Mở Shop đầy đủ
          </Link>
        </p>
      </div>
    </section>
  );
}
