'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuickView } from '@/context/QuickViewContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice } from '@/data/products';
import { trackAddToCart } from '@/lib/analytics';

export default function QuickViewSheet() {
  const { product, closeQuickView } = useQuickView();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  // Reset added state when product changes
  useEffect(() => { setAdded(false); }, [product]);

  // Lock body scroll
  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  // Close on Escape
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeQuickView(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, closeQuickView]);

  if (!product) return null;

  const outOfStock = product.stock === 0;
  const isContactPrice = product.contactForPrice || !product.price || product.price <= 0;
  const lowStock = !outOfStock && !isContactPrice && product.stock > 0 && product.stock <= 5;

  const handleAdd = () => {
    if (outOfStock || added) return;
    addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, maker: product.maker });
    trackAddToCart({ id: product.id, name: product.name, price: product.price });
    toast('Đã thêm vào giỏ hàng');
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300]"
        style={{ background: 'rgba(0,0,0,0.48)' }}
        onClick={closeQuickView}
        aria-hidden
      />

      {/* Positioning container — bottom sheet mobile, centered desktop */}
      <div className="fixed inset-0 z-[301] flex items-end md:items-center justify-center pointer-events-none">
        <div
          role="dialog"
          aria-modal
          aria-label={product.name}
          className="pointer-events-auto w-full md:w-[540px] overflow-hidden"
          style={{
            background: '#FFFDF8',
            borderRadius: '20px 20px 0 0',
            boxShadow: '0 -8px 48px rgba(0,0,0,0.18)',
            maxHeight: '88vh',
            overflow: 'auto',
            // Desktop
          }}
        >
          {/* Drag handle / close area — mobile only */}
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div style={{ width: 36, height: 4, background: '#ddd', borderRadius: 4 }} />
          </div>

          {/* Desktop close button */}
          <div className="hidden md:flex justify-end" style={{ padding: '14px 16px 0' }}>
            <button
              onClick={closeQuickView}
              style={{ background: '#f5f0e8', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Đóng"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row gap-0 md:gap-0">
            {/* Image */}
            <div
              className="w-full md:w-[220px] shrink-0"
              style={{ aspectRatio: '4/5', background: '#E8E0D4', position: 'relative', maxHeight: '280px' }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: 'cover', mixBlendMode: 'multiply' }}
                sizes="(max-width: 768px) 100vw, 220px"
                unoptimized
              />
              {outOfStock && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(250,247,242,0.78)' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#EDE5D8', color: '#6a5840', borderRadius: 20, padding: '4px 12px' }}>Hết hàng</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '16px 20px 24px', flex: 1 }}>
              <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9822a', marginBottom: 6 }}>{product.maker}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 10 }}>{product.name}</p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                {isContactPrice ? (
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#c9822a' }}>Liên hệ báo giá</span>
                ) : (
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#104e2e' }}>{formatPrice(product.price)}</span>
                )}
              </div>

              {/* Low stock */}
              {lowStock && (
                <p style={{ fontSize: 11, fontWeight: 700, color: '#c9822a', background: '#FBF0D0', borderRadius: 8, padding: '4px 10px', display: 'inline-block', marginBottom: 12 }}>
                  Còn {product.stock} chiếc cuối
                </p>
              )}

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {!isContactPrice && (
                  <button
                    onClick={handleAdd}
                    disabled={outOfStock}
                    style={{
                      flex: 1,
                      height: 46,
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 700,
                      border: 'none',
                      cursor: outOfStock ? 'not-allowed' : 'pointer',
                      background: outOfStock ? '#e2e8f0' : added ? '#0d9e6a' : '#104e2e',
                      color: outOfStock ? '#aaa' : 'white',
                      transition: 'background 0.2s',
                    }}
                  >
                    {outOfStock ? 'Hết hàng' : added ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
                  </button>
                )}
                <Link
                  href={`/p/${product.slug}`}
                  onClick={closeQuickView}
                  style={{
                    height: 46,
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    border: '1.5px solid #E2DAD0',
                    background: 'white',
                    color: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    padding: '0 16px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
