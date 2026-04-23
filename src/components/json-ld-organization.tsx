import fs from "node:fs";
import path from "node:path";
import { getSiteUrl } from "@/lib/site-url";

const LOGO_PATH = path.join(process.cwd(), "public/images/logo.png");

export function JsonLdOrganization() {
  const base = getSiteUrl();
  const hasLogo = fs.existsSync(LOGO_PATH);
  const graph: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KAHA.VN",
    url: base,
  };
  if (hasLogo) {
    graph.logo = `${base}/images/logo.png`;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
