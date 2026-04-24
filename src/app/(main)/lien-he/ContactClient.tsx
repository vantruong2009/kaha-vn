'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const DEFAULT_FAQ_ITEMS = [
  { q: 'Giao hàng mất bao lâu?', a: 'Nội thành TP.HCM 1-2 ngày · Tỉnh thành 2-5 ngày làm việc qua GHN/GHTK' },
  { q: 'Có đặt sỉ được không?', a: 'Có, từ 10 sản phẩm trở lên. Liên hệ để nhận báo giá sỉ và ưu đãi đặc biệt.' },
  { q: 'In logo lên đèn được không?', a: 'Được, tối thiểu 20 chiếc. Giao trong 7-10 ngày làm việc sau khi xác nhận mẫu.' },
  { q: 'Đổi trả như thế nào?', a: 'Đổi trả miễn phí trong 7 ngày nếu lỗi sản xuất. Giữ nguyên bao bì khi gửi trả.' },
  { q: 'Thanh toán bằng gì?', a: 'COD, chuyển khoản, MoMo, VNPay. Không thu thêm phí cổng thanh toán.' },
  { q: 'Có cửa hàng vật lý không?', a: 'Có. Hội An (xưởng sản xuất), Hà Nội và TP.HCM. Xem địa chỉ chi tiết tại trang Chi nhánh.' },
];

function AccordionItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid #EDE5D8' }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between py-4 text-left" aria-expanded={open}>
        <span className="text-[13px] font-semibold leading-snug pr-4" style={{ color: open ? '#104e2e' : '#1a1a1a' }}>{q}</span>
        <span
          className="ml-4 shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ border: `2px solid ${open ? '#104e2e' : '#C8BAA8'}`, background: open ? '#104e2e' : 'transparent' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke={open ? 'white' : '#888'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      {open && <div className="pb-4"><p className="text-[13px] leading-[1.8]" style={{ color: '#6a5840' }}>{a}</p></div>}
    </div>
  );
}

interface FaqItem { q: string; a: string; }
interface ContactInfo {
  phone: string; hours: string; email: string; address: string;
  zalo: string; b2bMin: string; b2bDesc: string; faqItems?: FaqItem[];
}

const inputStyle: React.CSSProperties = {
  background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
  border: '1px solid #E8DDD0', borderRadius: '12px',
  color: '#1a1a1a', outline: 'none', width: '100%',
  padding: '10px 14px', fontSize: '13px',
};

const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5240212955405!2d106.62461700000001!3d10.771118999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2d324f4659%3A0xe6b0024a73e13b8f!2zTG9uZ0RlblZpZXTCriAtIFjGsOG7n25nIMSQw6huIEzhu5NuZyBUcmFuZyBUcsOtIChWaWV0bmFtIExhbnRlcm5zKQ!5e0!3m2!1svi!2s!4v1773776842447!5m2!1svi!2s';
const MAP_URL = 'https://maps.app.goo.gl/HDNEMQ3cbMbKtykVA';

