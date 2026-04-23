import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' https: data:",
  "img-src 'self' https: data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https:",
  "frame-ancestors 'self'",
  "form-action 'self'",
].join("; ");

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
          { key: "Content-Security-Policy", value: csp },
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
      {
        protocol: "https",
        hostname: "www.kaha.vn",
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
