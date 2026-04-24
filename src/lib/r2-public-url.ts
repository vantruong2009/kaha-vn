/**
 * Canonical Cloudflare R2 public URL helpers cho KAHA.
 * Thứ tự ưu tiên env: NEXT_PUBLIC_MEDIA_BASE (KAHA legacy) → R2_PUBLIC_URL → default.
 * Giữ origin công khai ở 1 nơi để uploads, preconnects, next/image host allowlists đồng bộ.
 */

const DEFAULT_R2_PUBLIC_URL = "https://media.kaha.vn";
const LEGACY_S3_HOST_RE = /\.s3(\.auto)?\.amazonaws\.com$/i;

function resolveRawBase(): string {
  return (
    process.env.NEXT_PUBLIC_MEDIA_BASE?.trim() ||
    process.env.R2_PUBLIC_URL?.trim() ||
    ""
  );
}

function normalizeBaseUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim().replace(/\/+$/, "");
  const parsed = new URL(trimmed);
  if (LEGACY_S3_HOST_RE.test(parsed.hostname)) {
    throw new Error(
      `R2 public URL phải là host R2 công khai, không phải S3 cũ: ${parsed.hostname}`,
    );
  }
  return parsed.toString().replace(/\/+$/, "");
}

export function getR2PublicUrl(): string {
  const raw = resolveRawBase();
  return normalizeBaseUrl(raw || DEFAULT_R2_PUBLIC_URL);
}

export function requireR2PublicUrl(): string {
  const raw = resolveRawBase();
  if (!raw) {
    throw new Error("Thiếu NEXT_PUBLIC_MEDIA_BASE / R2_PUBLIC_URL");
  }
  return normalizeBaseUrl(raw);
}

export function buildR2PublicUrl(objectKey: string, baseUrl = getR2PublicUrl()): string {
  const base = normalizeBaseUrl(baseUrl);
  const key = objectKey
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return key ? `${base}/${key}` : base;
}