export default function ContactClient({ contact }: { contact: ContactInfo }) {
  const faqItems = contact.faqItems?.length ? contact.faqItems : DEFAULT_FAQ_ITEMS;
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill từ bundle combo (ref=combo&name=...&price=...)
  useEffect(() => {
    const ref = searchParams.get('ref');
    const name = searchParams.get('name');
    const price = searchParams.get('price');
    if (ref === 'combo' && name) {
      setForm(prev => ({
        ...prev,
        subject: `Đặt combo: ${name}`,
        message: `Tôi muốn đặt "${name}"${price ? ` (${price})` : ''}.\nVui lòng tư vấn và xác nhận đơn hàng giúp tôi.`,
      }));
    }
  }, [searchParams]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok || data.error) setError(data.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      else setSubmitted(true);
    } catch { setError('Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.'); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: '#FAF7F2' }}>
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #e6f2eb, #c8e6d4)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3" style={{ color: '#c9822a' }}>Thành công</p>
          <h2 className="text-[22px] font-bold mb-3" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>Đã nhận tin nhắn</h2>
          <p className="text-[13px] leading-[1.8] mb-8" style={{ color: '#6a5840' }}>Chúng tôi sẽ liên hệ lại trong vòng 2 giờ.</p>
          <Link href="/" className="text-[13px] font-semibold hover:underline" style={{ color: '#104e2e' }}>← Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Liên hệ</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>Chúng tôi luôn sẵn sàng lắng nghe.</h1>
          <p className="text-[13px]" style={{ color: '#a0907a' }}>Tư vấn · Đặt hàng · Báo giá sỉ · Hỗ trợ sau bán hàng</p>
        </div>
      </div>

      {/* ── Main: left (info + form) | right (map sticky) ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

          {/* Left column */}
          <div className="flex flex-col gap-4">

            {/* Contact cards row — 2-col on md */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Phone */}
              <div className="relative overflow-hidden" style={{ background: '#fff', border: '1px solid #EDE5D8', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
                <div className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #e6f2eb, #c8e6d4)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.1 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#c9822a' }}>Hotline</p>
                    <a href={`tel:+84${contact.phone.replace(/\D/g, '').replace(/^0/, '')}`} className="text-[14px] font-bold hover:underline block" style={{ color: '#1a1a1a' }}>{contact.phone}</a>
                    <p className="text-[10px]" style={{ color: '#a0907a' }}>{contact.hours}</p>
                  </div>
                </div>
                <a
                  href={`tel:+84${contact.phone.replace(/\D/g, '').replace(/^0/, '')}`}
                  className="block w-full text-center text-[11px] font-bold text-white py-2.5 transition-all"
                  style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Gọi ngay
                </a>
              </div>

              {/* Email */}
              <div className="relative overflow-hidden" style={{ background: '#fff', border: '1px solid #EDE5D8', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
                <div className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #FFF6EC, #FEE9CE)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9822a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] font-bold" style={{ color: '#c9822a' }}>Email</p>
                    <a href={`mailto:${contact.email}`} className="text-[13px] font-bold hover:underline block truncate" style={{ color: '#1a1a1a' }}>{contact.email}</a>
                    <p className="text-[10px]" style={{ color: '#a0907a' }}>Phản hồi trong 2 giờ</p>
                  </div>
                </div>
                <a
                  href={`mailto:${contact.email}`}
                  className="block w-full text-center text-[11px] font-bold py-2.5 transition-all"
                  style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', borderTop: '1px solid #EDE5D8', color: '#6a5840' }}
                >
                  Gửi email
                </a>
              </div>

              {/* Chat */}
              <div className="relative overflow-hidden sm:col-span-2" style={{ background: '#fff', border: '1px solid #EDE5D8', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
                <div className="p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-[9px] uppercase tracking-[0.18em] font-bold mb-2.5" style={{ color: '#c9822a' }}>Chat trực tiếp — phản hồi trong 30 phút</p>
                    <div className="flex gap-2.5 flex-wrap">
                      <a href={`https://zalo.me/${contact.zalo}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white transition-all hover:-translate-y-0.5"
                        style={{ background: '#0068FF', borderRadius: '10px', padding: '8px 16px', boxShadow: '0 3px 10px rgba(0,104,255,.3)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z"/></svg>
                        Zalo
                      </a>
                      <a href="https://m.me/longdenviet" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white transition-all hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #00B2FF, #7B2FFF)', borderRadius: '10px', padding: '8px 16px', boxShadow: '0 3px 10px rgba(123,47,255,.25)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.955 1.44 5.59 3.7 7.329V22l3.37-1.85a10.27 10.27 0 002.83.384c5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.99 12.44l-2.55-2.72-4.97 2.72 5.47-5.81 2.61 2.72 4.91-2.72-5.47 5.81z"/></svg>
                        Messenger
                      </a>
                    </div>
                  </div>
                  {/* Address inline */}
                  <div className="hidden md:flex items-start gap-3 pl-4 shrink-0 max-w-[220px]" style={{ borderLeft: '1px solid #EDE5D8' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a5840" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] font-bold mb-1" style={{ color: '#c9822a' }}>Địa chỉ</p>
                      <p className="text-[11px] leading-[1.6]" style={{ color: '#6a5840' }}>{contact.address}</p>
                      <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold hover:underline mt-1 inline-block" style={{ color: '#104e2e' }}>
                        Xem Maps →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Contact form */}
            <div className="relative overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
              <div className="px-5 pt-5 pb-1">
                <p className="text-[10px] uppercase tracking-[0.22em] font-bold" style={{ color: '#c9822a' }}>Gửi tin nhắn</p>
              </div>
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                {error && (
                  <div className="rounded-xl p-3 text-[12px] font-medium" style={{ background: '#fde5d8', border: '1px solid #e87060', color: '#d04a2e' }}>{error}</div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.18em] font-bold mb-1" style={{ color: '#c9822a' }}>Họ và tên *</label>
                    <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Nguyễn Văn A" required style={inputStyle}
                      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }} />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.18em] font-bold mb-1" style={{ color: '#c9822a' }}>Điện thoại *</label>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="0909 xxx xxx" required style={inputStyle}
                      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }} />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.18em] font-bold mb-1" style={{ color: '#c9822a' }}>Email</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@cua-ban.com" style={inputStyle}
                      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }} />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-[0.18em] font-bold mb-1" style={{ color: '#c9822a' }}>Chủ đề</label>
                    <input type="text" value={form.subject} onChange={e => update('subject', e.target.value)} placeholder="Đặt sỉ, thiết kế..." style={inputStyle}
                      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }} />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.18em] font-bold mb-1" style={{ color: '#c9822a' }}>Nội dung *</label>
                  <textarea value={form.message} onChange={e => update('message', e.target.value)}
                    placeholder="Tôi muốn hỏi về đèn lồng cho quán cà phê..." rows={4} required
                    style={{ ...inputStyle, resize: 'none', lineHeight: '1.7' }}
                    onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                    onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }} />
                </div>
                <button type="submit" disabled={loading}
                  className="relative w-full text-[13px] font-bold text-white overflow-hidden transition-all duration-200 disabled:opacity-50"
                  style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', borderRadius: '14px', padding: '13px', boxShadow: '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)' }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
                >
                  <span className="absolute top-0 left-2 right-2" style={{ height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                  {loading ? 'Đang gửi...' : 'Gửi tin nhắn →'}
                </button>
              </form>
            </div>

          </div>

          {/* Right: Map sticky */}
          <div className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden" style={{ borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', border: '1px solid #EDE5D8' }}>
              <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', borderBottom: '1px solid #EDE5D8' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #e6f2eb, #c8e6d4)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 19.5h20L12 2z" fill="#4285F4"/>
                    <path d="M12 2L2 19.5h10V2z" fill="#1A73E8"/>
                    <path d="M12 7v12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate" style={{ color: '#1a1a1a' }}>LongDenViet — Xưởng Đèn Lồng</p>
                  <p className="text-[10px]" style={{ color: '#a0907a' }}>262/1/93 Phan Anh, TP.HCM</p>
                </div>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold hover:underline whitespace-nowrap shrink-0" style={{ color: '#104e2e' }}>
                  Chỉ đường →
                </a>
              </div>
              <div style={{ aspectRatio: '1/1', position: 'relative' }}>
                <iframe src={MAP_SRC} width="100%" height="100%"
                  style={{ border: 0, display: 'block', position: 'absolute', inset: 0 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="LongDenViet — Địa chỉ kinh doanh" />
              </div>
            </div>

            {/* ── Car navigation tip ── */}
            <div className="mt-4 rounded-2xl overflow-hidden" style={{ border: '1.5px solid #F5C842', boxShadow: '0 4px 16px rgba(201,130,42,0.12)' }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(135deg, #FFF8E0, #FDEDB0)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F5C842, #E8A820)' }}>
                  <svg width="20" height="18" viewBox="0 0 24 20" fill="none" aria-hidden="true">
                    <rect x="2" y="7" width="20" height="10" rx="3" fill="white" fillOpacity=".9"/>
                    <path d="M4 7L6.5 2H17.5L20 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6.5" cy="17" r="2.2" fill="#E8A820"/>
                    <circle cx="17.5" cy="17" r="2.2" fill="#E8A820"/>
                    <rect x="9" y="9" width="6" height="4" rx="1" fill="#E8A820" fillOpacity=".5"/>
                    <circle cx="6.5" cy="17" r="1" fill="white"/>
                    <circle cx="17.5" cy="17" r="1" fill="white"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: '#7A4E08' }}>Hướng dẫn vào bằng ô tô</p>
                  <p className="text-[10px]" style={{ color: '#A06C20' }}>Google Maps đôi khi chỉ sai đường — đọc kỹ trước khi đến</p>
                </div>
              </div>

              {/* Route cards */}
              <div className="grid grid-cols-2 gap-0" style={{ background: '#FFFDF8' }}>
                {/* ✓ Correct route */}
                <div className="p-3.5" style={{ borderRight: '1px solid #F5E8C0' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#104e2e' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: '#104e2e' }}>Vào được</span>
                  </div>
                  <p className="text-[12px] font-bold leading-snug mb-1" style={{ color: '#1a1a1a' }}>Đường Phan Anh</p>
                  <p className="text-[11px] leading-[1.6]" style={{ color: '#6a5840' }}>Rẽ vào <strong>hẻm 262</strong> trên đường Phan Anh — đường rộng, ô tô vào thoải mái.</p>
                </div>
                {/* ✗ Wrong route */}
                <div className="p-3.5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: '#d04a2e' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: '#d04a2e' }}>Tránh đường này</span>
                  </div>
                  <p className="text-[12px] font-bold leading-snug mb-1" style={{ color: '#1a1a1a' }}>Hẻm 87 Tô Hiệu</p>
                  <p className="text-[11px] leading-[1.6]" style={{ color: '#6a5840' }}>Google Maps hay gợi ý nhưng đường rất hẹp — ô tô <strong>không vào được</strong>.</p>
                </div>
              </div>

              {/* CTA */}
              <div className="px-4 py-3" style={{ background: '#FFF8E0', borderTop: '1px solid #F5E8C0' }}>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=10.771119,106.624617&travelmode=driving"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold transition-opacity hover:opacity-80"
                  style={{ color: '#8B5E0A' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                  </svg>
                  Chỉ đường đến 262 Phan Anh →
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom: B2B + FAQ side by side ── */}
      <div style={{ borderTop: '1px solid #EDE5D8' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

          {/* B2B */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3" style={{ color: '#c9822a' }}>Dành cho doanh nghiệp</p>
            <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>Đặt sỉ &amp; Thiết kế theo yêu cầu</h2>
            <p className="text-[13px] leading-[1.8] mb-5" style={{ color: '#6a5840' }}>{contact.b2bDesc}</p>
            <div className="flex flex-col gap-0 mb-5">
              {[`Đặt từ ${contact.b2bMin} trở lên`, 'Thiết kế theo logo thương hiệu', 'Tư vấn không gian miễn phí', 'Giao hàng toàn quốc'].map(item => (
                <div key={item} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid #EDE5D8' }}>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ border: '2px solid #104e2e' }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className="text-[13px]" style={{ color: '#2a1f14' }}>{item}</span>
                </div>
              ))}
            </div>
            <a href={`mailto:${contact.email}`}
              className="relative inline-flex items-center justify-center text-[13px] font-bold text-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', borderRadius: '14px', padding: '12px 24px', boxShadow: '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)' }}
            >
              <span className="absolute top-0 left-2 right-2" style={{ height: '1px', background: 'rgba(255,255,255,0.25)' }} />
              Nhận báo giá ngay →
            </a>
          </div>

          {/* FAQ */}
          <div>
            <div className="flex items-end justify-between mb-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-1" style={{ color: '#c9822a' }}>Hỗ trợ</p>
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>Câu hỏi thường gặp</h2>
              </div>
              <Link href="/hoi-dap" className="text-[12px] font-semibold hover:underline whitespace-nowrap shrink-0" style={{ color: '#104e2e' }}>
                Xem thêm →
              </Link>
            </div>
            <div style={{ borderTop: '1px solid #EDE5D8' }}>
              {faqItems.map((item, i) => (
                <AccordionItem key={i} q={item.q} a={item.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
