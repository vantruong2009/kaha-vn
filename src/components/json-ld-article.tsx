import { getSiteUrl } from "@/lib/site-url";

type Props = {
  url: string;
  headline: string;
  description?: string;
  datePublished?: string | null;
};

export function JsonLdArticle({ url, headline, description, datePublished }: Props) {
  const base = getSiteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: "KAHA.VN",
      url: base,
    },
  };
  if (description) data.description = description;
  if (datePublished) data.datePublished = datePublished;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
