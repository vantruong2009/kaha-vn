import "server-only";
import { cache } from "react";
import { getPool } from "@/server/db";

export type SiteSettings = {
  siteName: string;
  tagline: string;
  topbarText: string;
  topbarHref: string;
  hotline: string;
  email: string;
  address: string;
  logoText: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  footerCopyright: string;
};

type DbSettingRow = {
  key: string;
  value: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "KAHA.VN",
  tagline: "Xuong gia cong den vai cao cap tai Viet Nam",
  topbarText: "Xu?ng KAHA: gia cong den vai theo thong so du an - Phan hoi RFQ trong 48h",
  topbarHref: "/showroom",
  hotline: "090 515 1701",
  email: "hi@kaha.vn",
  address: "262/1/93 Phan Anh, P. Phu Thanh, Tan Phu, TP.HCM",
  logoText: "KAHA.VN",
  primaryCtaLabel: "Dat lich xuong",
  primaryCtaHref: "/showroom",
  secondaryCtaLabel: "Xem catalog",
  secondaryCtaHref: "/shop",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  footerCopyright: "© KAHA.VN",
};

const SITE_SETTING_KEYS = [
  "siteName",
  "tagline",
  "topbarText",
  "topbarHref",
  "hotline",
  "email",
  "address",
  "logoText",
  "primaryCtaLabel",
  "primaryCtaHref",
  "secondaryCtaLabel",
  "secondaryCtaHref",
  "facebookUrl",
  "instagramUrl",
  "youtubeUrl",
  "footerCopyright",
] as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];

function clamp(input: unknown, max = 400): string {
  const text = String(input ?? "").trim().replace(/\s+/g, " ");
  return text.length > max ? text.slice(0, max) : text;
}

function pickSettings(input: Partial<SiteSettings>): SiteSettings {
  const merged: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
  for (const key of SITE_SETTING_KEYS) {
    const next = clamp(input[key], 500);
    if (next) merged[key] = next;
  }
  return merged;
}

export async function ensureSiteSettingsTable(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) return;
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key text PRIMARY KEY,
      value text NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!process.env.DATABASE_URL?.trim()) return DEFAULT_SITE_SETTINGS;
  try {
    await ensureSiteSettingsTable();
    const pool = getPool();
    const r = await pool.query<DbSettingRow>(
      `SELECT key, value FROM site_settings WHERE key = ANY($1::text[])`,
      [SITE_SETTING_KEYS],
    );
    const fromDb: Partial<SiteSettings> = {};
    for (const row of r.rows) {
      if (SITE_SETTING_KEYS.includes(row.key as SiteSettingKey)) {
        fromDb[row.key as SiteSettingKey] = row.value;
      }
    }
    return pickSettings(fromDb);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
});

export async function upsertSiteSettings(
  input: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const settings = pickSettings(input);
  if (!process.env.DATABASE_URL?.trim()) return settings;
  await ensureSiteSettingsTable();
  const pool = getPool();
  const entries = Object.entries(settings) as Array<[SiteSettingKey, string]>;
  for (const [key, value] of entries) {
    await pool.query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [key, value],
    );
  }
  return settings;
}
