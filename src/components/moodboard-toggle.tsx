"use client";

import { useMemo, useState } from "react";

const KEY = "kaha_moodboard_v1";

type Item = {
  slug: string;
  title: string;
  image?: string;
};

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

export function MoodboardToggle({ item }: { item: Item }) {
  const [items, setItems] = useState<Item[]>(getInitialItems);

  const inBoard = useMemo(
    () => items.some((x) => x.slug === item.slug),
    [items, item.slug],
  );

  return (
    <button
      type="button"
      onClick={() => {
        const current = readItems();
        const next = current.some((x) => x.slug === item.slug)
          ? current.filter((x) => x.slug !== item.slug)
          : [item, ...current].slice(0, 100);
        writeItems(next);
        setItems(next);
      }}
      className="mt-4 border border-hairline px-4 py-2 text-xs uppercase tracking-[0.06em] text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900"
    >
      {inBoard ? "Bỏ khỏi moodboard" : "Lưu vào moodboard"}
    </button>
  );
}
