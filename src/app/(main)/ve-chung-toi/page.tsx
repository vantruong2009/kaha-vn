import type { Metadata } from 'next';
import Link from 'next/link';
import { parseJSON, SETTINGS_DEFAULTS } from '@/lib/site-settings';
import { getSettings } from '@/lib/site-settings-server';
import type { ArtisanItem, AboutValueItem, TimelineItem } from '@/lib/site-settings';

export const revalidate = 86400;


export const metadata: Metadata = {
  title: 'Về Chúng Tôi — Câu Chuyện KAHA | Đèn Lồng Thủ Công Việt Nam',
  description:
    'KAHA thành lập năm 2016, kết nối nghệ nhân làng nghề Hội An, Huế, Bà Rịa-Vũng Tàu với những người yêu đèn thủ công truyền thống Việt Nam.',
  alternates: { canonical: '/ve-chung-toi' },
  openGraph: {
    title: 'Về Chúng Tôi — KAHA',
    description: 'Câu chuyện của một gia đình và hành trình gìn giữ nghề đèn truyền thống Việt Nam.',
    type: 'website',
  },
};

export default async function AboutPage() {
  const settings = await getSettings();

  const artisans = parseJSON<ArtisanItem[]>(
    settings.about_artisans,
    parseJSON<ArtisanItem[]>(SETTINGS_DEFAULTS.about_artisans, [])
  );
  const values = parseJSON<AboutValueItem[]>(
    settings.about_values,
    parseJSON<AboutValueItem[]>(SETTINGS_DEFAULTS.about_values, [])
  );
  const timeline = parseJSON<TimelineItem[]>(
    settings.about_timeline,
    parseJSON<TimelineItem[]>(SETTINGS_DEFAULTS.about_timeline, [])
  );

  const heroTitle = settings.about_hero_title || 'Câu Chuyện KAHA';
  const heroSubtitle =
    settings.about_hero_subtitle ||
    'Từ tình yêu đèn lồng Hội An đến thương hiệu đèn trang trí thủ công hàng đầu Việt Nam';
  const story = settings.about_story || null;

  const stats = [
    { num: settings.about_stat_1_number || '15+',     label: settings.about_stat_1_label || 'Nghệ nhân' },
    { num: settings.about_stat_2_number || '500+',    label: settings.about_stat_2_label || 'Mẫu đèn' },
    { num: settings.about_stat_3_number || '8 Năm',   label: settings.about_stat_3_label || 'Kinh nghiệm' },
    { num: settings.about_stat_4_number || '10,000+', label: settings.about_stat_4_label || 'Đơn hàng' },
  ];

  const phone = settings.store_phone || SETTINGS_DEFAULTS.store_phone;
  const email = settings.store_email || SETTINGS_DEFAULTS.store_email;
  const zalo  = settings.zalo_phone  || SETTINGS_DEFAULTS.zalo_phone;

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* ═══════════════════════════════════════════
          HERO — amber gradient + stat bar
      ═══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: 'linear-gradient(135deg, #2C1500 0%, #6B3800 55%, #9B5C2A 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'rgba(242,183,5,0.08)' }} />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.04)' }} />

        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center relative z-10">
          {/* Lantern icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: 'rgba(201,130,42,0.18)', border: '1px solid rgba(201,130,42,0.35)' }}>
            <svg width="30" height="44" viewBox="0 0 60 86" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="30" y1="0" x2="30" y2="10" stroke="#F5C97C" strokeWidth="2" strokeLinecap="round"/>
              <rect x="18" y="8" width="24" height="5" rx="1.5" fill="#F5C97C"/>
              <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#F5C97C" strokeWidth="1.5" fill="rgba(245,201,124,0.12)"/>
              <line x1="22" y1="14" x2="22" y2="76" stroke="#F5C97C" strokeWidth="0.7" opacity="0.5"/>
              <line x1="30" y1="14" x2="30" y2="76" stroke="#F5C97C" strokeWidth="0.7" opacity="0.5"/>
              <line x1="38" y1="14" x2="38" y2="76" stroke="#F5C97C" strokeWidth="0.7" opacity="0.5"/>
              <rect x="18" y="74" width="24" height="5" rx="1.5" fill="#F5C97C"/>
              <line x1="30" y1="79" x2="30" y2="86" stroke="#F5C97C" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: '#F2B705' }}>
            Thành lập 2016 · Hội An &amp; TP.HCM
          </p>
          <h1
            className="font-bold text-white mb-5 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}
          >
            {heroTitle}
          </h1>
          <p className="text-white/75 leading-[1.85] max-w-2xl mx-auto mb-12"
            style={{ fontSize: '1.0625rem' }}>
            {heroSubtitle}
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(s => (
              <div
                key={s.num}
                className="rounded-2xl py-5 px-4 text-center"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="text-3xl font-bold mb-1" style={{ color: '#F2B705', letterSpacing: '-0.03em' }}>
                  {s.num}
                </div>
                <div className="text-xs text-white/55 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          BRAND STORY — 2 col: text + decorative panel
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">

            {/* Left — text */}
            <div className="md:w-[58%]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#D98E04' }}>
                Nguồn gốc
              </p>
              <h2
                className="font-bold text-[#1a1a1a] mb-6 leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.025em' }}
              >
                Bắt Đầu Từ Một <span style={{ color: '#1a6b3c' }}>Chiếc Đèn</span>
              </h2>

              <div className="text-[#4a4a4a] leading-[1.9] space-y-5" style={{ fontSize: '1rem' }}>
                {story ? (
                  <p>{story}</p>
                ) : (
                  <>
                    <p>
                      Năm 2016, hai vợ chồng người sáng lập KAHA — Minh và Hà — đi du lịch
                      Hội An trong tuần trăng mật. Giữa phố cổ lung linh ánh đèn, Hà mua một chiếc
                      đèn lồng từ một bà cụ 70 tuổi. Chiếc đèn đó không chỉ đẹp — nó kể câu chuyện
                      của một nghệ nhân đã dành cả đời gìn giữ nghề.
                    </p>
                    <p>
                      Trở về Sài Gòn, họ nhận ra: những chiếc đèn thủ công tuyệt vời như vậy đang dần
                      biến mất vì không có kênh bán hàng phù hợp. Các nghệ nhân già chỉ bán được cho
                      khách du lịch tại làng nghề, và con cháu họ không còn muốn tiếp tục nghề.
                    </p>
                    <p>
                      KAHA ra đời để giải quyết vấn đề đó:{' '}
                      <strong className="text-[#1a1a1a]">
                        kết nối người yêu thủ công mỹ nghệ với những nghệ nhân tài năng
                      </strong>
                      , đảm bảo rằng nghề làm đèn truyền thống Việt Nam sẽ được gìn giữ cho thế hệ
                      tiếp theo.
                    </p>
                    <p>
                      Hôm nay, với hai xưởng tại Hội An và TP.HCM, hơn 15 nghệ nhân đối tác và hơn
                      10.000 đơn hàng hoàn thành — chúng tôi vẫn tin rằng mỗi chiếc đèn lồng là một
                      câu chuyện đáng được kể.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right — workshop info panels */}
            <div className="md:w-[42%] space-y-4">
              {[
                {
                  svg: <svg width="18" height="18" viewBox="0 0 60 86" fill="none"><line x1="30" y1="0" x2="30" y2="10" stroke="#C9822A" strokeWidth="3" strokeLinecap="round"/><rect x="18" y="8" width="24" height="6" rx="2" fill="#C9822A"/><path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#C9822A" strokeWidth="2" fill="rgba(201,130,42,0.1)"/><rect x="18" y="74" width="24" height="6" rx="2" fill="#C9822A"/></svg>,
                  title: 'Xưởng Hội An',
                  desc: 'Nằm giữa làng nghề phố cổ — nơi 100% sản phẩm đèn lồng vải được tạo ra bởi nghệ nhân bản địa.',
                  detail: 'Hội An, Quảng Nam',
                  color: '#C9822A',
                  bg: '#FDF8EE',
                  border: '#C9822A',
                },
                {
                  svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
                  title: 'Xưởng TP.HCM',
                  desc: 'Kho trưng bày và phân phối 200+ mẫu đèn. Mở cửa 8:00–21:00 mỗi ngày, sẵn sàng tư vấn trực tiếp.',
                  detail: '262/1/93 Phan Anh, P. Phú Thạnh, TP.HCM',
                  color: '#104e2e',
                  bg: '#EAF5EE',
                  border: '#104e2e',
                },
                {
                  svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A67D65" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                  title: 'Thành lập 2016',
                  desc: 'Gần một thập kỷ xây dựng mạng lưới nghệ nhân, phục vụ khách trong nước và khách quốc tế mua trực tiếp.',
                  detail: 'Est. 2017 · Made in Vietnam',
                  color: '#A67D65',
                  bg: '#FAF3EE',
                  border: '#A67D65',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className="rounded-2xl p-5"
                  style={{ background: item.bg, border: `1.5px solid ${item.border}30` }}
                >
                  <div className="flex gap-4 items-start">
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}35` }}
                    >
                      {item.svg}
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a1a] text-sm mb-1">{item.title}</p>
                      <p className="text-[#4a4a4a] text-xs leading-relaxed mb-2">{item.desc}</p>
                      <span
                        className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: `${item.color}18`, color: item.color }}
                      >
                        {item.detail}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          VALUES — 4 cột nền cream
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#D98E04' }}>
              Giá trị cốt lõi
            </p>
            <h2
              className="font-bold text-[#1a1a1a]"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.025em' }}
            >
              Chúng Tôi <span style={{ color: '#1a6b3c' }}>Cam Kết</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {values.map((v, idx) => {
              const VALUE_ICONS = [
                <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9822A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2v0"/><path d="M14 10V6a2 2 0 00-2-2 2 2 0 00-2 2v3"/><path d="M10 10.5V8a2 2 0 00-2-2 2 2 0 00-2 2v7a6 6 0 006 6h2a6 6 0 006-6v-5a2 2 0 00-2-2 2 2 0 00-2 2v1"/></svg>,
                <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9822A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9822A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
                <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9822A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
              ];
              return (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
                style={{ border: '1.5px solid #EDE8E0' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#FDF8EE', border: '1px solid rgba(201,130,42,0.2)' }}
                >
                  {VALUE_ICONS[idx % VALUE_ICONS.length]}
                </div>
                <div className="font-bold text-[#1a1a1a] text-sm mb-2">{v.title}</div>
                <div className="text-xs text-[#4a4a4a] leading-relaxed">{v.desc}</div>
              </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          ARTISAN TEAM — 3 cards nghệ nhân
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#D98E04' }}>
              Những bàn tay vàng
            </p>
            <h2
              className="font-bold text-[#1a1a1a]"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.025em' }}
            >
              Gặp Gỡ Các <span style={{ color: '#1a6b3c' }}>Nghệ Nhân</span>
            </h2>
            <p className="text-[#666] text-sm mt-3 max-w-xl leading-relaxed">
              Mỗi chiếc đèn đều có tên người tạo ra nó. Đây là những người đang giúp chúng tôi gìn giữ
              nghề thủ công truyền thống Việt Nam.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artisans.map((a, idx) => {
              const accentColors = ['#C9822A', '#104e2e', '#A67D65'];
              const accent = accentColors[idx % accentColors.length];
              const initials = a.name.split(' ').slice(-2).map((w: string) => w[0]).join('').toUpperCase();
              return (
                <div
                  key={a.name}
                  className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                  style={{ border: '1.5px solid #EDE8E0' }}
                >
                  {/* Monogram header */}
                  <div
                    className="h-48 flex items-center justify-center"
                    style={{ background: `${accent}10`, borderBottom: `1.5px solid ${accent}20` }}
                  >
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-3xl"
                      style={{ background: `${accent}18`, border: `2px solid ${accent}35`, color: accent, letterSpacing: '-0.02em' }}
                    >
                      {initials}
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div
                      className="text-[10px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: accent }}
                    >
                      {a.region}
                    </div>
                    <h3 className="font-bold text-[#1a1a1a] text-xl mb-1" style={{ letterSpacing: '-0.02em' }}>
                      {a.name}
                    </h3>
                    <div className="text-xs font-semibold mb-4" style={{ color: accent }}>
                      {a.specialty} · {a.experience} kinh nghiệm
                    </div>
                    <p className="text-sm text-[#4a4a4a] leading-relaxed">{a.story}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          TIMELINE — hành trình 8 năm
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: '#3D2400' }}>
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#F2B705' }}>
              Hành trình
            </p>
            <h2
              className="font-bold text-white"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.025em' }}
            >
              Gần Một Thập Kỷ <span style={{ color: '#F2B705' }}>Gìn Giữ Nghề</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute top-0 bottom-0 w-0.5"
              style={{ left: '100px', background: 'rgba(242,183,5,0.2)' }}
            />

            <div className="space-y-9">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-6 items-start">
                  {/* Year */}
                  <div className="w-24 text-right flex-shrink-0">
                    <span
                      className="text-lg font-bold"
                      style={{ color: '#F2B705' }}
                    >
                      {item.year}
                    </span>
                  </div>

                  {/* Dot + text */}
                  <div className="relative pl-8">
                    <div
                      className="absolute rounded-full"
                      style={{
                        left: '-6px',
                        top: '6px',
                        width: '14px',
                        height: '14px',
                        background: i === timeline.length - 1 ? '#F2B705' : '#1a6b3c',
                        border: `3px solid #3D2400`,
                        boxShadow: `0 0 0 2px ${i === timeline.length - 1 ? '#F2B705' : '#1a6b3c'}55`,
                      }}
                    />
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          3 PILLARS — thủ công, truyền thống, chất lượng
      ═══════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#D98E04' }}>
              Triết lý
            </p>
            <h2
              className="font-bold text-[#1a1a1a]"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.025em' }}
            >
              Ba Điều Chúng Tôi <span style={{ color: '#1a6b3c' }}>Không Thỏa Hiệp</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2v0"/><path d="M14 10V6a2 2 0 00-2-2 2 2 0 00-2 2v3"/><path d="M10 10.5V8a2 2 0 00-2-2 2 2 0 00-2 2v7a6 6 0 006 6h2a6 6 0 006-6v-5a2 2 0 00-2-2 2 2 0 00-2 2v1"/></svg>,
                accent: '#C9822A',
                bg: '#FDF8EE',
                title: 'Thủ Công 100%',
                desc: 'Mỗi chiếc đèn đều được tạo ra bởi đôi tay người thợ — không dây chuyền, không khuôn đúc hàng loạt. Từng mảnh tre được chẻ, từng sợi vải được kéo, từng nút buộc đều có chủ đích.',
                tag: 'Handmade',
              },
              {
                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                accent: '#104e2e',
                bg: '#EAF5EE',
                title: 'Truyền Thống Chân Thực',
                desc: 'Kỹ thuật làm đèn lồng Hội An được UNESCO công nhận là di sản văn hóa phi vật thể. Chúng tôi hợp tác trực tiếp với các nghệ nhân học nghề từ cha mẹ, ông bà — không qua trung gian.',
                tag: 'Heritage',
              },
              {
                svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
                accent: '#A67D65',
                bg: '#FAF3EE',
                title: 'Chất Lượng Nhất Quán',
                desc: 'Mỗi lô hàng được kiểm tra trực tiếp tại xưởng trước khi xuất đi. Cam kết đổi trả 7 ngày không điều kiện nếu sản phẩm có lỗi kỹ thuật — vì chúng tôi tự hào về từng chiếc đèn.',
                tag: 'Quality',
              },
            ].map(p => (
              <div
                key={p.title}
                className="rounded-2xl p-7"
                style={{ background: p.bg, border: `1.5px solid ${p.accent}25` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${p.accent}18`, border: `1px solid ${p.accent}35`, color: p.accent }}
                >
                  {p.svg}
                </div>
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
                  style={{ background: `${p.accent}18`, color: p.accent }}
                >
                  {p.tag}
                </span>
                <h3
                  className="font-bold text-[#1a1a1a] text-base mb-3"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {p.title}
                </h3>
                <p className="text-sm text-[#4a4a4a] leading-[1.85]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          CONTACT CTA
      ═══════════════════════════════════════════ */}
      <section
        className="py-16 md:py-20 text-center"
        style={{ background: 'linear-gradient(135deg, #FAF7F2 0%, #FDF8E8 100%)', borderTop: '3px solid #F2B705' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex justify-center mb-5">
            <svg width="36" height="52" viewBox="0 0 60 86" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="30" y1="0" x2="30" y2="10" stroke="#C9822A" strokeWidth="2.5" strokeLinecap="round"/>
              <rect x="18" y="8" width="24" height="5" rx="1.5" fill="#C9822A"/>
              <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#C9822A" strokeWidth="1.5" fill="rgba(201,130,42,0.15)"/>
              <line x1="22" y1="14" x2="22" y2="76" stroke="#C9822A" strokeWidth="0.8" opacity="0.5"/>
              <line x1="30" y1="14" x2="30" y2="76" stroke="#C9822A" strokeWidth="0.8" opacity="0.5"/>
              <line x1="38" y1="14" x2="38" y2="76" stroke="#C9822A" strokeWidth="0.8" opacity="0.5"/>
              <rect x="18" y="74" width="24" height="5" rx="1.5" fill="#C9822A"/>
              <line x1="30" y1="79" x2="30" y2="86" stroke="#C9822A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2
            className="font-bold text-[#1a1a1a] mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.025em' }}
          >
            Mỗi Chiếc Đèn{' '}
            <span style={{ color: '#D98E04' }}>Chờ Đợi Bạn</span>
          </h2>
          <p className="text-[#4a4a4a] text-sm leading-relaxed mb-3 max-w-md mx-auto">
            Hãy tìm chiếc đèn mang câu chuyện của nghệ nhân bạn yêu thích, và để ánh sáng ấm áp đó
            lan tỏa trong không gian của bạn.
          </p>
          <p className="text-xs font-medium mb-8" style={{ color: '#1a6b3c' }}>
            Mở cửa 8:00–21:00 mỗi ngày · {phone} · {email}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 text-white text-sm font-bold px-7 py-3.5 rounded-full transition-colors"
              style={{ background: '#3D2400' }}
            >
              Khám phá sản phẩm →
            </Link>
            <a
              href={`https://zalo.me/${zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-full transition-colors"
              style={{ background: '#F2B705', color: '#3D2400' }}
            >
              Nhắn Zalo tư vấn →
            </a>
            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-full transition-colors"
              style={{ border: '2px solid #3D2400', color: '#3D2400', background: 'transparent' }}
            >
              Liên hệ chúng tôi
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
