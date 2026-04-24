'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { trackAddToCart } from '@/lib/analytics';
import { productAlt } from '@/lib/image-seo';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  priority?: boolean;
}

const BADGE_STYLE: Record<string, { bg: string; text: string }> = {
  sale:       { bg: '#c9822a', text: 'white' },
  tet:        { bg: '#c0392b', text: 'white' },
  bestseller: { bg: '#104e2e', text: 'white' },
  new:        { bg: '#1a6b3c', text: 'white' },
};

export default function ProductCard({ product, featured = false, priority = false }: ProductCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [img2Error, setImg2Error] = useState(false);
  const [added, setAdded] = useState(false);

  // Ảnh thứ 2 — chỉ dùng nếu là URL thực (không phải emoji/placeholder)
  const hoverImage = (() => {
    const img2 = product.images?.[1];
    if (!img2 || img2Error) return null;
    if (img2.startsWith('/') || img2.startsWith('http')) return img2;
    return null;
  })();
  const { addItem } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.slug);
  const isContactPrice = product.contactForPrice || !product.price || product.price <= 0;
  const outOfStock = product.stock === 0 && !isContactPrice;
  const lowStock = !outOfStock && !isContactPrice && product.stock > 0 && product.stock <= 5;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) removeFromWishlist(product.slug);
    else addToWishlist(product.slug);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || added) return;
    addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, maker: product.maker });
    trackAddToCart({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const badgeKey = product.badge ?? (product.isNew ? 'new' : product.isBestseller ? 'bestseller' : null);
  const badgeLabel = product.badgeLabel ?? (product.isNew ? 'Mới' : product.isBestseller ? 'Bán chạy' : null);
  const badgeStyle = badgeKey ? BADGE_STYLE[badgeKey] : null;
  const productHref = `/p/${product.slug}`;

  const handleOpenProduct = () => {
    router.push(productHref);
  };


  return (
    <article
      className={[
        'pc-card group block overflow-hidden transition-all duration-300 [@media(hover:hover)]:hover:-translate-y-1 cursor-pointer',
        featured ? 'sm:col-span-2 sm:row-span-2' : '',
      ].join(' ')}
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E2DAD0',
        borderRadius: '16px',
      }}
      role="link"
      tabIndex={0}
      aria-label={`Xem chi tiết ${product.name}`}
      onClick={handleOpenProduct}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenProduct();
        }
      }}
    >
      {/* ── Image area ── */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '4/5', background: '#E8E0D4' }}
      >
        {!imgError ? (
          <>
            {/* Ảnh chính */}
            <Image
              fill
              src={product.image}
              alt={productAlt(product)}
              title={product.name}
              className={[
                'object-cover transition-all duration-500',
                hoverImage
                  ? 'group-hover:opacity-0 group-hover:scale-[1.03]'
                  : 'group-hover:scale-[1.06]',
              ].join(' ')}
              style={{ mixBlendMode: 'multiply' }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
              priority={priority}
              loading={priority ? undefined : 'lazy'}
              onError={() => setImgError(true)}
            />
            {/* Ảnh thứ 2 — fade in khi hover */}
            {hoverImage && (
              <Image
                fill
                src={hoverImage}
                alt={`${product.nameShort} — góc nhìn thứ 2`}
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ mixBlendMode: 'multiply' }}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
                loading="lazy"
                onError={() => setImg2Error(true)}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="46" viewBox="0 0 60 86" fill="none" aria-label={product.nameShort} opacity="0.2">
              <line x1="30" y1="0" x2="30" y2="10" stroke="#104e2e" strokeWidth="2" strokeLinecap="round"/>
              <rect x="18" y="8" width="24" height="5" rx="1.5" fill="#104e2e"/>
              <path d="M18 14 C12 22 10 34 10 46 C10 58 12 70 18 76 L42 76 C48 70 50 58 50 46 C50 34 48 22 42 14 Z" stroke="#104e2e" strokeWidth="1.5" fill="rgba(16,78,46,0.08)"/>
              <rect x="18" y="74" width="24" height="5" rx="1.5" fill="#104e2e"/>
            </svg>
          </div>
        )}

        {/* Watermark */}
        <div aria-hidden="true" className="absolute bottom-2 right-2 pointer-events-none select-none" style={{ fontSize: '7px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(16,78,46,0.10)', mixBlendMode: 'multiply' }}>
          longdenviet.com
        </div>

        {/* Badge */}
        {badgeStyle && badgeLabel && (
          <div className="absolute top-3 left-3">
            <span className="text-[11px] font-black tracking-[0.07em] uppercase px-2.5 py-1" style={{ background: badgeStyle.bg, color: badgeStyle.text, borderRadius: '8px' }}>
              {badgeLabel}
            </span>
          </div>
        )}

        {/* Wishlist — hidden until hover (CSS .pc-wish), always visible if active */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? `Xóa ${product.nameShort} khỏi yêu thích` : `Thêm ${product.nameShort} vào yêu thích`}
          className={`pc-wish${inWishlist ? ' active' : ''} absolute top-3 right-3 w-[34px] h-[34px] rounded-full flex items-center justify-center z-10`}
          style={{
            background: inWishlist ? '#c9822a' : 'white',
            color: inWishlist ? 'white' : '#c8b8a0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>


        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(250,247,242,0.75)' }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full" style={{ background: '#EDE5D8', color: '#6a5840' }}>Hết hàng</span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-4">
        {/* Category */}
        {product.maker && product.maker.toLowerCase() !== 'longdenviet' && (
          <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] mb-1.5 truncate" style={{ color: '#c9822a' }}>
            {product.maker}
          </p>
        )}
        {/* Name */}
        <p className="font-bold text-[14px] leading-[1.4] mb-2.5"
          style={{ color: '#1a1a1a', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8em' }}>
          {product.name}
        </p>


        {/* Price row + "+" button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 min-w-0 flex-1 pr-1.5">
            {isContactPrice ? (
              <span className="text-[13px] font-semibold" style={{ color: '#104e2e' }}>Liên hệ</span>
            ) : (
              <>
                <span className="font-black" style={{ fontSize: '17px', color: '#104e2e' }}>{formatPrice(product.price)}</span>
                {product.priceOriginal && (
                  <del className="text-[11px] font-normal not-italic" style={{ color: '#8a7a6a' }}>{formatPrice(product.priceOriginal)}</del>
                )}
              </>
            )}
          </div>

          {/* "+" button with CSS ripple */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label={`Thêm ${product.nameShort} vào giỏ hàng`}
            className="pc-add-btn relative flex items-center justify-center shrink-0 disabled:opacity-40 transition-all duration-200"
            style={{
              width: 32, height: 32,
              borderRadius: '9px',
              background: added ? '#0a3320' : outOfStock ? '#EDE5D8' : 'var(--pc-add-bg, #104e2e)',
              color: outOfStock ? '#a0907a' : 'var(--pc-add-icon, #ffffff)',
              border: outOfStock ? 'none' : 'var(--pc-add-border, 1px solid rgba(255,255,255,0.28))',
              boxShadow: outOfStock ? 'none' : 'var(--pc-add-shadow, 0 1px 5px rgba(16,78,46,0.3))',
              marginLeft: 'auto',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (!outOfStock) (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
          >
            {added ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            )}
          </button>
        </div>

        {/* Low stock urgency */}
        {lowStock && (
          <div className="flex items-center gap-1 mt-2">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-[11px] font-bold" style={{ color: '#c0392b' }}>
              Còn {product.stock} chiếc cuối
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
