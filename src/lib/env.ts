/**
 * Env validation — cảnh báo nếu thiếu, không throw (đáp ứng deploy dần).
 * Services chưa config sẽ rơi về fallback/in-memory, xem lib tương ứng.
 */
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  NEXT_PUBLIC_GA_ID: z.string().optional(),

  ADMIN_PASSWORD: z.string().optional(),

  NEXTAUTH_SECRET: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  CUSTOMER_SESSION_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),

  VPS_DATABASE_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),

  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),

  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),
  NEXT_PUBLIC_MEDIA_BASE: z.string().url().optional(),

  MOMO_PARTNER_CODE: z.string().optional(),
  MOMO_ACCESS_KEY: z.string().optional(),
  MOMO_SECRET_KEY: z.string().optional(),
  MOMO_ENDPOINT: z.string().url().optional(),
  VNPAY_URL: z.string().url().optional(),
  VNPAY_TMN_CODE: z.string().optional(),
  VNPAY_HASH_SECRET: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  ORDER_NOTIFY_EMAIL: z.string().email().optional(),

  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.warn("[env] Environment variable warnings:", result.error.flatten().fieldErrors);
}

export const env = (result.data ?? process.env) as z.infer<typeof envSchema>;
