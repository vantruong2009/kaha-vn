import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";
import { normalizeMediaBase } from "./src/lib/rewrite-kaha-media-url";

function mediaBaseRemotePattern(): {
  protocol: "https";
  hostname: string;
  pathname: string;
} | null {
  const rawIn = process.env.NEXT_PUBLIC_MEDIA_BASE?.trim();
  if (!rawIn) return null;
  const raw = normalizeMediaBase(rawIn);
  try {
    const u = new URL(raw);
    const path =
      u.pathname && u.pathname !== "/"
        ? `${u.pathname.replace(/\/+$/, "")}/**`
        : "/**";
    return { protocol: "https", hostname: u.hostname, pathname: path };
  } catch {
    return null;
  }
}

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

const imageRemotePatterns = [
  {
    protocol: "https" as const,
    hostname: "kaha.vn",
    pathname: "/wp-content/uploads/**",
  },
  {
    protocol: "https" as const,
    hostname: "www.kaha.vn",
    pathname: "/wp-content/uploads/**",
  },
  { protocol: "https" as const, hostname: "**.r2.dev", pathname: "/**" },
  {
    protocol: "https" as const,
    hostname: "**.r2.cloudflarestorage.com",
    pathname: "/**",
  },
];
const mediaExtra = mediaBaseRemotePattern();
if (mediaExtra) imageRemotePatterns.push(mediaExtra);

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
    remotePatterns: imageRemotePatterns,
  },
};

export default nextConfig;
