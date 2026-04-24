'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';

/* ─── Qty stepper ─── */
function QtyControl({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div
      className="flex items-center"
      style={{
        background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
        border: '1px solid #E8DDD0',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 flex items-center justify-center text-[#6a5840] hover:bg-black/[0.04] transition-colors text-base font-light select-none"
        aria-label="Giảm"
      >
        −
      </button>
      <span className="w-8 text-center text-[13px] font-bold text-[#2a1f14] select-none">{value}</span>
      <button
        onClick={() => onChange(Math.min(10, value + 1))}
        className="w-8 h-8 flex items-center justify-center text-[#6a5840] hover:bg-black/[0.04] transition-colors text-base font-light select-none"
        aria-label="Tăng"
      >
        +
      </button>
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyCart() {
  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-3" style={{ color: '#c9822a' }}>Giỏ hàng</p>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>
            Giỏ hàng trống
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-sm">
          {/* Lantern illustration */}
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
            style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}
          >
            <svg width="36" height="52" viewBox="0 0 60 86" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="30" y1="0" x2="30" y2="10" stroke="#c9822a" strokeWidth="2.5" strokeLinecap="round"/>
              <rect x="18" y="8" width="24" height="5" rx="2" fill="#c9822a"/>
              <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#104e2e" strokeWidth="2" fill="rgba(16,78,46,0.07)"/>
              <line x1="20" y1="30" x2="40" y2="30" stroke="#104e2e" strokeWidth="1" strokeOpacity="0.3"/>
              <line x1="18" y1="46" x2="42" y2="46" stroke="#104e2e" strokeWidth="1" strokeOpacity="0.3"/>
              <line x1="20" y1="62" x2="40" y2="62" stroke="#104e2e" strokeWidth="1" strokeOpacity="0.3"/>
              <rect x="18" y="74" width="24" height="5" rx="2" fill="#c9822a"/>
              <line x1="30" y1="79" x2="30" y2="86" stroke="#c9822a" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <p className="text-[15px] leading-[1.8] mb-8" style={{ color: '#6a5840' }}>
            Bạn chưa thêm sản phẩm nào. Khám phá bộ sưu tập đèn lồng thủ công Hội An
            và tìm chiếc đèn phù hợp cho không gian của bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Primary CTA — dark green gradient */}
            <Link
              href="/san-pham"
              className="inline-flex items-center justify-center gap-2 text-[13px] font-bold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)',
                borderRadius: '14px',
                padding: '12px 24px',
                boxShadow: '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(16,78,46,.45), inset 0 1px 0 rgba(255,255,255,.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)'; }}
            >
              Khám phá sản phẩm
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            {/* Secondary */}
            <Link
              href="/"
              className="inline-flex items-center justify-center text-[13px] font-semibold transition-all duration-200"
              style={{
                background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
                border: '1px solid #E8DDD0',
                borderRadius: '14px',
                padding: '12px 24px',
                color: '#6a5840',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(90,74,56,.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
            >
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* Suggestion strip */}
        <div className="mt-20 pt-12" style={{ borderTop: '1px solid #EDE5D8' }}>
          <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-8" style={{ color: '#c9822a' }}>Có thể bạn thích</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {['Đèn Lồng Hội An', 'Đèn Trúc Thiên Nhiên', 'Đèn Vải Lụa', 'Đèn Tre Thủ Công'].map(name => (
              <Link key={name} href="/san-pham" className="group block">
                <div
                  className="aspect-square rounded-2xl flex items-center justify-center mb-3 overflow-hidden transition-all duration-300 group-hover:shadow-md"
                  style={{ background: 'linear-gradient(135deg, #f5efe5, #ede5d8)' }}
                >
                  <svg width="32" height="46" viewBox="0 0 60 86" fill="none" className="opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                    <line x1="30" y1="0" x2="30" y2="10" stroke="#c9822a" strokeWidth="2.5" strokeLinecap="round"/>
                    <rect x="18" y="8" width="24" height="5" rx="2" fill="#c9822a"/>
                    <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#104e2e" strokeWidth="2" fill="rgba(16,78,46,0.08)"/>
                    <rect x="18" y="74" width="24" height="5" rx="2" fill="#c9822a"/>
                  </svg>
                </div>
                <p className="text-[13px] font-semibold transition-colors duration-200 group-hover:text-[#104e2e]" style={{ color: '#1a1a1a' }}>{name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main cart ─── */
export default function CartPageClient() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, coupon, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponOpen, setCouponOpen] = useState(false);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch(`/api/coupon/validate?code=${encodeURIComponent(code)}&subtotal=${totalPrice}`);
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? 'Mã không hợp lệ');
      } else {
        applyCoupon(data.coupon);
        setCouponInput('');
        setCouponOpen(false);
      }
    } catch {
      setCouponError('Lỗi kết nối, thử lại');
    } finally {
      setCouponLoading(false);
    }
  };

  const shippingThreshold = 500000;
  const discount = coupon?.discount ?? 0;
  const discountedSubtotal = totalPrice - discount;
  const shippingFee = discountedSubtotal >= shippingThreshold ? 0 : 35000;
  const finalTotal = discountedSubtotal + shippingFee;
  const progress = Math.min((discountedSubtotal / shippingThreshold) * 100, 100);

  if (items.length === 0) return <EmptyCart />;

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh' }}>

      {/* ── Page header ── */}
      <div style={{ background: 'linear-gradient(to bottom, #FFFDF8, #FAF7F2)', borderBottom: '1px solid #EDE5D8' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-2" style={{ color: '#c9822a' }}>Giỏ hàng</p>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>
              {totalItems} sản phẩm
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { if (confirm('Xóa tất cả sản phẩm khỏi giỏ hàng?')) clearCart(); }}
              className="text-[12px] font-medium transition-colors"
              style={{ color: '#c0b0a0' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#d04a2e'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#c0b0a0'; }}
            >
              Xóa tất cả
            </button>
            <Link
              href="/san-pham"
              className="text-[12px] font-semibold flex items-center gap-1 transition-colors"
              style={{ color: '#6a5840' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#104e2e'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6a5840'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── Cart items ── */}
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div
                key={item.id}
                className="relative overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #EDE5D8',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Shine line */}
                <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: '1px', background: 'rgba(255,255,255,0.9)' }} />

                <div className="p-4 md:p-5 flex gap-4 items-start">
                  {/* Image */}
                  <div
                    className="shrink-0 overflow-hidden"
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #f5efe5, #ede5d8)',
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-1.5"
                      onError={(e) => { const img = e.target as HTMLImageElement; img.onerror = null; img.style.display = 'none'; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] font-bold mb-1" style={{ color: '#c9822a' }}>{item.maker}</p>
                    <Link
                      href={`/p/${item.slug}`}
                      className="text-[14px] font-bold leading-snug block mb-0.5 transition-colors hover:text-[#104e2e]"
                      style={{ color: '#1a1a1a' }}
                    >
                      {item.name}
                    </Link>
                    <p className="text-[12px]" style={{ color: '#a0907a' }}>{formatPrice(item.price)} / chiếc</p>

                    {/* Controls row */}
                    <div className="flex items-center justify-between mt-4">
                      <QtyControl value={item.quantity} onChange={n => updateQuantity(item.id, n)} />
                      <div className="flex items-center gap-4">
                        <p className="text-[15px] font-bold" style={{ color: '#1a1a1a' }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
                          style={{ background: '#f5efe5', color: '#b0906a' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fde5d8'; (e.currentTarget as HTMLElement).style.color = '#d04a2e'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f5efe5'; (e.currentTarget as HTMLElement).style.color = '#b0906a'; }}
                          title="Xóa"
                          aria-label="Xóa sản phẩm"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order summary ── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-3">

            {/* Summary card */}
            <div
              className="relative overflow-hidden"
              style={{
                background: '#FFFFFF',
                border: '1px solid #EDE5D8',
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 12, right: 12, height: '1px', background: 'rgba(255,255,255,0.9)' }} />

              <div className="p-5 md:p-6">
                <p className="text-[10px] uppercase tracking-[0.22em] font-bold mb-5" style={{ color: '#c9822a' }}>Tóm tắt đơn hàng</p>

                {/* Free shipping progress */}
                <div
                  className="rounded-xl p-4 mb-5"
                  style={{ background: discountedSubtotal >= shippingThreshold ? '#e6f2eb' : 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)', border: `1px solid ${discountedSubtotal >= shippingThreshold ? '#b8ddc8' : '#E8DDD0'}` }}
                >
                  {discountedSubtotal >= shippingThreshold ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#104e2e' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-[12px] font-bold" style={{ color: '#104e2e' }}>Bạn được miễn phí vận chuyển!</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2.5">
                        <p className="text-[11px] font-semibold" style={{ color: '#6a5840' }}>
                          Mua thêm <span className="font-bold" style={{ color: '#104e2e' }}>{formatPrice(shippingThreshold - discountedSubtotal)}</span> để free ship
                        </p>
                        <span className="text-[10px] font-bold" style={{ color: '#a0907a' }}>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EDE5D8' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%`, background: 'linear-gradient(to right, #c9822a, #104e2e)' }}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Line items */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center text-[13px]">
                    <span style={{ color: '#6a5840' }}>Tạm tính</span>
                    <span className="font-semibold" style={{ color: '#1a1a1a' }}>{formatPrice(totalPrice)}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="flex items-center gap-1.5" style={{ color: '#104e2e' }}>
                        Mã <span className="font-bold">{coupon.code}</span>
                        <button
                          onClick={removeCoupon}
                          className="w-4 h-4 rounded-full flex items-center justify-center transition-colors"
                          style={{ background: 'rgba(16,78,46,0.12)', color: '#104e2e' }}
                          title="Xoá mã"
                        >
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </span>
                      <span className="font-semibold" style={{ color: '#104e2e' }}>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[13px]">
                    <span style={{ color: '#6a5840' }}>Vận chuyển</span>
                    <span className={`font-semibold ${shippingFee === 0 ? '' : ''}`} style={{ color: shippingFee === 0 ? '#104e2e' : '#1a1a1a' }}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="py-4 mb-5" style={{ borderTop: '1px solid #EDE5D8', borderBottom: '1px solid #EDE5D8' }}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[13px] font-semibold" style={{ color: '#6a5840' }}>Tổng cộng</span>
                    <span className="text-[26px] font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.03em' }}>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout button — dark green gradient */}
                <Link
                  href="/dat-hang"
                  className="relative block w-full text-center text-[13px] font-bold text-white transition-all duration-200 overflow-hidden"
                  style={{
                    background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)',
                    borderRadius: '14px',
                    padding: '14px 24px',
                    boxShadow: '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(16,78,46,.45), inset 0 1px 0 rgba(255,255,255,.15)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(16,78,46,.35), inset 0 1px 0 rgba(255,255,255,.15)'; }}
                >
                  <span style={{ position: 'absolute', top: 0, left: 12, right: 12, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
                  Tiến hành thanh toán →
                </Link>

                {/* Trust badges */}
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>, title: 'Đổi trả 7 ngày', sub: 'Lỗi SX' },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 4v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, title: 'Toàn quốc', sub: 'GHTK · J&T' },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, title: 'Bảo mật', sub: 'VNPAY · COD' },
                  ].map(({ icon, title, sub }) => (
                    <div
                      key={title}
                      className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center"
                      style={{ background: '#FAF7F2', border: '1px solid #EDE5D8' }}
                    >
                      <span style={{ color: '#c9822a' }}>{icon}</span>
                      <div>
                        <p className="text-[10px] font-bold" style={{ color: '#2a1f14' }}>{title}</p>
                        <p className="text-[9px]" style={{ color: '#a0907a' }}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coupon card */}
            {!coupon && (
              <div
                className="overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #EDE5D8',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <button
                  onClick={() => setCouponOpen(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-black/[0.015]"
                >
                  <span className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: '#6a5840' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9822a" strokeWidth="2" strokeLinecap="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                    Bạn có mã giảm giá?
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a0907a" strokeWidth="2" strokeLinecap="round"
                    style={{ transform: couponOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {couponOpen && (
                  <div className="px-5 pb-5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Nhập mã khuyến mãi"
                        className="flex-1 text-[12px] px-3 py-2.5 transition-colors uppercase placeholder:normal-case"
                        style={{
                          background: 'linear-gradient(to bottom, #FFFDF8, #FAF5EC)',
                          border: `1px solid ${couponError ? '#e87060' : '#E8DDD0'}`,
                          borderRadius: '10px',
                          color: '#1a1a1a',
                          outline: 'none',
                        }}
                        disabled={couponLoading}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="text-[12px] font-bold text-white transition-all duration-200 disabled:opacity-50"
                        style={{
                          background: 'linear-gradient(to bottom, #1a6b3c, #104e2e)',
                          borderRadius: '10px',
                          padding: '0 16px',
                          boxShadow: '0 2px 8px rgba(16,78,46,.3)',
                        }}
                      >
                        {couponLoading ? '...' : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] mt-2" style={{ color: '#d04a2e' }}>{couponError}</p>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
