import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ── Upstash Redis rate limiter (khi có env vars) ──────────────────────────
let redisClient: Redis | null = null;
const upstashLimiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redisClient = new Redis({ url, token });
  return redisClient;
}

function getUpstashLimiter(limit: number, windowMs: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const key = `${limit}:${windowMs}`;
  if (!upstashLimiters.has(key)) {
    upstashLimiters.set(
      key,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${Math.round(windowMs / 1000)} s`),
        prefix: "kaha_rl",
      }),
    );
  }
  return upstashLimiters.get(key)!;
}

// ── In-memory fallback (dev / VPS single-instance) ────────────────────────
const memStore = new Map<string, { count: number; resetAt: number }>();

function memRateLimit(identifier: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memStore.get(identifier);
  if (!entry || now > entry.resetAt) {
    memStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of memStore.entries()) {
    if (now > val.resetAt) memStore.delete(key);
  }
}, 300_000);

/** Trả về true nếu còn quota (allowed). Dùng Upstash nếu có, fallback in-memory. */
export async function rateLimitAsync(
  identifier: string,
  limit = 10,
  windowMs = 60_000,
): Promise<boolean> {
  const limiter = getUpstashLimiter(limit, windowMs);
  if (limiter) {
    const { success } = await limiter.limit(identifier);
    return success;
  }
  return memRateLimit(identifier, limit, windowMs);
}

/** Sync version — chỉ in-memory. Backward compat cho route cũ của longdenviet. */
export function rateLimit(identifier: string, limit = 10, windowMs = 60_000): boolean {
  return memRateLimit(identifier, limit, windowMs);
}
