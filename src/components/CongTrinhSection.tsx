'use client';
import { useState } from 'react';
import type { CongTrinhProject } from '@/lib/site-settings-public';
import { SETTINGS_DEFAULTS, parseJSON } from '@/lib/site-settings-public';

const DEFAULT_PROJECTS = parseJSON<CongTrinhProject[]>(SETTINGS_DEFAULTS.home_congtrinh_projects, []);

const TAG_COLORS: Record<string, string> = {
  'Sự kiện':   '#c9822a',
  'Khách sạn': '#104e2e',
  'TTTM':      '#6b5c3e',
  'Nhà hàng':  '#8b2323',
  'Showroom':  '#1a5c7a',
  'Quán cafe': '#5c3d1e',
  'Tâm linh':  '#7a4f9e',
};

const INIT_SHOW = 12;

interface Props {
  label?: string;
  heading?: string;
  desc?: string;
  stat1Num?: string;
  stat1Label?: string;
  stat2Num?: string;
  stat2Label?: string;
  ctaText?: string;
  ctaPhone?: string;
  projects?: CongTrinhProject[];
}

export default function CongTrinhSection({
  label,
  heading,
  desc,
  stat1Num,
  stat1Label,
  stat2Num,
  stat2Label,
  ctaText,
  ctaPhone,
  projects,
}: Props) {
  const [showAll, setShowAll] = useState(false);

  const resolvedLabel    = label    || SETTINGS_DEFAULTS.home_congtrinh_label;
  const resolvedHeading  = heading  || SETTINGS_DEFAULTS.home_congtrinh_heading;
  const resolvedDesc     = desc     || SETTINGS_DEFAULTS.home_congtrinh_desc;
  const resolvedStat1Num = stat1Num || SETTINGS_DEFAULTS.home_congtrinh_stat1_num;
  const resolvedStat1Lbl = stat1Label || SETTINGS_DEFAULTS.home_congtrinh_stat1_label;
  const resolvedStat2Num = stat2Num || SETTINGS_DEFAULTS.home_congtrinh_stat2_num;
  const resolvedStat2Lbl = stat2Label || SETTINGS_DEFAULTS.home_congtrinh_stat2_label;
  const resolvedCtaText  = ctaText  || SETTINGS_DEFAULTS.home_congtrinh_cta_text;
  const resolvedPhone    = ctaPhone || SETTINGS_DEFAULTS.home_congtrinh_cta_phone;
  const resolvedProjects = (projects && projects.length > 0) ? projects : DEFAULT_PROJECTS;

  const visible = showAll ? resolvedProjects : resolvedProjects.slice(0, INIT_SHOW);

  return (
    <div style={{ background: '#FAF7F2' }} className="py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6 md:mb-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#c9822a' }}>
              {resolvedLabel}
            </p>
            <h2 className="text-[1.75rem] md:text-[2.25rem] font-bold leading-tight" style={{ color: '#0f2f22', letterSpacing: '-0.028em' }}>
              {resolvedHeading}
            </h2>
            <p className="mt-2.5 text-[14px] leading-[1.7]" style={{ color: '#4a6b58' }}>
              {resolvedDesc}
            </p>
          </div>
          <div className="flex items-center gap-0 shrink-0 rounded-2xl overflow-hidden mt-2 md:mt-0"
            style={{ border: '1px solid rgba(16,78,46,0.12)', background: 'rgba(255,255,255,0.7)' }}>
            {[
              { n: resolvedStat1Num, l: resolvedStat1Lbl },
              { n: resolvedStat2Num, l: resolvedStat2Lbl },
            ].map(({ n, l }, i) => (
              <div key={l} className="text-center px-5 py-3"
                style={{ borderLeft: i > 0 ? '1px solid rgba(16,78,46,0.1)' : undefined }}>
                <div className="text-[1.6rem] font-bold leading-none" style={{ color: '#104e2e', letterSpacing: '-0.03em' }}>{n}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: '#7a9987' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {visible.map((p, i) => {
            const src = p.file.startsWith('http') ? p.file : `/images/cong-trinh/${p.file}`;
            return (
            <div key={`${p.file}-${i}`} className="group relative overflow-hidden rounded-xl" style={{ aspectRatio: '4 / 3' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={p.label}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-wider mb-1.5 px-2 py-0.5 rounded-full self-start text-white"
                  style={{ background: TAG_COLORS[p.tag] ?? '#104e2e' }}
                >
                  {p.tag}
                </span>
                <span className="text-white text-[12px] font-semibold leading-snug drop-shadow">{p.label}</span>
              </div>
            </div>
          );})}
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          {!showAll && resolvedProjects.length > INIT_SHOW && (
            <button
              onClick={() => setShowAll(true)}
              className="text-[12.5px] font-bold px-5 py-2.5 rounded-full transition-all duration-200"
              style={{ background: 'white', border: '1.5px solid #d4c9b8', color: '#3d2e1e', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; (e.currentTarget as HTMLElement).style.color = '#104e2e'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#d4c9b8'; (e.currentTarget as HTMLElement).style.color = '#3d2e1e'; }}
            >
              Xem thêm {resolvedProjects.length - INIT_SHOW} công trình
            </button>
          )}
          <a
            href={`tel:${resolvedPhone}`}
            className="inline-flex items-center gap-2 text-[12.5px] font-bold px-5 py-2.5 rounded-full transition-all duration-200 text-white"
            style={{ background: '#0a3320', boxShadow: '0 4px 12px rgba(10,51,32,0.22)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#08301d'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a3320'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            {resolvedCtaText} — {resolvedPhone.replace(/(\d{4})(\d{3})(\d{3})/, '$1.$2.$3')}
          </a>
        </div>

      </div>

    </div>
  );
}
