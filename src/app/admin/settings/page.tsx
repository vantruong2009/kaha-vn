"use client";

import { useMemo, useState } from "react";
import type { SiteSettings } from "@/server/site-settings";

const FIELDS: Array<{ key: keyof SiteSettings; label: string }> = [
  { key: "siteName", label: "Site name" },
  { key: "tagline", label: "Tagline" },
  { key: "topbarText", label: "Topbar text" },
  { key: "topbarHref", label: "Topbar href" },
  { key: "hotline", label: "Hotline" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "logoText", label: "Logo text fallback" },
  { key: "primaryCtaLabel", label: "Primary CTA label" },
  { key: "primaryCtaHref", label: "Primary CTA href" },
  { key: "secondaryCtaLabel", label: "Secondary CTA label" },
  { key: "secondaryCtaHref", label: "Secondary CTA href" },
  { key: "facebookUrl", label: "Facebook URL" },
  { key: "instagramUrl", label: "Instagram URL" },
  { key: "youtubeUrl", label: "YouTube URL" },
  { key: "footerCopyright", label: "Footer copyright" },
];

function emptySettings(): SiteSettings {
  return {
    siteName: "",
    tagline: "",
    topbarText: "",
    topbarHref: "",
    hotline: "",
    email: "",
    address: "",
    logoText: "",
    primaryCtaLabel: "",
    primaryCtaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    footerCopyright: "",
  };
}

export default function AdminSettingsPage() {
  const [token, setToken] = useState("");
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [status, setStatus] = useState("Nhap token va bam Load.");
  const ready = useMemo(() => token.trim().length > 0, [token]);

  async function load() {
    setStatus("Dang load...");
    const r = await fetch("/api/admin/settings", {
      headers: { "x-admin-token": token.trim() },
    });
    const json = (await r.json()) as { ok: boolean; settings?: SiteSettings; error?: string };
    if (!json.ok || !json.settings) {
      setStatus(`Loi: ${json.error ?? "load_failed"}`);
      return;
    }
    setSettings(json.settings);
    setStatus("Da load settings.");
  }

  async function save() {
    setStatus("Dang luu...");
    const r = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token.trim(),
      },
      body: JSON.stringify(settings),
    });
    const json = (await r.json()) as { ok: boolean; settings?: SiteSettings; error?: string };
    if (!json.ok || !json.settings) {
      setStatus(`Loi: ${json.error ?? "save_failed"}`);
      return;
    }
    setSettings(json.settings);
    setStatus("Da luu settings.");
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-10">
      <h1 className="text-2xl font-semibold text-ink-900 [font-family:var(--font-display),serif]">
        Admin Settings
      </h1>
      <p className="mt-2 text-sm text-ink-600">
        Quan ly khung ngoai KAHA (header, topbar, footer, contact buttons).
      </p>

      <div className="mt-8 rounded border border-hairline bg-paper p-5">
        <label className="text-sm text-ink-700">
          Admin token (`ADMIN_SETTINGS_TOKEN`)
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mt-2 w-full border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={load}
            disabled={!ready}
            className="border border-ink-900 bg-ink-900 px-5 py-2 text-xs uppercase tracking-[0.08em] text-paper disabled:cursor-not-allowed disabled:opacity-50"
          >
            Load
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!ready}
            className="border border-hairline px-5 py-2 text-xs uppercase tracking-[0.08em] text-ink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
          <span className="self-center text-sm text-ink-600">{status}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="rounded border border-hairline bg-paper p-4 text-sm text-ink-700">
            {f.label}
            <input
              value={settings[f.key]}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              className="mt-2 w-full border border-hairline bg-paper px-3 py-2 text-sm outline-none focus:border-ink-300"
            />
          </label>
        ))}
      </div>
    </main>
  );
}
