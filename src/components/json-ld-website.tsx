import { getSiteUrl } from "@/lib/site-url";

/** WebSite toàn site — bổ sung Organization trong layout. */
export function JsonLdWebSite() {
  const base = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KAHA.VN",
    url: base,
    publisher: {
      "@type": "Organization",
      name: "KAHA.VN",
      url: base,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
