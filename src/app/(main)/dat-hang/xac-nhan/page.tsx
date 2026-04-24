import Link from 'next/link';
import { fetchOrderWithItemsByIdPg, hasPostgresConfigured } from '@/lib/postgres/commerce';
import { HoverLink, HoverLinkWithShadow } from './HoverLink';

export const metadata = {
  title: 'Đặt Hàng Thành Công | LongDenViet',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ id?: string; num?: string }>;
}

export default async function OrderConfirmPage({ searchParams }: Props) {
  const { id, num } = await searchParams;
  const orderNumber = num ? decodeURIComponent(num) : '';

  let order: Awaited<ReturnType<typeof fetchOrderWithItemsByIdPg>> = null;
  if (id && hasPostgresConfigured()) {
    try {
      order = await fetchOrderWithItemsByIdPg(id);
    } catch {
      order = null;
    }
  }

  const shortId = orderNumber || (id ? id.slice(0, 8).toUpperCase() : '—');

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-2xl mx-auto px-6 py-10 md:py-14">
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>LongDenViet</p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>Xác nhận đơn hàng</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 md:py-12">

        {/* Success card */}
        <div
          className="relative overflow-hidden text-center mb-5"
          style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <span className="absolute top-0 left-4 right-4" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
          <div className="p-8 md:p-10">
            {/* Success icon */}
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg, #e6f2eb, #c8e6d4)' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3" style={{ color: '#c9822a' }}>Thành công</p>
            <h2 className="text-[26px] font-bold mb-2" style={{ color: '#104e2e', letterSpacing: '-0.03em' }}>
              Đơn hàng đã được tiếp nhận!
            </h2>
            <p className="text-[14px] leading-[1.8] mb-5" style={{ color: '#6a5840' }}>
              Cảm ơn bạn đã tin tưởng và lựa chọn LongDenViet.
            </p>

            {/* Order ID badge */}
            <div
              className="inline-block rounded-2xl px-6 py-3 mb-6"
              style={{ background: 'rgba(16,78,46,0.06)', border: '1px solid rgba(16,78,46,0.15)' }}
            >
              <div className="text-[10px] uppercase tracking-[0.18em] font-bold mb-1" style={{ color: '#a0907a' }}>Mã đơn hàng</div>
              <div className="text-[22px] font-bold" style={{ color: '#104e2e', letterSpacing: '0.05em' }}>#{shortId}</div>
            </div>

            {/* Order details */}
            {order && (
              <div
                className="text-left rounded-2xl mb-6"
                style={{ border: '1px solid #EDE5D8', background: '#FAFAF8' }}
              >
                {[
                  { label: 'Người nhận', value: order.receiver_name },
                  { label: 'Số điện thoại', value: order.receiver_phone },
                  { label: 'Địa chỉ', value: order.receiver_address },
                  {
                    label: 'Thanh toán',
                    value: order.payment_method === 'cod' ? 'Tiền mặt (COD)' : order.payment_method === 'bank' ? 'Chuyển khoản ngân hàng' : order.payment_method?.toUpperCase()
                  },
                ].map(({ label, value }, i) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 px-5 py-3"
                    style={{ borderBottom: i < 3 ? '1px solid #EDE5D8' : 'none' }}
                  >
                    <span className="text-[12px]" style={{ color: '#a0907a' }}>{label}</span>
                    <span className="text-[13px] font-semibold text-right" style={{ color: '#1a1a1a', maxWidth: '60%' }}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-4" style={{ borderTop: '1px solid #EDE5D8', background: 'rgba(16,78,46,0.03)' }}>
                  <span className="text-[13px] font-bold" style={{ color: '#1a1a1a' }}>Tổng cộng</span>
                  <span className="text-[18px] font-bold" style={{ color: '#104e2e' }}>
                    {order.total?.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            )}

            {/* Notification box */}
            <div
              className="rounded-2xl p-5 mb-6 text-left"
              style={{ background: 'rgba(201,130,42,0.08)', border: '1px solid rgba(201,130,42,0.2)' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(201,130,42,0.15)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9822a" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] font-bold mb-1" style={{ color: '#2a1f14' }}>Xác nhận qua Zalo / SMS</div>
                  <p className="text-[12px] leading-[1.8]" style={{ color: '#6a5840' }}>
                    Chúng tôi sẽ liên hệ xác nhận trong vòng <strong>30 phút</strong>.
                    Vui lòng giữ điện thoại để xác nhận thông tin giao hàng.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Number & Bank Transfer Info */}
            {order && (orderNumber || order.payment_method === 'bank') && (
              <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
                <div className="p-5 text-left" style={{ borderBottom: '1px solid #EDE5D8', background: 'linear-gradient(135deg, #e6f2eb, #c8e6d4)' }}>
                  <div className="text-[13px] font-bold" style={{ color: '#104e2e' }}>Mã đơn hàng & Ghi chú chuyển khoản</div>
                </div>

                <div className="p-5 space-y-4">
                  {orderNumber && (
                    <div style={{ background: '#f9f7f3', borderRadius: '12px', padding: '14px', borderLeft: '4px solid #c9822a' }}>
                      <div className="text-[11px]" style={{ color: '#a0907a' }}>Mã đơn hàng của bạn</div>
                      <div className="text-[20px] font-bold font-mono mt-2" style={{ color: '#104e2e', letterSpacing: '0.05em' }}>
                        {orderNumber}
                      </div>
                      <div className="text-[11px] mt-3" style={{ color: '#6a5840', lineHeight: '1.6' }}>
                        ℹ️ <strong>Khi chuyển khoản:</strong> Ghi chú <span className="font-mono" style={{ color: '#c9822a' }}>{orderNumber} {order.receiver_phone}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bank Transfer Details (if applicable) */}
            {order && order.payment_method === 'bank' && (
              <div className="rounded-2xl overflow-hidden mb-8" style={{ background: '#FFFFFF', border: '1px solid #EDE5D8' }}>
                <div className="p-5 text-left" style={{ borderBottom: '1px solid #EDE5D8', background: 'rgba(201,130,42,0.04)' }}>
                  <div className="text-[13px] font-bold" style={{ color: '#104e2e' }}>Chi tiết chuyển khoản ngân hàng</div>
                </div>

                <div className="p-5 space-y-4">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <img
                      src="/images/techcombank-qr.jpg"
                      alt="QR Code chuyển khoản Techcombank"
                      style={{
                        width: '260px',
                        height: 'auto',
                        borderRadius: '16px',
                        border: '2px solid #EDE5D8',
                        padding: '10px',
                        background: '#FFFDF8',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    />
                  </div>

                  {/* Account Details */}
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px]" style={{ color: '#a0907a' }}>Chủ tài khoản</div>
                      <div className="text-[13px] font-semibold" style={{ color: '#1a1a1a' }}>NGUYEN HUY KHANH HA</div>
                    </div>

                    <div>
                      <div className="text-[11px]" style={{ color: '#a0907a' }}>Số tài khoản</div>
                      <div className="text-[13px] font-semibold font-mono" style={{ color: '#1a1a1a' }}>19040136053011</div>
                    </div>

                    <div>
                      <div className="text-[11px]" style={{ color: '#a0907a' }}>Ngân hàng</div>
                      <div className="text-[13px] font-semibold" style={{ color: '#1a1a1a' }}>Techcombank</div>
                    </div>

                    <div>
                      <div className="text-[11px]" style={{ color: '#a0907a' }}>SWIFT Code</div>
                      <div className="text-[13px] font-semibold font-mono" style={{ color: '#1a1a1a' }}>VTCBVNVX</div>
                    </div>
                  </div>

                  {/* Transfer Note Instruction */}
                  <div style={{ background: '#e6f2eb', borderRadius: '10px', padding: '12px', borderLeft: '4px solid #104e2e', marginTop: '16px' }}>
                    <div className="text-[12px] font-semibold mb-2" style={{ color: '#104e2e' }}>Ghi chú chuyển khoản</div>
                    <div className="text-[11px] mb-2" style={{ color: '#1a1a1a', lineHeight: '1.6' }}>
                      Vui lòng ghi chú theo mẫu để chúng tôi xác nhận nhanh:
                    </div>
                    <div
                      className="text-[12px] font-mono font-semibold p-2 rounded"
                      style={{
                        background: '#ffffff',
                        color: '#c9822a',
                        border: '1px solid #104e2e',
                        wordBreak: 'break-all',
                        textAlign: 'center',
                      }}
                    >
                      [Mã đơn hàng] [SĐT người mua]
                    </div>
                    <div className="text-[10px] mt-2" style={{ color: '#6a5840' }}>
                      Ví dụ: <span className="font-mono" style={{ color: '#c9822a' }}>ORD123456 0901234567</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress steps */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Tiếp nhận đơn', done: true, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
                { label: 'Đóng gói & giao GHN', done: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> },
                { label: 'Giao đến bạn', done: false, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg> },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{
                      background: step.done ? 'linear-gradient(135deg, #e6f2eb, #c8e6d4)' : '#F5F0E8',
                      color: step.done ? '#104e2e' : '#c0b0a0',
                    }}
                  >
                    {step.icon}
                  </div>
                  <div className="text-[10px] text-center leading-tight font-semibold" style={{ color: step.done ? '#104e2e' : '#c0b0a0' }}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <HoverLink
                href="/san-pham"
                className="relative inline-flex items-center justify-center gap-2 text-[13px] font-bold text-white overflow-hidden transition-all duration-200"
                style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', borderRadius: '14px', padding: '12px 24px', boxShadow: '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)' }}
              >
                <span className="absolute top-0 left-2 right-2" style={{ height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                Tiếp tục mua sắm
              </HoverLink>
              <HoverLinkWithShadow
                href="/tai-khoan"
                className="inline-flex items-center justify-center text-[13px] font-semibold transition-all duration-200"
                style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', border: '1px solid #E8DDD0', borderRadius: '14px', padding: '12px 24px', color: '#6a5840' }}
              >
                Xem đơn hàng
              </HoverLinkWithShadow>
            </div>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-[12px]" style={{ color: '#a0907a' }}>
          Có thắc mắc?{' '}
          <a href="https://zalo.me/0989778247" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: '#104e2e' }}>
            Liên hệ Zalo
          </a>
          {' '}hoặc{' '}
          <Link href="/lien-he" className="font-bold hover:underline" style={{ color: '#104e2e' }}>trang liên hệ</Link>
        </p>

      </div>
    </div>
  );
}
