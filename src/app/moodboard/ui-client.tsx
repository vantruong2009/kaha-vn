"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { isNextImageRemoteSrc } from "@/lib/remote-image-host";

const KEY = "kaha_moodboard_v1";

type Item = { slug: string; title: string; image?: string };

function readItems(): Item[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Item[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeItems(items: Item[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

function getInitialItems(): Item[] {
  if (typeof window === "undefined") return [];
  return readItems();
}

export function MoodboardClient() {
  const [items, setItems] = useState<Item[]>(getInitialItems);

  if (items.length === 0) {
    return (
      <p className="mt-10 text-ink-600">
        Chưa có sản phẩm trong moodboard. Vào trang sản phẩm và bấm{" "}
        <span className="font-medium">Lưu vào moodboard</span>.
      </p>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-600">{items.length} sản phẩm đã lưu</p>
        <button
          type="button"
          onClick={() => {
            writeItems([]);
            setItems([]);
          }}
          className="text-xs uppercase tracking-[0.06em] text-ink-600 underline-offset-4 hover:underline"
        >
          Xóa tất cả
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => (
          <li key={x.slug} className="border border-hairline bg-paper">
            <Link href={`/${x.slug}`} className="block">
              <div className="relative aspect-[4/5] bg-hairline">
                {x.image ? (
                  isNextImageRemoteSrc(x.image) ? (
                    <Image
                      src={x.image}
                      alt={x.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={x.image} alt={x.title} className="h-full w-full object-cover" />
                  )
                ) : null}
              </div>
              <p className="p-4 text-sm font-medium text-ink-900">{x.title}</p>
            </Link>
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={() => {
                  const next = items.filter((i) => i.slug !== x.slug);
                  writeItems(next);
                  setItems(next);
                }}
                className="text-xs uppercase tracking-[0.06em] text-ink-600 underline-offset-4 hover:underline"
              >
                Bỏ khỏi moodboard
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
