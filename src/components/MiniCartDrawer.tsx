'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart, type CartItem } from '@/context/CartContext';
import { formatPrice } from '@/data/products';

const SHIP_THRESHOLD = 500_000;

interface Props { onClose: () => void; }

function CartItemRow({ item, onRemove, onQty }: { item: CartItem; onRemove: () => void; onQty: (q: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 12, background: '#FFFFFF', border: '1px solid #EDE5D8', borderRadius: 14, padding: 12 }}>
      <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0, borderRadius: 10, overflow: 'hidden', background: '#E8E0D4' }}>
        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} unoptimized sizes="68px" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</p>
        <p style={{ fontSize: 13, fontWeight: 800, color: '#104e2e', marginTop: 3 }}>{formatPrice(item.price)}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
          <div style={{ display: 'flex', border: '1px solid #EDE5D8', borderRadius: 8, overflow: 'hidden' }}>
            <button onClick={() => onQty(item.quantity - 1)} style={{ width: 28, height: 26, background: 'none', border: 'none', fontSize: 15, cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ minWidth: 28, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#333', borderLeft: '1px solid #EDE5D8', borderRight: '1px solid #EDE5D8' }}>{item.quantity}</span>
            <button onClick={() => onQty(item.quantity + 1)} style={{ width: 28, height: 26, background: 'none', border: 'none', fontSize: 15, cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
          <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0 }} aria-label="Xóa">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MiniCartDrawer({ onClose }: Props) {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const remaining = Math.max(0, SHIP_THRESHOLD - totalPrice);
  const shipPct = Math.min(100, Math.round((totalPrice / SHIP_THRESHOLD) * 100));
  const freeShip = remaining === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200]"
        style={{ background: 'rgba(0,0,0,0.42)' }}
        onClick={onClose}
        aria-hidden
      />
      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[201] flex flex-col"
        style={{ width: 'min(420px, 100vw)', background: '#FFFDF8', boxShadow: '-8px 0 40px rgba(0,0,0,0.14)' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #EDE5D8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Giỏ hàng</span>
            {totalItems > 0 && (
              <span style={{ fontSize: 10, fontWeight: 800, background: '#104e2e', color: 'white', borderRadius: 20, padding: '1px 8px', letterSpacing: '0.02em' }}>{totalItems}</span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f5f0e8', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            aria-label="Đóng giỏ hàng"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Free shipping bar */}
        {(totalItems > 0 || freeShip) && (
          <div style={{ padding: '10px 20px 12px', borderBottom: '1px solid #EDE5D8', background: freeShip ? '#f0faf3' : '#FFFDF8' }}>
            <p style={{ fontSize: 11.5, fontWeight: 600, color: freeShip ? '#104e2e' : '#8a7a6a', marginBottom: 6 }}>
              {freeShip
                ? 'Bạn được miễn phí vận chuyển!'
                : `Mua thêm ${formatPrice(remaining)} nữa để được miễn phí vận chuyển`}
            </p>
            <div style={{ height: 4, background: '#EDE5D8', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: `${shipPct}%`, height: '100%', background: freeShip ? '#104e2e' : '#c9822a', borderRadius: 10, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )}

        {/* Item list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '48px 0', color: '#ccc' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
              </svg>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#aaa' }}>Giỏ hàng trống</p>
              <p style={{ fontSize: 12, color: '#bbb', textAlign: 'center' }}>Thêm sản phẩm để tiếp tục mua sắm</p>
            </div>
          ) : (
            items.map(item => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onQty={q => q > 0 ? updateQuantity(item.id, q) : removeItem(item.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #EDE5D8', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <span style={{ fontSize: 13, color: '#888' }}>Tạm tính</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#104e2e' }}>{formatPrice(totalPrice)}</span>
            </div>
          )}
          {items.length > 0 ? (
            <>
              <Link
                href="/dat-hang"
                onClick={onClose}
                style={{ display: 'block', textAlign: 'center', background: '#104e2e', color: 'white', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.02em' }}
              >
                Thanh toán ngay
              </Link>
              <Link
                href="/gio-hang"
                onClick={onClose}
                style={{ display: 'block', textAlign: 'center', border: '1.5px solid #E2DAD0', color: '#555', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                Xem giỏ hàng
              </Link>
            </>
          ) : (
            <Link
              href="/san-pham"
              onClick={onClose}
              style={{ display: 'block', textAlign: 'center', background: '#104e2e', color: 'white', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
            >
              Khám phá sản phẩm
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
