import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";
import { normalizeMediaBase } from "./src/lib/rewrite-kaha-media-url";

// ── R2 / media hostname ───────────────────────────────────────────────────
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
    const p =
      u.pathname && u.pathname !== "/"
        ? `${u.pathname.replace(/\/+$/, "")}/**`
        : "/**";
    return { protocol: "https", hostname: u.hostname, pathname: p };
  } catch {
    return null;
  }
}

const imageRemotePatterns: {
  protocol: "https";
  hostname: string;
  pathname: string;
}[] = [
  // WordPress cũ của kaha.vn
  { protocol: "https", hostname: "kaha.vn",     pathname: "/wp-content/uploads/**" },
  { protocol: "https", hostname: "www.kaha.vn", pathname: "/wp-content/uploads/**" },
  // Cloudflare R2
  { protocol: "https", hostname: "**.r2.dev",                 pathname: "/**" },
  { protocol: "https", hostname: "**.r2.cloudflarestorage.com", pathname: "/**" },
  // media.kaha.vn / cdn.kaha.vn (custom R2 domain)
  { protocol: "https", hostname: "media.kaha.vn", pathname: "/**" },
  { protocol: "https", hostname: "cdn.kaha.vn", pathname: "/**" },
  // External stock / unsplash (dev placeholders)
  { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
  { protocol: "https", hostname: "images.pexels.com",   pathname: "/**" },
];

const mediaExtra = mediaBaseRemotePattern();
if (mediaExtra) imageRemotePatterns.push(mediaExtra);

// ── Security headers (tương thích VPS Docker — không cần Vercel edge) ────
const securityHeaders = [
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${
        process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
      } https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.resend.com https://www.google-analytics.com https://analytics.google.com",
      "frame-src https://maps.google.com https://www.google.com https://www.openstreetmap.org",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",          // VPS Docker — bắt buộc
  trailingSlash: false,
  poweredByHeader: false,
  devIndicators: false,

  experimental: {
    viewTransition: true,
  },

  // ── Redirects: đọc từ JSON file (SEO-safe, dễ diff/audit) ───────────────
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
        source:      r.source,
        destination: r.destination,
        permanent:   r.permanent ?? true,
      }));
    } catch {
      return [];
    }
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(favicon.ico|logo.webp|robots.txt|sitemap.xml)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=3600" },
        ],
      },
      {
        source: "/data/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },

  images: {
    unoptimized: true,           // VPS không có image optimizer — tránh lãng phí CPU
    formats: ["image/avif", "image/webp"],
    remotePatterns: imageRemotePatterns,
  },
};

export default nextConfig;
