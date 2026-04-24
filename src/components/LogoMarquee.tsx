import { SETTINGS_DEFAULTS, parseJSON } from '@/lib/site-settings-public';

interface Props {
  label?: string;
  brands?: string[];
}

export default function LogoMarquee({ label, brands }: Props) {
  const resolvedLabel = label || SETTINGS_DEFAULTS.home_marquee_label;
  const resolvedBrands: string[] = brands?.length
    ? brands
    : parseJSON<string[]>(SETTINGS_DEFAULTS.home_marquee_brands, ['AEON Mall', 'Vincom', 'Kaha Living', 'JICA Japan', 'Asiana Plaza']);

  const track = [...resolvedBrands, ...resolvedBrands];

  return (
    <div>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginBottom: '18px' }}>
        <span style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(to left, #D4C9B8, transparent)' }} />
        <p style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.24em',
          color: '#B8A898',
          fontFamily: "'Be Vietnam Pro', sans-serif",
          whiteSpace: 'nowrap',
        }}>
          {resolvedLabel}
        </p>
        <span style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(to right, #D4C9B8, transparent)' }} />
      </div>

      {/* Marquee */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '72px', zIndex: 2,
          background: 'linear-gradient(to right, #FAF7F2, transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '72px', zIndex: 2,
          background: 'linear-gradient(to left, #FAF7F2, transparent)',
          pointerEvents: 'none',
        }} />

        <style>{`
          @keyframes ldv-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .ldv-track {
            display: flex;
            align-items: center;
            width: max-content;
            animation: ldv-marquee 36s linear infinite;
            gap: 12px;
            padding: 6px 0 10px;
          }
          .ldv-track:hover { animation-play-state: paused; }
        `}</style>

        <div className="ldv-track">
          {track.map((brand, i) => (
            <span
              key={i}
              aria-hidden={i >= resolvedBrands.length ? 'true' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
                padding: '9px 22px',
                borderRadius: '10px',
                border: '1px solid #E5DDD3',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
                fontSize: '13px',
                fontWeight: 700,
                color: '#2d2218',
                whiteSpace: 'nowrap',
                fontFamily: "'Be Vietnam Pro', sans-serif",
                letterSpacing: '-0.01em',
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
