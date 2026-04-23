import { getSiteUrl } from "@/lib/site-url";

type Props = {
  url: string;
  name: string;
  description?: string;
  image?: string;
};

export function JsonLdProduct({ url, name, description, image }: Props) {
  const base = getSiteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url,
    brand: {
      "@type": "Brand",
      name: "KAHA.VN",
    },
    manufacturer: {
      "@type": "Organization",
      name: "KAHA.VN",
      url: base,
    },
  };
  if (description) data.description = description;
  if (image) data.image = [image];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
