import { getSiteUrl } from "@/lib/site-url";

type Props = {
  url: string;
  name: string;
  description?: string;
};

export function JsonLdWebPage({ url, name, description }: Props) {
  const base = getSiteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    isPartOf: {
      "@type": "WebSite",
      name: "KAHA.VN",
      url: base,
    },
  };
  if (description) data.description = description;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
