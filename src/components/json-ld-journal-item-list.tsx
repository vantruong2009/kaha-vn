type Item = { slug: string; title: string | null };

type Props = {
  siteUrl: string;
  items: Item[];
};

/** ItemList cho trang danh sách Journal (SEO). */
export function JsonLdJournalItemList({ siteUrl, items }: Props) {
  if (items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: (p.title ?? p.slug).trim() || p.slug,
      url: `${siteUrl}/${p.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
