import { breadcrumbSegmentLabel } from "@/lib/breadcrumb-segment-label";

type Props = {
  base: string;
  /** Các phần path, ví dụ `["shop", "den"]` → /shop/den */
  segments: string[];
};

export function JsonLdBreadcrumbList({ base, segments }: Props) {
  const clean = segments.filter(Boolean);
  if (clean.length === 0) return null;

  const elements: { position: number; name: string; item: string }[] = [];
  let position = 1;
  elements.push({
    position: position++,
    name: "Trang chủ",
    item: `${base}/`,
  });
  for (let i = 0; i < clean.length; i++) {
    const path = clean.slice(0, i + 1).join("/");
    elements.push({
      position: position++,
      name: breadcrumbSegmentLabel(clean[i]),
      item: `${base}/${path}`,
    });
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: elements.map((e) => ({
      "@type": "ListItem",
      position: e.position,
      name: e.name,
      item: e.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
