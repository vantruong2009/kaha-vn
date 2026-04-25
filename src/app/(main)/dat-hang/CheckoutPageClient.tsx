'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { fetchCustomerMe } from '@/lib/auth/fetch-customer-me';

/* ── Shared styles ── */
const inputBase: React.CSSProperties = {
  background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
  border: '1px solid #E8DDD0',
  borderRadius: '12px',
  color: '#1a1a1a',
  outline: 'none',
  width: '100%',
  padding: '11px 14px',
  fontSize: '13px',
  transition: 'border-color 0.15s',
};
const inputErr: React.CSSProperties = { ...inputBase, border: '1px solid #e87060' };

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[11px] mt-1 font-medium" style={{ color: '#d04a2e' }}>{msg}</p>;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
      <div className="p-5 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-5" style={{ color: '#c9822a' }}>{title}</p>
        {children}
      </div>
    </div>
  );
}

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, totalPrice, clearCart, coupon } = useCart();
  const [form, setForm] = useState({
    customerInfo: '', // Single field: "Tên: ...\nSĐT: ...\nĐịa chỉ: ..."
  });
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');
  const [payment, setPayment] = useState<'cod' | 'vnpay' | 'momo' | 'bank'>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payError, setPayError] = useState<{ title: string; message: string; method?: string } | null>(null);
  const [orderId, setOrderId] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Generate order ID on mount (format: LDV + MMDD + 3 random chars = 10 chars total)
  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    setOrderId(`LDV${mmdd}${random}`);
  }, []);

  const shippingFees = { standard: 35000, express: 65000 };
  const discount = coupon?.discount ?? 0;
  const discountedSubtotal = totalPrice - discount;
  const shippingFee = discountedSubtotal >= 500000 && shipping === 'standard' ? 0 : shippingFees[shipping];
  const total = discountedSubtotal + shippingFee;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerInfo.trim()) {
      e.customerInfo = 'Vui lòng nhập thông tin giao hàng';
    }
    return e;
  };

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      // Lấy userId nếu đã đăng nhập
      const user = await fetchCustomerMe();

      // Gọi API server-side (service_role — bypass RLS)
      const res: Response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          userId: user?.id ?? null,
          customerInfo: form.customerInfo,
          shipping,
          payment,
          items,
          subtotal: totalPrice,
          discount,
          couponId: coupon?.id ?? null,
          couponCode: coupon?.code ?? null,
          shippingFee,
          total,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.orderId) throw new Error(json.error || 'Không thể tạo đơn hàng');

      const dbOrderId = json.orderId;
      const orderNumber = json.orderNumber || dbOrderId;

      // Parse customerInfo for email
      const phoneClean = (form.customerInfo as string).replace(/\s/g, '');
      const phoneMatch = phoneClean.match(/0[0-9]{9}/);
      const phone = phoneMatch ? phoneMatch[0].substring(0, 10) : '';

      const lines = (form.customerInfo as string).split('\n');
      const name = lines[0]?.replace(/^Tên:\s*/i, '').trim() || 'Khách hàng';
      const address = (form.customerInfo as string)
        .replace(/Tên:\s*[^\n]*\n?/i, '')
        .replace(/SĐT:\s*[^\n]*\n?/i, '')
        .trim() || 'Không có địa chỉ cụ thể';

      // Try to get email from user auth
      const emailFromAuth = user?.email || '';

      // Send order confirmation email only if customer has email
      if (emailFromAuth) {
        await fetch('/api/email/order-confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customerName: name,
            customerEmail: emailFromAuth,
            customerPhone: phone,
            address,
            items: items.map(item => ({
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            })),
            subtotal: totalPrice,
            shippingFee,
            total,
            paymentMethod: payment === 'bank' ? 'bank' : 'cod',
            shippingMethod: shipping,
          }),
        }).catch(() => {}); // non-blocking email
      } else {
        console.log('[Checkout] Customer not authenticated — email confirmation skipped. Admin will receive notification via order tracking.');
      }

      clearCart();
      router.push(`/dat-hang/xac-nhan?id=${dbOrderId}&num=${encodeURIComponent(orderNumber)}`);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.';
      setPayError({
        title: 'Đặt hàng thất bại',
        message: msg,
      });
      setSubmitting(false);
    }
  };

  /* ── Label shared style ── */
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700, marginBottom: 6, color: '#c9822a' };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>

      {/* Page header */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
          <nav className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-[11px] font-medium transition-colors hover:text-[#104e2e]" style={{ color: '#a0907a' }}>Trang chủ</Link>
            <span style={{ color: '#c0b0a0' }}>›</span>
            <Link href="/gio-hang" className="text-[11px] font-medium transition-colors hover:text-[#104e2e]" style={{ color: '#a0907a' }}>Giỏ hàng</Link>
            <span style={{ color: '#c0b0a0' }}>›</span>
            <span className="text-[11px] font-semibold" style={{ color: '#1a1a1a' }}>Đặt hàng</span>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Thanh toán</p>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>Đặt hàng</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* ── Left: form ── */}
            <div className="flex flex-col gap-5">

              {/* Order ID Display — Client only to avoid hydration mismatch */}
              {isClient && (
                <div
                  className="relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #e6f2eb, #c8e6d4)', border: '2px solid #104e2e', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
                  <div className="p-5 md:p-6">
                    <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3" style={{ color: '#104e2e' }}>Mã đơn hàng của bạn</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div className="text-[24px] font-bold font-mono" style={{ color: '#104e2e', letterSpacing: '0.05em' }}>
                          {orderId}
                        </div>
                        <p className="text-[11px] mt-2" style={{ color: '#6a5840', lineHeight: '1.6' }}>
                          ✓ Sử dụng mã này làm <strong>ghi chú chuyển khoản</strong> kèm theo số điện thoại của bạn.<br/>
                          Ví dụ: <span style={{ color: '#c9822a' }} className="font-mono">{orderId} 0901234567</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(orderId);
                          alert('Đã copy mã đơn hàng!');
                        }}
                        style={{
                          padding: '10px 14px',
                          background: '#104e2e',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info — single textarea */}
              <SectionCard title="Thông tin giao hàng">
                <div>
                  <label style={labelStyle}>Tên, số điện thoại, địa chỉ *</label>
                  <textarea
                    value={form.customerInfo}
                    onChange={e => update('customerInfo', e.target.value)}
                    placeholder="Tên: Nguyễn Văn A&#10;SĐT: 0909 xxx xxx&#10;Địa chỉ: Số nhà, tên đường, phường/xã, quận, thành phố"
                    style={{
                      ...inputBase,
                      minHeight: '120px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      ...(errors.customerInfo ? { borderColor: '#e87060' } : {}),
                    }}
                    onFocus={e => { if (!errors.customerInfo) (e.currentTarget as HTMLElement).style.borderColor = '#104e2e'; }}
                    onBlur={e => { if (!errors.customerInfo) (e.currentTarget as HTMLElement).style.borderColor = '#E8DDD0'; }}
                  />
                  <p style={{ fontSize: '11px', color: '#a0907a', marginTop: '8px', lineHeight: '1.5' }}>
                    Gợi ý: Nhập đầy đủ tên, số điện thoại, và địa chỉ giao hàng (bao gồm tỉnh/thành phố). Chúng tôi sẽ xử lý đơn hàng sớm nhất có thể.
                  </p>
                  <FieldError msg={errors.customerInfo} />
                </div>
              </SectionCard>

              {/* Shipping */}
              <SectionCard title="Phương thức vận chuyển">
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'standard' as const, label: 'GHN Tiêu Chuẩn', sub: '3–5 ngày làm việc', display: totalPrice >= 500000 ? 'Miễn phí' : formatPrice(shippingFees.standard), free: totalPrice >= 500000 },
                    { id: 'express' as const, label: 'GHN Hỏa Tốc', sub: '1–2 ngày làm việc', display: formatPrice(shippingFees.express), free: false },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-3 cursor-pointer transition-all duration-200"
                      style={{
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: shipping === opt.id ? '2px solid #104e2e' : '1px solid #EDE5D8',
                        background: shipping === opt.id ? 'rgba(16,78,46,0.04)' : '#FFFDF8',
                        marginBottom: 0,
                      }}
                    >
                      <input
                        type="radio" name="shipping" value={opt.id}
                        checked={shipping === opt.id} onChange={() => setShipping(opt.id)}
                        className="accent-[#104e2e]"
                      />
                      <div className="flex-1">
                        <div className="text-[13px] font-semibold" style={{ color: '#1a1a1a' }}>{opt.label}</div>
                        <div className="text-[11px]" style={{ color: '#a0907a' }}>{opt.sub}</div>
                      </div>
                      <div className="text-[13px] font-bold" style={{ color: opt.free ? '#104e2e' : '#1a1a1a' }}>{opt.display}</div>
                    </label>
                  ))}
                </div>
              </SectionCard>

              {/* Payment */}
              <SectionCard title="Phương thức thanh toán">
                <div className="flex flex-col gap-3">
                  {[
                    {
                      id: 'cod' as const, label: 'Thanh toán khi nhận hàng (COD)', sub: 'Trả tiền mặt cho shipper khi nhận được đèn',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>,
                    },
                    {
                      id: 'bank' as const, label: 'Chuyển khoản ngân hàng', sub: 'Chuyển trực tiếp qua tài khoản Techcombank',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>,
                    },
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-3 cursor-pointer transition-all duration-200"
                      style={{
                        padding: '14px 16px',
                        borderRadius: '14px',
                        border: payment === opt.id ? '2px solid #104e2e' : '1px solid #EDE5D8',
                        background: payment === opt.id ? 'rgba(16,78,46,0.04)' : '#FFFDF8',
                      }}
                    >
                      <input
                        type="radio" name="payment" value={opt.id}
                        checked={payment === opt.id} onChange={() => setPayment(opt.id)}
                        className="accent-[#104e2e]"
                      />
                      <span className="shrink-0" style={{ color: payment === opt.id ? '#104e2e' : '#a0907a' }}>{opt.icon}</span>
                      <div>
                        <div className="text-[13px] font-semibold" style={{ color: '#1a1a1a' }}>{opt.label}</div>
                        <div className="text-[11px]" style={{ color: '#a0907a' }}>{opt.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </SectionCard>

              {/* Bank Transfer Details */}
              {payment === 'bank' && (
                <SectionCard title="Chi tiết chuyển khoản ngân hàng">
                  <div className="flex flex-col gap-4">
                    {/* QR Code */}
                    <div className="flex justify-center">
                      <img
                        src="/images/techcombank-qr.jpg"
                        alt="QR Code chuyển khoản Techcombank"
                        style={{
                          width: '280px',
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
                    <div style={{ background: '#f9f7f3', borderRadius: '12px', padding: '14px', borderLeft: '4px solid #c9822a' }}>
                      <div className="text-[12px] font-semibold mb-3" style={{ color: '#104e2e' }}>Thông tin tài khoản</div>

                      <div className="space-y-2">
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
                          <div className="text-[13px] font-semibold" style={{ color: '#1a1a1a' }}>Techcombank (Ngân hàng TMCP Kỹ Thương Việt Nam)</div>
                        </div>

                        <div>
                          <div className="text-[11px]" style={{ color: '#a0907a' }}>SWIFT Code</div>
                          <div className="text-[13px] font-semibold font-mono" style={{ color: '#1a1a1a' }}>VTCBVNVX</div>
                        </div>
                      </div>
                    </div>

                    {/* Transfer Note Instruction */}
                    <div style={{ background: '#e6f2eb', borderRadius: '12px', padding: '14px', borderLeft: '4px solid #104e2e' }}>
                      <div className="text-[12px] font-semibold mb-2" style={{ color: '#104e2e' }}>Ghi chú chuyển khoản</div>
                      <div className="text-[12px]" style={{ color: '#1a1a1a', lineHeight: '1.6' }}>
                        Vui lòng ghi chú theo mẫu sau khi chuyển khoản để chúng tôi xác nhận nhanh:
                      </div>
                      <div
                        className="text-[13px] font-mono font-semibold mt-2 p-2 rounded"
                        style={{
                          background: '#ffffff',
                          color: '#c9822a',
                          border: '1px solid #104e2e',
                          wordBreak: 'break-all',
                        }}
                      >
                        [Mã đơn hàng] [SĐT người mua]
                      </div>
                      <div className="text-[11px] mt-2" style={{ color: '#6a5840' }}>
                        Ví dụ: <span className="font-mono" style={{ color: '#c9822a' }}>ORD123456 0901234567</span>
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="text-[12px]" style={{ color: '#6a5840', background: '#fef9f0', padding: '12px', borderRadius: '10px', lineHeight: '1.6' }}>
                      ℹ️ <span className="font-medium">Lưu ý:</span> Đơn hàng của bạn sẽ được xác nhận khi chúng tôi nhận được thanh toán. Vui lòng liên hệ <span className="font-semibold text-[#c9822a]">0989.778.247</span> nếu có thắc mắc.
                    </div>
                  </div>
                </SectionCard>
              )}

            </div>

            {/* ── Right: order summary ── */}
            <div className="lg:sticky lg:top-24">
              <div
                className="relative overflow-hidden"
                style={{ background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <span className="absolute top-0 left-3 right-3" style={{ height: '1px', background: 'rgba(255,255,255,0.9)' }} />
                <div className="p-5 md:p-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-5" style={{ color: '#c9822a' }}>Đơn hàng của bạn</p>

                  {items.length === 0 ? (
                    <p className="text-[13px]" style={{ color: '#a0907a' }}>
                      Giỏ hàng trống.{' '}
                      <Link href="/san-pham" className="font-bold" style={{ color: '#104e2e' }}>Mua sắm ngay</Link>
                    </p>
                  ) : (
                    <>
                      {/* Items list */}
                      <div className="flex flex-col gap-3 mb-5">
                        {items.map(item => (
                          <div key={item.id} className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}>
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] font-semibold leading-snug truncate" style={{ color: '#1a1a1a' }}>{item.name}</div>
                              <div className="text-[11px]" style={{ color: '#a0907a' }}>x{item.quantity}</div>
                            </div>
                            <div className="text-[12px] font-bold whitespace-nowrap" style={{ color: '#104e2e' }}>
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Price breakdown */}
                      <div className="flex flex-col gap-2.5 mb-5 py-4" style={{ borderTop: '1px solid #EDE5D8', borderBottom: '1px solid #EDE5D8' }}>
                        <div className="flex justify-between text-[13px]">
                          <span style={{ color: '#6a5840' }}>Tạm tính</span>
                          <span className="font-semibold" style={{ color: '#1a1a1a' }}>{formatPrice(totalPrice)}</span>
                        </div>
                        {coupon && (
                          <div className="flex justify-between text-[13px]">
                            <span style={{ color: '#104e2e' }}>Mã <span className="font-bold">{coupon.code}</span></span>
                            <span className="font-semibold" style={{ color: '#104e2e' }}>-{formatPrice(discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[13px]">
                          <span style={{ color: '#6a5840' }}>Vận chuyển</span>
                          <span className="font-semibold" style={{ color: shippingFee === 0 ? '#104e2e' : '#1a1a1a' }}>
                            {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-baseline mb-5">
                        <span className="text-[13px] font-semibold" style={{ color: '#6a5840' }}>Tổng cộng</span>
                        <span className="text-[26px] font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>{formatPrice(total)}</span>
                      </div>
                    </>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={items.length === 0 || submitting}
                    className="relative w-full text-[13px] font-bold text-white overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: items.length === 0 || submitting
                        ? '#aaa'
                        : 'linear-gradient(to bottom, #1a6b3c, #104e2e)',
                      borderRadius: '14px',
                      padding: '14px',
                      boxShadow: items.length === 0 || submitting ? 'none' : '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)',
                    }}
                    onMouseEnter={e => { if (items.length > 0 && !submitting) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
                  >
                    {!(items.length === 0 || submitting) && (
                      <span className="absolute top-0 left-2 right-2" style={{ height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                    )}
                    {submitting ? 'Đang xử lý...' : payment === 'cod' ? 'Đặt hàng ngay' : 'Xem chi tiết chuyển khoản'}
                  </button>

                  <p className="text-[10px] text-center mt-3 leading-relaxed" style={{ color: '#c0b0a0' }}>
                    Bằng cách đặt hàng, bạn đồng ý với điều khoản và chính sách bảo mật của KAHA.
                  </p>

                  {/* Trust / Business Verification */}
                  <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(16,78,46,0.1)' }}>
                    {/* Photo + Certificate card */}
                    <div className="flex gap-2 mb-3">
                      {/* Storefront photo */}
                      <div style={{ flex: 1.2, borderRadius: 10, overflow: 'hidden', border: '1px solid #e8e0d5', flexShrink: 0 }}>
                        <img
                          src="/images/trust/storefront.jpg"
                          alt="Cửa hàng KAHA 262/1/93 Phan Anh"
                          style={{ width: '100%', height: 80, objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                        />
                      </div>
                      {/* Certificate card */}
                      <div style={{ flex: 1, borderRadius: 10, border: '1px solid #e0dbd2', background: 'linear-gradient(135deg, #fdfcfa 0%, #f8f4ee 100%)', padding: '8px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: 8, fontWeight: 700, color: '#8a7a6a', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>Đã đăng ký HKDNN</div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 2 }}>KAHA HOME</div>
                          <div style={{ fontSize: 9, color: '#6a5840' }}>MST: 079192026914</div>
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <div className="flex items-center gap-1 mb-1">
                            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#27ae60', flexShrink: 0 }} />
                            <span style={{ fontSize: 8, fontWeight: 700, color: '#27ae60' }}>NNT đang hoạt động</span>
                          </div>
                          <a
                            href="https://tracuunnt.gdt.gov.vn/tcnnt/mstcn.jsp"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 8, color: '#8a7a6a', textDecoration: 'none', lineHeight: 1.4, display: 'block' }}
                          >
                            Cục Thuế — Bộ Tài Chính →
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Business info strip */}
                    <div style={{ background: 'linear-gradient(135deg, #f0f7f3 0%, #e8f2ec 100%)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(16,78,46,0.12)' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#104e2e', marginBottom: 7, letterSpacing: '-0.01em' }}>
                        HỘ KINH DOANH KAHA HOME
                      </div>
                      {/* Address + map */}
                      <div className="flex items-start gap-1.5 mb-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span style={{ fontSize: 10, color: '#5a4a3a', lineHeight: 1.5 }}>
                          262/1/93 Phan Anh, P. Phú Thạnh, Q. Tân Phú, TP.HCM
                          {' '}
                          <a
                            href="https://maps.app.goo.gl/8ENJ223BHiCdHTy76"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#104e2e', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
                          >
                            Xem bản đồ →
                          </a>
                        </span>
                      </div>
                      {/* Phone + Email */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <div className="flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6.07 6.07l1.61-1.02a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          <span style={{ fontSize: 10, color: '#5a4a3a' }}>0989.778.247</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                          </svg>
                          <span style={{ fontSize: 10, color: '#5a4a3a' }}>hi@kaha.vn</span>
                        </div>
                      </div>
                    </div>

                    {/* International customers photo strip */}
                    <div style={{ marginTop: 14 }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#6a5840' }}>Khách du lịch quốc tế đã ghé thăm</span>
                      </div>
                      <div
                        className="flex gap-2 overflow-x-auto"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 2 }}
                      >
                        {[
                          { src: '/images/en/international-customer-longdenviet-4.webp', alt: 'Khách quốc tế tại KAHA' },
                          { src: '/images/en/international-customer-longdenviet-8.webp', alt: 'Khách du lịch tại cửa hàng đèn lồng' },
                          { src: '/images/en/international-customer-longdenviet-1.webp', alt: 'Khách nước ngoài mua đèn lồng' },
                          { src: '/images/en/international-customer-longdenviet-6.webp', alt: 'Khách châu Âu tại KAHA' },
                        ].map((photo, i) => (
                          <div
                            key={i}
                            style={{
                              flexShrink: 0,
                              width: 72,
                              height: 72,
                              borderRadius: 10,
                              overflow: 'hidden',
                              border: '1.5px solid #e8e0d5',
                            }}
                          >
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Payment error modal */}
      {payError && (
        <>
          <div className="fixed inset-0 z-[500]" style={{ background: 'rgba(0,0,0,0.52)' }} onClick={() => setPayError(null)} aria-hidden />
          <div className="fixed inset-0 z-[501] flex items-center justify-center px-4">
            <div style={{ background: '#FFFDF8', borderRadius: 20, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', width: '100%', maxWidth: 420, padding: '28px 24px 24px', position: 'relative' }}>
              {/* Icon */}
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fde8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>{payError.title}</p>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 20 }}>{payError.message}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Gợi ý phương thức thanh toán thay thế */}
                {payError.method === 'vnpay' && (
                  <button
                    onClick={() => { setPayError(null); setPayment('momo'); }}
                    style={{ background: '#a5317e', color: 'white', border: 'none', borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/></svg>
                    Thử thanh toán qua MoMo
                  </button>
                )}
                {payError.method === 'momo' && (
                  <button
                    onClick={() => { setPayError(null); setPayment('vnpay'); }}
                    style={{ background: '#d0021b', color: 'white', border: 'none', borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    Thử thanh toán qua VNPay
                  </button>
                )}
                {payError.method && (
                  <button
                    onClick={() => { setPayError(null); setPayment('cod'); }}
                    style={{ background: '#104e2e', color: 'white', border: 'none', borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Thanh toán khi nhận hàng (COD)
                  </button>
                )}
                <button
                  onClick={() => { setPayError(null); }}
                  style={{ background: '#f5f0e8', color: '#555', border: 'none', borderRadius: 12, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Thử lại
                </button>
                <a
                  href="tel:0989778247"
                  style={{ textAlign: 'center', fontSize: 12, color: '#c9822a', fontWeight: 600, textDecoration: 'none', padding: '6px 0' }}
                >
                  Liên hệ hỗ trợ: 0989.778.247
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
