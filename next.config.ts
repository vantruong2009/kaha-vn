import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  poweredByHeader: false,
  async redirects() {
    try {
      const fp = path.join(process.cwd(), "docs/redirects/redirects.json");
      const rows = JSON.parse(fs.readFileSync(fp, "utf8")) as Array<{
        source: string;
        destination: string;
        permanent?: boolean;
      }>;
      if (!Array.isArray(rows)) return [];
      return rows.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: r.permanent ?? true,
      }));
    } catch {
      return [];
    }
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kaha.vn",
        pathname: "/wp-content/uploads/**",
      },
      { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
