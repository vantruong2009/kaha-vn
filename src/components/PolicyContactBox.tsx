// Shared contact info box for policy pages — uses SVG icons, no emoji

interface ContactItem {
  type: 'zalo' | 'email' | 'address' | 'messenger' | 'company';
  label: string;
  value: string;
  href?: string;
}

const ICONS = {
  zalo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 8l10 6 10-6"/>
    </svg>
  ),
  address: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.68 2 6 4.68 6 8c0 4.75 6 13 6 13s6-8.25 6-13c0-3.32-2.68-6-6-6z"/>
      <circle cx="12" cy="8" r="2"/>
    </svg>
  ),
  messenger: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  company: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="1"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="12.01"/>
    </svg>
  ),
};

const DEFAULT_ITEMS: ContactItem[] = [
  { type: 'zalo',    label: 'Zalo',    value: '0989 778 247 (8:00–21:00 mỗi ngày)', href: 'https://zalo.me/0989778247' },
  { type: 'email',   label: 'Email',   value: 'hi@kaha.vn',               href: 'mailto:hi@kaha.vn' },
  { type: 'address', label: 'Địa chỉ', value: '262/1/93 Phan Anh, Phường Phú Thạnh, Thành Phố Hồ Chí Minh, Việt Nam' },
];

export default function PolicyContactBox({ items = DEFAULT_ITEMS }: { items?: ContactItem[] }) {
  return (
    <div className="bg-[#fdf8f0] border border-[#e8d8b8] rounded-xl p-5 space-y-3">
      {items.map(({ type, label, value, href }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="shrink-0 w-7 h-7 rounded-lg bg-white border border-[#e8d8b8] flex items-center justify-center text-brand-amber">
            {ICONS[type]}
          </span>
          <span className="text-sm text-[#4a4a4a]">
            <strong className="text-[#1a1a1a] font-semibold">{label}:</strong>{' '}
            {href ? (
              <a href={href} className="text-brand-green hover:underline underline-offset-2">{value}</a>
            ) : (
              value
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
