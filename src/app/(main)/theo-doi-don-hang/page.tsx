'use client';

import { useState } from 'react';

type OrderStatus = 'placed' | 'processing' | 'shipping' | 'delivered';

interface OrderItem { name: string; qty: number; price: number; }
interface Order {
  id: string;
  status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
  total?: number;
}

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'placed',     label: 'Đã đặt hàng' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'shipping',   label: 'Đang giao hàng' },
  { key: 'delivered',  label: 'Đã nhận hàng' },
];

const STATUS_INDEX: Record<OrderStatus, number> = { placed: 0, processing: 1, shipping: 2, delivered: 3 };

const inputStyle: React.CSSProperties = {
  background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
  border: '1px solid #E8DDD0',
  borderRadius: '12px',
  color: '#1a1a1a',
  outline: 'none',
  width: '100%',
  padding: '11px 14px',
  fontSize: '13px',
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    setNotFound(false);
    setSearched(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), phone: phone.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.order) setNotFound(true);
      else setOrder(json.order as Order);
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }

  const currentStepIndex = order ? (STATUS_INDEX[order.status] ?? 0) : -1;

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-lg mx-auto px-6 py-10 md:py-14">
          <p className="text-[11px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Đơn hàng</p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>Theo dõi đơn hàng</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-5">

        {/* Search card */}
        <div
          className="relative overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
          <div className="p-5 md:p-6">
            <p className="text-[11px] uppercase tracking-[0.22em] font-bold mb-5" style={{ color: '#c9822a' }}>Tra cứu đơn hàng</p>

            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] font-bold mb-1.5" style={{ color: '#c9822a' }}>Mã đơn hàng</label>
                <input
                  type="text" value={orderId} onChange={e => setOrderId(e.target.value)}
                  required placeholder="LDV-XXXXXXXX"
                  style={inputStyle}
                  onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }}
                />
                <p className="text-[11px] mt-1" style={{ color: '#c0b0a0' }}>Mã đơn hàng có trong email xác nhận của bạn</p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] font-bold mb-1.5" style={{ color: '#c9822a' }}>Số điện thoại đặt hàng</label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  required placeholder="0912 345 678"
                  style={inputStyle}
                  onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                  onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }}
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="relative w-full text-[13px] font-bold text-white overflow-hidden transition-all duration-200 disabled:opacity-50"
                style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', borderRadius: '14px', padding: '13px', boxShadow: '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)' }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                <span className="absolute top-0 left-2 right-2" style={{ height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                {loading ? 'Đang tra cứu...' : 'Tra cứu đơn hàng'}
              </button>
            </form>

            {!searched && (
              <p className="text-[11px] text-center mt-5 pt-4" style={{ color: '#c0b0a0', borderTop: '1px solid #EDE5D8' }}>
                Mã đơn hàng bắt đầu bằng <span className="font-bold">LDV-</span> và nằm trong email hoặc SMS xác nhận
              </p>
            )}

            {searched && notFound && (
              <div className="mt-5 pt-4 text-center" style={{ borderTop: '1px solid #EDE5D8' }}>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9822a" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <p className="text-[13px] mb-2" style={{ color: '#6a5840' }}>Không tìm thấy đơn hàng với thông tin đã nhập.</p>
                <p className="text-[11px]" style={{ color: '#a0907a' }}>
                  Vui lòng kiểm tra lại hoặc liên hệ{' '}
                  <a href="tel:+84989778247" className="font-bold hover:underline" style={{ color: '#104e2e' }}>0989.778.247</a>
                </p>
              </div>
            )}

            {order && (
              <div className="mt-5 pt-5" style={{ borderTop: '1px solid #EDE5D8' }}>
                <p className="text-[11px] uppercase tracking-[0.18em] font-bold mb-4" style={{ color: '#c9822a' }}>
                  Trạng thái #{order.id.slice(0, 8).toUpperCase()}
                </p>

                {/* Timeline */}
                <ol className="relative ml-3" style={{ borderLeft: '2px solid #EDE5D8' }}>
                  {STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <li key={step.key} className="ml-5 mb-4 last:mb-0">
                        <span
                          className="absolute flex items-center justify-center w-5 h-5 rounded-full"
                          style={{
                            left: -2,
                            marginTop: 2,
                            transform: 'translateX(-50%)',
                            background: isDone ? '#104e2e' : '#FFFFFF',
                            border: `2px solid ${isDone ? '#104e2e' : '#EDE5D8'}`,
                          }}
                        >
                          {isDone && (
                            <svg width="9" height="9" viewBox="0 0 12 10" fill="none">
                              <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <p className="text-[13px] font-semibold" style={{ color: isCurrent ? '#104e2e' : isDone ? '#1a1a1a' : '#c0b0a0' }}>
                          {step.label}
                          {isCurrent && (
                            <span
                              className="ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(16,78,46,0.1)', color: '#104e2e' }}
                            >
                              Hiện tại
                            </span>
                          )}
                        </p>
                      </li>
                    );
                  })}
                </ol>

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-5 pt-4" style={{ borderTop: '1px solid #EDE5D8' }}>
                    <p className="text-[11px] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: '#c9822a' }}>Sản phẩm đặt mua</p>
                    <div className="flex flex-col gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[12px]">
                          <span style={{ color: '#6a5840' }}>{item.name} <span style={{ color: '#a0907a' }}>x{item.qty}</span></span>
                          <span className="font-semibold" style={{ color: '#1a1a1a' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.total != null && (
                      <div className="flex justify-between mt-3 pt-3 text-[13px] font-bold" style={{ borderTop: '1px solid #EDE5D8' }}>
                        <span style={{ color: '#1a1a1a' }}>Tổng cộng</span>
                        <span style={{ color: '#104e2e' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {order.created_at && (
                  <p className="text-[11px] mt-4" style={{ color: '#c0b0a0' }}>
                    Đặt hàng: {new Date(order.created_at).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Support card */}
        <div
          className="relative overflow-hidden"
          style={{ background: 'rgba(16,78,46,0.04)', border: '1px solid rgba(16,78,46,0.12)', borderRadius: '20px' }}
        >
          <div className="p-5 text-center">
            <p className="text-[13px] mb-4" style={{ color: '#6a5840' }}>Cần hỗ trợ? Liên hệ trực tiếp với chúng tôi:</p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <a
                href="tel:+84989778247"
                className="flex items-center justify-center gap-2 text-[12px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)', borderRadius: '12px', padding: '10px 20px', boxShadow: '0 3px 10px rgba(16,78,46,.3)' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                0989.778.247
              </a>
              <a
                href="/lien-he"
                className="flex items-center justify-center gap-2 text-[12px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', border: '1px solid rgba(16,78,46,0.3)', borderRadius: '12px', padding: '10px 20px', color: '#104e2e' }}
              >
                Nhắn tin tư vấn
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
