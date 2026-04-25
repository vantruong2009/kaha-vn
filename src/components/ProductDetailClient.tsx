'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Product, ProductVariation, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { trackViewItem, trackAddToCart } from '@/lib/analytics';
import { productAlt, productThumbAlt } from '@/lib/image-seo';

interface ProductDetailClientProps {
  product: Product;
  zaloPhone?: string;
  storePhone?: string;
}

type Tab = 'mo-ta' | 'thong-so';


export default function ProductDetailClient({ product, zaloPhone = '0989778247', storePhone = '0989.778.247' }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [wishToast, setWishToast] = useState<'added' | 'removed' | null>(null);
  function handleWishlist(slug: string) {
    const wasIn = isInWishlist(slug);
    toggleWishlist(slug);
    setWishToast(wasIn ? 'removed' : 'added');
    setTimeout(() => setWishToast(null), 2000);
  }
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('mo-ta');
  const [activeImage, setActiveImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const mainButtonRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveImage(i => Math.min(i + 1, thumbnailImages.length - 1));
      } else {
        setActiveImage(i => Math.max(i - 1, 0));
      }
    }
  };

  // Variation state
  const hasVariations = (product.variations?.length ?? 0) > 0;
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);

  const allAttributeKeys = hasVariations
    ? Array.from(new Set(product.variations!.flatMap(v => Object.keys(v.attributes))))
    : [];

  useEffect(() => {
    if (!hasVariations) return;
    if (Object.keys(selectedAttributes).length === 0) {
      setSelectedVariation(null);
      return;
    }
    const match = product.variations!.find(v =>
      allAttributeKeys.every(k => !selectedAttributes[k] || v.attributes[k] === selectedAttributes[k])
    );
    setSelectedVariation(match ?? null);
  }, [selectedAttributes, hasVariations, product.variations, allAttributeKeys]);

  const displayPrice = selectedVariation ? selectedVariation.price : product.price;
  const outOfStock = selectedVariation ? !selectedVariation.inStock : product.stock === 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    const el = mainButtonRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const thumbnailImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handleLightboxKey = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') setLightboxOpen(false);
    if (e.key === 'ArrowRight') setActiveImage(i => (i + 1) % thumbnailImages.length);
    if (e.key === 'ArrowLeft') setActiveImage(i => (i - 1 + thumbnailImages.length) % thumbnailImages.length);
  }, [lightboxOpen, thumbnailImages.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleLightboxKey);
    return () => window.removeEventListener('keydown', handleLightboxKey);
  }, [handleLightboxKey]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  useEffect(() => {
    trackViewItem({ id: product.id, name: product.name, price: product.price, category: product.category });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = () => {
    if (outOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: selectedVariation ? `${product.id}-${selectedVariation.sku}` : product.id,
        slug: product.slug,
        name: product.name + (selectedVariation && Object.keys(selectedVariation.attributes).length > 0
          ? ' — ' + Object.values(selectedVariation.attributes).join(', ')
          : ''),
        price: displayPrice,
        image: (selectedVariation?.image) || product.image,
        maker: product.maker,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    trackAddToCart({ id: product.id, name: product.name, price: displayPrice, category: product.category });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'mo-ta', label: 'Mô tả' },
    { id: 'thong-so', label: 'Thông số' },
  ];

  const discountPct = product.priceOriginal && !selectedVariation
    ? Math.round((1 - product.price / product.priceOriginal) * 100)
    : 0;

  return (
    <>
      {/* Gallery + Info — sticky gallery on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 mb-20 items-start">

        {/* ── Gallery ── */}
        <div className="md:sticky md:top-[88px]">
          {/* Main image */}
          <div
            className="bg-white rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden mb-3 cursor-zoom-in border border-[#ede8e0] shadow-sm"
            onClick={() => setLightboxOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={thumbnailImages[activeImage]}
              alt={productAlt(product)}
              title={product.name}
              className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-[1.03]"
              style={{ mixBlendMode: 'multiply', filter: 'contrast(1.05) saturate(1.12) brightness(1.01)' }}
              fetchPriority="high"
              loading="eager"
            />

            {/* Badge top-left */}
            {product.badge && product.badgeLabel && (
              <div className={[
                'absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide',
                product.badge === 'tet' ? 'bg-brand-red'
                  : product.badge === 'new' ? 'bg-brand-green'
                  : product.badge === 'bestseller' ? 'bg-brand-teal'
                  : 'bg-brand-amber',
              ].join(' ')}>
                {product.badgeLabel}
              </div>
            )}
            {!product.badge && product.isNew && (
              <div className="absolute top-4 left-4 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">MỚI</div>
            )}
            {!product.badge && product.isBestseller && (
              <div className="absolute top-4 left-4 bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">BÁN CHẠY</div>
            )}

            {/* Image counter top-right */}
            {thumbnailImages.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/40 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full leading-none backdrop-blur-sm">
                {activeImage + 1} / {thumbnailImages.length}
              </div>
            )}

            {/* Brand watermark */}
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-4 pointer-events-none select-none"
              style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(16,78,46,0.10)', lineHeight: 1, mixBlendMode: 'multiply' }}
            >
              kaha.vn
            </div>

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 bg-black/35 rounded-full w-8 h-8 flex items-center justify-center pointer-events-none backdrop-blur-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
          </div>

          {/* Dot indicator — mobile only */}
          {thumbnailImages.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-2 md:hidden">
              {thumbnailImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? 'bg-brand-green' : 'bg-gray-300'}`}
                  aria-label={`Ảnh ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {thumbnailImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={[
                  'bg-white rounded-xl aspect-square overflow-hidden transition-all duration-150 border',
                  activeImage === i
                    ? 'border-brand-green ring-2 ring-brand-green/20 shadow-sm'
                    : 'border-[#e8e4dc] hover:border-brand-green/50',
                ].join(' ')}
                aria-label={`Ảnh ${i + 1}`}
              >
                <img
                  src={img}
                  alt={productThumbAlt(product, i)}
                  title={`${product.name} — hình ${i + 1}`}
                  className="w-full h-full object-contain p-1.5"
                  style={{ mixBlendMode: 'multiply', filter: 'contrast(1.04) saturate(1.1)' }}
                />
              </button>
            ))}
          </div>

          {/* Origin badge below gallery — desktop */}
          <div className="hidden md:flex items-center gap-2 mt-5 px-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-xs text-[#888]">
              Sản xuất tại <span className="font-semibold text-brand-green">Việt Nam</span>
            </span>
          </div>
        </div>

        {/* ── Product Info ── */}
        <div>
          {/* Maker label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#888] font-bold">{product.maker}</span>
            <span className="text-[#ddd]">·</span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#888] font-bold">{product.makerRegion ?? 'Hội An'}</span>
          </div>

          {/* Title */}
          <h1 className="text-[1.75rem] md:text-[2.1rem] font-bold leading-[1.2] text-[#1a1a1a] mb-3" style={{ letterSpacing: '-0.025em' }}>
            {product.name}
          </h1>

          {/* Share row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-medium" style={{ color: '#aaa' }}>Chia sẻ:</span>
            <a
              href={`https://zalo.me/share/url?url=${encodeURIComponent('https://kaha.vn/p/' + product.slug)}&title=${encodeURIComponent(product.name)}`}
              target="_blank" rel="noopener noreferrer"
              title="Chia sẻ qua Zalo"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: '#f5f5f5', border: '1px solid #eee' }}
            >
              <svg width="15" height="15" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="8" fill="#0068FF"/>
                <path d="M24 8C15.163 8 8 14.716 8 23c0 4.68 2.32 8.856 5.97 11.68L12 40l5.6-2.24C19.6 38.56 21.76 39 24 39c8.837 0 16-6.716 16-15S32.837 8 24 8z" fill="white"/>
                <path d="M17 22h14M17 27h8" stroke="#0068FF" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://kaha.vn/p/' + product.slug)}`}
              target="_blank" rel="noopener noreferrer"
              title="Chia sẻ Facebook"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: '#f5f5f5', border: '1px solid #eee' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://kaha.vn/p/' + product.slug).then(() => {
                  setLinkCopied(true);
                  setTimeout(() => setLinkCopied(false), 2000);
                });
              }}
              title={linkCopied ? 'Đã sao chép!' : 'Sao chép liên kết'}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 relative"
              style={{ background: linkCopied ? '#e6f2eb' : '#f5f5f5', border: `1px solid ${linkCopied ? '#104e2e' : '#eee'}` }}
            >
              {linkCopied ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#104e2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              )}
            </button>
          </div>

          {/* Story quote */}
          <blockquote className="bg-[#fdf8f2] border-l-[3px] border-brand-amber rounded-r-xl px-4 py-3.5 text-sm text-[#555] leading-[1.75] mb-6 italic-off">
            &ldquo;{product.story}&rdquo;
          </blockquote>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2v0"/><path d="M14 10V6a2 2 0 00-2-2 2 2 0 00-2 2v3"/><path d="M10 10.5V8a2 2 0 00-2-2 2 2 0 00-2 2v7a6 6 0 006 6h2a6 6 0 006-6v-5a2 2 0 00-2-2 2 2 0 00-2 2v1"/></svg>,
                label: '100% thủ công',
                sub: 'Không hàng công nghiệp',
              },
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>,
                label: 'TP.HCM & Hội An',
                sub: 'Làng nghề truyền thống',
              },
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><path d="M9 12l2 2 4-4"/></svg>,
                label: 'Bảo hành 30 ngày',
                sub: 'Lỗi sản xuất hoàn 100%',
              },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center text-center gap-1.5 bg-[#f9f6f1] rounded-xl px-2 py-3.5 border border-[#ede8e0]">
                <span className="text-brand-green">{item.icon}</span>
                <span className="text-[11px] font-bold text-[#1a1a1a] leading-tight">{item.label}</span>
                <span className="text-[10px] text-[#888] leading-tight">{item.sub}</span>
              </div>
            ))}
          </div>

          {/* Variation selectors */}
          {hasVariations && (
            <div className="mb-6 flex flex-col gap-4">
              {allAttributeKeys.map(attrKey => {
                const attrLabel = attrKey === 'color' ? 'Màu sắc'
                  : attrKey === 'size' ? 'Kích thước'
                  : attrKey;
                const options = Array.from(new Set(
                  product.variations!.map(v => v.attributes[attrKey]).filter(Boolean)
                ));
                const isColor = attrKey === 'color';
                return (
                  <div key={attrKey}>
                    <div className="text-sm font-semibold text-[#4a4a4a] mb-2">
                      {attrLabel}:
                      {selectedAttributes[attrKey] && (
                        <span className="ml-1.5 font-normal text-brand-green">{selectedAttributes[attrKey]}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {options.map(opt => {
                        const isSelected = selectedAttributes[attrKey] === opt;
                        if (isColor) {
                          return (
                            <button
                              key={opt}
                              onClick={() => setSelectedAttributes(prev => ({ ...prev, [attrKey]: opt }))}
                              title={opt}
                              className={[
                                'w-9 h-9 rounded-full border-2 transition-all duration-150',
                                isSelected ? 'border-brand-green ring-2 ring-brand-green/30 scale-110' : 'border-brand-border hover:border-brand-green/50',
                              ].join(' ')}
                              style={{ background: opt.toLowerCase().includes('đỏ') ? '#c0392b'
                                : opt.toLowerCase().includes('vàng') ? '#f1c40f'
                                : opt.toLowerCase().includes('xanh') ? '#2980b9'
                                : opt.toLowerCase().includes('trắng') ? '#ffffff'
                                : opt.toLowerCase().includes('đen') ? '#1a1a1a'
                                : '#c9822a' }}
                              aria-label={opt}
                            />
                          );
                        }
                        return (
                          <button
                            key={opt}
                            onClick={() => setSelectedAttributes(prev => ({ ...prev, [attrKey]: opt }))}
                            className={[
                              'px-4 py-2 rounded-lg border text-xs font-semibold transition-all duration-150',
                              isSelected
                                ? 'border-brand-green bg-brand-green-lt text-brand-green shadow-sm'
                                : 'border-brand-border text-[#4a4a4a] hover:border-brand-green hover:text-brand-green',
                            ].join(' ')}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Price section */}
          <div className="mb-6 pb-6 border-b border-[#ede8e0]">
            {product.contactForPrice ? (
              <div className="text-3xl font-bold text-brand-green leading-none">Liên hệ để biết giá</div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-4xl font-bold text-[#1a1a1a] leading-none" style={{ letterSpacing: '-0.02em' }}>
                  {formatPrice(displayPrice)}
                </div>
                {product.priceOriginal && !selectedVariation && (
                  <del className="text-base text-[#8a7a6a] leading-none">{formatPrice(product.priceOriginal)}</del>
                )}
                {discountPct > 0 && (
                  <span className="text-xs font-bold text-white bg-[#c0392b] px-2.5 py-1 rounded-full leading-none">
                    -{discountPct}%
                  </span>
                )}
              </div>
            )}
            {!product.contactForPrice && (
              <p className="text-xs mt-2" style={{ color: '#9a8878' }}>Giá tốt nhất vui lòng liên hệ qua Zalo · Chưa tính phí vận chuyển</p>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div ref={mainButtonRef}>
            {product.contactForPrice ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <a
                    href={`https://zalo.me/${zaloPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold text-center transition-colors bg-brand-green text-white hover:bg-brand-green-dk flex items-center justify-center gap-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <rect width="48" height="48" rx="12" fill="rgba(255,255,255,0.25)"/>
                      <path d="M24 8C15.163 8 8 14.716 8 23c0 4.68 2.32 8.856 5.97 11.68L12 40l5.6-2.24C19.6 38.56 21.76 39 24 39c8.837 0 16-6.716 16-15S32.837 8 24 8z" fill="white"/>
                      <path d="M17 22h14M17 27h8" stroke="#104e2e" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    Chat Zalo
                  </a>
                  <a
                    href={`tel:${storePhone.replace(/\./g, '')}`}
                    className="flex-1 py-3.5 rounded-xl text-sm font-bold text-center transition-all flex items-center justify-center gap-2 border-2"
                    style={{ borderColor: '#104e2e', color: '#104e2e' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                    Gọi ngay
                  </a>
                  <button
                    type="button"
                    onClick={() => handleWishlist(product.slug)}
                    className="px-4 flex items-center justify-center border border-[#ddd] rounded-xl hover:border-[#e53e3e] transition-colors"
                    style={{ color: isInWishlist(product.slug) ? '#e53e3e' : '#9a8878' }}
                    aria-label="Yêu thích"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist(product.slug) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9a8878]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                  Phản hồi trong 30 phút
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-3 items-stretch mb-3">
                  {/* Qty stepper */}
                  <div className="flex flex-col justify-end">
                    <label className="text-[10px] font-bold text-[#999] uppercase tracking-widest mb-1.5">Số lượng</label>
                    <div className="flex items-stretch border border-[#ddd] rounded-xl overflow-hidden w-[140px] h-[52px] bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={outOfStock || quantity <= 1}
                        className="w-11 flex items-center justify-center text-lg font-medium text-[#555] hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed select-none"
                      >−</button>
                      <input
                        type="number"
                        min={1}
                        max={9999}
                        value={quantity}
                        onChange={e => {
                          const v = parseInt(e.target.value, 10);
                          if (!isNaN(v) && v >= 1) setQuantity(Math.min(v, 9999));
                        }}
                        disabled={outOfStock}
                        className="flex-1 text-center text-sm font-bold text-[#1a1a1a] border-x border-[#ddd] bg-white focus:outline-none disabled:opacity-40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(q => Math.min(9999, q + 1))}
                        disabled={outOfStock || quantity >= 9999}
                        className="w-11 flex items-center justify-center text-lg font-medium text-[#555] hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed select-none"
                      >+</button>
                    </div>
                  </div>

                  {/* Add to cart / Notify when in stock */}
                  {outOfStock ? (
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('ldv:open-appointment'))}
                      className="flex-1 rounded-xl font-bold text-sm tracking-wide mt-auto h-[52px] transition-colors duration-200"
                      style={{ background: '#FBF0D0', color: '#a07800', border: '1.5px solid #e9c96b', cursor: 'pointer' }}
                    >
                      Thông báo khi có hàng
                    </button>
                  ) : (
                    <button
                      onClick={handleAdd}
                      className={[
                        'flex-1 rounded-xl font-bold text-sm tracking-wide transition-colors duration-200 mt-auto h-[52px]',
                        added
                          ? 'bg-[#0d9e6a] text-white'
                          : 'bg-brand-green text-white hover:bg-brand-green-dk',
                      ].join(' ')}
                    >
                      {added ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
                    </button>
                  )}

                  {/* Wishlist */}
                  <div className="relative mt-auto">
                    <button
                      type="button"
                      onClick={() => handleWishlist(product.slug)}
                      className="flex items-center justify-center border rounded-xl transition-colors h-[52px] w-[52px]"
                      style={{
                        color: isInWishlist(product.slug) ? '#e53e3e' : '#bbb',
                        borderColor: isInWishlist(product.slug) ? '#e53e3e' : '#ddd',
                      }}
                      aria-label="Yêu thích"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product.slug) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    </button>
                    {wishToast && (
                      <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-[#1a1a1a] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg pointer-events-none">
                        {wishToast === 'added' ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Zalo secondary CTA */}
                <a
                  href={`https://zalo.me/${zaloPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:bg-[#f0f7ff]"
                  style={{ borderColor: '#0068FF', color: '#0068FF' }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="12" fill="#0068FF"/>
                    <path d="M24 8C15.163 8 8 14.716 8 23c0 4.68 2.32 8.856 5.97 11.68L12 40l5.6-2.24C19.6 38.56 21.76 39 24 39c8.837 0 16-6.716 16-15S32.837 8 24 8z" fill="white"/>
                    <path d="M17 22h14M17 27h8" stroke="#0068FF" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  Hỏi qua Zalo · {storePhone}
                </a>
              </>
            )}

            {/* Bestseller badge */}
            {product.isBestseller && (
              <div className="flex items-center gap-3 mt-4 bg-brand-yellow rounded-xl px-4 py-3 border border-[#f0dca0]">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9822a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#7a5000]">Sản phẩm độc quyền</div>
                  <div className="text-[11px] text-[#a07020]">Chỉ có tại KAHA</div>
                </div>
              </div>
            )}
          </div>

          {/* Trust signals — 2×2 grid */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V7a2 2 0 00-2-2 2 2 0 00-2 2v0"/><path d="M14 10V6a2 2 0 00-2-2 2 2 0 00-2 2v3"/><path d="M10 10.5V8a2 2 0 00-2-2 2 2 0 00-2 2v7a6 6 0 006 6h2a6 6 0 006-6v-5a2 2 0 00-2-2 2 2 0 00-2 2v1"/></svg>,
                title: '100% thủ công',
                sub: 'Không hàng công nghiệp',
              },
              {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                title: 'Miễn phí vận chuyển',
                sub: 'Đơn từ 3,000,000đ',
              },
              {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg>,
                title: 'Đổi trả 7 ngày',
                sub: 'Lỗi sản xuất hoàn 100%',
              },
              {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
                title: 'Đóng gói an toàn',
                sub: 'Hộp cứng chống sốc',
              },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-2.5 bg-[#f9f6f1] rounded-xl p-3 border border-[#ede8e0]">
                <span className="text-brand-green mt-0.5 shrink-0">{item.icon}</span>
                <div>
                  <div className="text-xs font-bold text-[#1a1a1a] leading-snug">{item.title}</div>
                  <div className="text-[11px] text-[#888] leading-snug mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="mb-16">
        <div className="flex gap-0 border-b border-[#ede8e0] mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors duration-150',
                activeTab === tab.id
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-[#999] hover:text-brand-green',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mô tả */}
        {activeTab === 'mo-ta' && (
          <div className="max-w-2xl">
            <div className="space-y-4">
              {product.description.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-[0.9375rem] text-[#3a3a3a] leading-[1.85]">
                  {para}
                </p>
              ))}
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[#ede8e0]">
                {product.tags.map(tag => (
                  <span key={tag} className="bg-brand-green-lt text-brand-green text-xs px-3 py-1 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Thông số */}
        {activeTab === 'thong-so' && (
          <div className="max-w-lg">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {[
                  ['Kích thước', product.dimensions],
                  ['Chất liệu', product.material],
                  ['Xuất xứ', product.origin],
                  ['Trọng lượng', product.weight],
                  ['Danh mục', product.category],
                  ['Mã sản phẩm', product.id],
                  ['Còn trong kho', product.stock > 0 ? `${product.stock} chiếc` : 'Hết hàng'],
                ].filter(([, v]) => Boolean(v)).map(([label, value]) => (
                  <tr key={label} className="border-b border-[#ede8e0]">
                    <td className="py-3.5 pr-6 text-[#999] font-medium w-40 shrink-0 text-[0.8125rem]">{label}</td>
                    <td className="py-3.5 text-[#1a1a1a] text-[0.8125rem]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {thumbnailImages.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setActiveImage(i => (i - 1 + thumbnailImages.length) % thumbnailImages.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Ảnh trước"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}

          {thumbnailImages.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setActiveImage(i => (i + 1) % thumbnailImages.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Ảnh tiếp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}

          <div className="max-w-4xl w-full px-16" onClick={e => e.stopPropagation()}>
            <img
              src={thumbnailImages[activeImage]}
              alt={productAlt(product)}
              className="max-h-[90vh] w-full object-contain"
            />
            {thumbnailImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {thumbnailImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={[
                      'w-2 h-2 rounded-full transition-all duration-150',
                      i === activeImage ? 'bg-white' : 'bg-white/30 hover:bg-white/60',
                    ].join(' ')}
                    aria-label={`Ảnh ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sticky add-to-cart bar — mobile bottom + desktop bottom ── */}
      <div
        className={[
          'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#ede8e0] transition-transform duration-300',
          showStickyBar ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        style={{ boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}
      >
        {/* Mobile layout */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#999] truncate">{product.nameShort ?? product.name}</div>
              <div className="text-brand-green font-bold text-sm">
                {product.contactForPrice ? 'Liên hệ báo giá' : formatPrice(displayPrice)}
              </div>
            </div>
            {product.contactForPrice ? (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('ldv:open-appointment'))}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-colors bg-brand-green text-white hover:bg-brand-green-dk"
              >
                Liên hệ ngay
              </button>
            ) : (
              <button
                onClick={handleAdd}
                disabled={outOfStock}
                className={[
                  'px-5 py-2.5 rounded-xl text-sm font-bold transition-colors',
                  outOfStock ? 'bg-[#e2e8f0] text-[#aaa] cursor-not-allowed'
                  : added ? 'bg-[#0d9e6a] text-white'
                  : 'bg-brand-green text-white hover:bg-brand-green-dk',
                ].join(' ')}
              >
                {outOfStock ? 'Hết hàng' : added ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
              </button>
            )}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-10 py-3">
            <div className="flex items-center gap-5">
              <img
                src={thumbnailImages[0]}
                alt={product.nameShort ?? product.name}
                className="w-12 h-12 rounded-xl object-contain border border-[#ede8e0]"
                style={{ background: '#f9f6f1' }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1a1a1a] truncate" style={{ letterSpacing: '-0.01em' }}>
                  {product.name}
                </div>
                <div className="text-brand-green font-bold text-base" style={{ letterSpacing: '-0.02em' }}>
                  {product.contactForPrice ? 'Liên hệ báo giá' : formatPrice(displayPrice)}
                </div>
              </div>
              {product.contactForPrice ? (
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('ldv:open-appointment'))}
                  className="px-7 py-3 rounded-xl text-sm font-bold transition-all bg-brand-green text-white hover:bg-brand-green-dk hover:-translate-y-0.5"
                  style={{ boxShadow: '0 4px 12px rgba(16,78,46,0.28)' }}
                >
                  Liên hệ báo giá
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className={[
                    'px-7 py-3 rounded-xl text-sm font-bold transition-all',
                    outOfStock ? 'bg-[#e2e8f0] text-[#aaa] cursor-not-allowed'
                    : added ? 'bg-[#0d9e6a] text-white'
                    : 'bg-brand-green text-white hover:bg-brand-green-dk hover:-translate-y-0.5',
                  ].join(' ')}
                  style={!outOfStock && !added ? { boxShadow: '0 4px 12px rgba(16,78,46,0.28)' } : {}}
                >
                  {outOfStock ? 'Hết hàng' : added ? '✓ Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
