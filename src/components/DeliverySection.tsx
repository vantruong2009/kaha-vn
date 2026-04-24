// DeliverySection — giao hàng toàn quốc 63 tỉnh thành
// CSS-only, no images, no emoji

const REGIONS = [
  {
    name: 'Miền Bắc',
    time: '2–4 ngày',
    provinces: 'Hà Nội, Hải Phòng, Quảng Ninh và 22 tỉnh',
    color: '#104e2e',
    bg: '#EAF5EE',
    border: '#104e2e',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    name: 'Miền Trung',
    time: '2–3 ngày',
    provinces: 'Đà Nẵng, Hội An, Huế và 14 tỉnh',
    color: '#C9822A',
    bg: '#FDF8EE',
    border: '#C9822A',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    name: 'Miền Nam',
    time: '1–2 ngày',
    provinces: 'TP.HCM, Bình Dương, Đồng Nai và 21 tỉnh',
    color: '#A67D65',
    bg: '#FAF3EE',
    border: '#A67D65',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    name: 'Hải đảo',
    time: '3–7 ngày',
    provinces: 'Phú Quốc, Côn Đảo, Kiên Hải, Trường Sa',
    color: '#2E7D6E',
    bg: '#EDF7F6',
    border: '#2E7D6E',
    svg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18M12 3a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
  },
];

const PARTNERS = [
  {
    name: 'GHN',
    desc: 'Giao Hàng Nhanh',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9822A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    name: 'GHTK',
    desc: 'Giao Hàng Tiết Kiệm',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    name: 'J&T Express',
    desc: 'Giao toàn quốc',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A67D65" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
];

export default function DeliverySection() {
  return (
    <div
      className="py-8 md:py-10"
      style={{ background: '#fff', borderTop: '1px solid #EDE5D8' }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="text-center mb-6 md:mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.22em] mb-2" style={{ color: '#D98E04' }}>
            Vận chuyển
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2rem)', letterSpacing: '-0.028em', color: '#0f2f22' }}
          >
            Giao Hàng <span style={{ color: '#1a6b3c' }}>63 Tỉnh Thành</span>
          </h2>
          <p className="text-sm text-[#666] mt-2 max-w-lg mx-auto leading-relaxed">
            Đóng gói hộp carton chắc chắn, bọc xốp mút từng chiếc. Miễn phí vận chuyển đơn từ 2.000.000đ nội thành TP.HCM.
          </p>
        </div>

        {/* 4 region cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-7">
          {REGIONS.map(r => (
            <div
              key={r.name}
              className="rounded-2xl p-5 text-center"
              style={{ background: r.bg, border: `1.5px solid ${r.border}25` }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: `${r.color}15`, border: `1px solid ${r.color}30`, color: r.color }}
              >
                {r.svg}
              </div>
              <div className="font-bold text-[#1a1a1a] text-sm mb-1">{r.name}</div>
              <div
                className="text-xs font-bold mb-2 px-2.5 py-0.5 rounded-full inline-block"
                style={{ background: `${r.color}15`, color: r.color }}
              >
                {r.time}
              </div>
              <div className="text-[11px] text-[#888] leading-relaxed">{r.provinces}</div>
            </div>
          ))}
        </div>

        {/* Bottom strip: partners + notes */}
        <div
          className="rounded-2xl px-6 py-4 md:py-5 flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center"
          style={{ background: '#FAF7F2', border: '1.5px solid #EDE8E0' }}
        >
          {/* Partners */}
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#888] mb-3">Đối tác vận chuyển</p>
            <div className="flex flex-wrap gap-4">
              {PARTNERS.map(p => (
                <div key={p.name} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: '#fff', border: '1.5px solid #EDE8E0' }}
                  >
                    {p.svg}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1a1a1a]">{p.name}</div>
                    <div className="text-[10px] text-[#999]">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px self-stretch bg-[#EDE8E0]" />

          {/* Notes */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>, text: 'Đóng gói hộp carton + xốp mút chuyên dụng' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>, text: 'Miễn phí ship nội thành HCM từ 2.000.000đ' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>, text: 'Có mã theo dõi đơn hàng sau khi xuất kho' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round"><polyline points="20,6 9,17 4,12"/></svg>, text: 'Đổi trả miễn phí 7 ngày nếu lỗi vận chuyển' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#EAF5EE' }}>
                  {n.icon}
                </div>
                <span className="text-xs text-[#444] leading-relaxed">{n.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
