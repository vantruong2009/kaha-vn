import "server-only";

import { unstable_cache } from "next/cache";
import { SETTINGS_DEFAULTS, type SiteSettings } from "@/lib/site-settings-public";

/**
 * Phase 1b stub — trả thuần defaults, chưa đọc từ Postgres.
 * Phase 1c/3 sẽ swap sang bản thật đọc `site_settings` table (cần port
 * `@/lib/postgres/commerce` trước). Giữ signature y hệt longdenviet để
 * các component ported không phải đổi import.
 */

const _fetchSettings = unstable_cache(
  async (): Promise<SiteSettings> => SETTINGS_DEFAULTS,
  ["site-settings"],
  { revalidate: 86400, tags: ["site-settings"] },
);

export async function getSettings(): Promise<SiteSettings> {
  return _fetchSettings();
}
