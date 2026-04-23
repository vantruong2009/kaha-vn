import "server-only";

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

/**
 * In-memory rate limit (per process). Good enough for form spam throttling.
 * Returns true if limited.
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || now >= bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}
