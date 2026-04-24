'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import type { Product } from '@/data/products';
import { productAlt } from '@/lib/image-seo';
import { fetchCustomerMe, notifyCustomerAuthChanged } from '@/lib/auth/fetch-customer-me';

interface WishlistDrawerProps {
  onClose: () => void;
}

export default function WishlistDrawer({ onClose }: WishlistDrawerProps) {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  // Auth state
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [signInOpen, setSignInOpen] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  // Sign in form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  // Create account form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    fetchCustomerMe().then(u => setLoggedIn(!!u));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const socialLogin = (provider: 'google' | 'facebook') => {
    const q = encodeURIComponent('/tai-khoan');
    if (provider === 'google') {
      window.location.href = `/api/auth/google/start?redirect=${q}`;
    } else {
      window.location.href = `/api/auth/facebook/start?redirect=${q}`;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const res = await fetch('/api/auth/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    setAuthLoading(false);
    if (!res.ok) {
      setAuthError(j.error || 'Email hoặc mật khẩu không đúng.');
    } else {
      notifyCustomerAuthChanged();
      setLoggedIn(true);
    }
  };

  const handleMagicLink = async () => {
    if (!email) { setAuthError('Nhập email trước.'); return; }
    setAuthLoading(true);
    setAuthError('');
    const res = await fetch('/api/auth/customer/magic/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setAuthLoading(false);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setAuthError(j.error || 'Không gửi được link.');
    } else {
      setMagicSent(true);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword.length < 6) { setRegError('Mật khẩu ít nhất 6 ký tự.'); return; }
    setRegLoading(true);
    setRegError('');
    const res = await fetch('/api/auth/customer/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: regEmail, password: regPassword, full_name: regName }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    setRegLoading(false);
    if (!res.ok) setRegError(j.error || 'Đăng ký thất bại.');
    else {
      notifyCustomerAuthChanged();
      setRegSuccess(true);
      setLoggedIn(true);
    }
  };

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (wishlistItems.length === 0) { setWishlistProducts([]); return; }
    let cancelled = false;
    fetch('/api/public/products-by-slugs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: wishlistItems }),
    })
      .then(r => r.json())
      .then((data: { products?: Product[] }) => {
        if (cancelled || !data?.products) return;
        setWishlistProducts(data.products);
      })
      .catch(() => { if (!cancelled) setWishlistProducts([]); });
    return () => { cancelled = true; };
  }, [wishlistItems]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[150]" onClick={onClose} aria-hidden />

      <div className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-white z-[200] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center pt-6 pb-4 px-6 border-b border-gray-100 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 text-[#888]" aria-label="Đóng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" strokeWidth="1.2" className="mb-2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Danh Sách Yêu Thích</h2>
          {loggedIn && (
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/auth/customer/logout', { method: 'POST', credentials: 'include' });
                notifyCustomerAuthChanged();
                setLoggedIn(false);
              }}
              className="absolute top-4 left-4 text-[10px] text-[#bbb] hover:text-[#888] transition-colors"
            >
              đăng xuất
            </button>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Wishlist items — always show regardless of login ── */}
          {(loggedIn === true || loggedIn === false) && (
            wishlistProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4 pb-16">
                <div className="w-16 h-16 rounded-full bg-[#fdeaea] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-base font-bold mb-1">Chưa có sản phẩm yêu thích</p>
                  <p className="text-sm text-[#888]">Nhấn nút tim trên sản phẩm để thêm vào danh sách.</p>
                </div>
                <Link href="/san-pham" onClick={onClose} className="bg-brand-green text-white font-bold px-8 py-3 rounded text-sm hover:bg-brand-green-dk transition-colors">
                  Khám phá sản phẩm
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {wishlistProducts.map(product => (
                  <div key={product.slug} className="flex gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <Link href={`/p/${product.slug}`} onClick={onClose} className="shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-[#ede8e0]">
                        <img src={product.image} alt={productAlt(product)} title={product.name} className="w-full h-full object-contain p-1.5" style={{ mixBlendMode: 'multiply', filter: 'contrast(1.04) saturate(1.1)' }} />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/p/${product.slug}`} onClick={onClose}>
                        <p className="text-sm font-semibold text-[#1a1a1a] leading-snug mb-1 hover:text-brand-green transition-colors line-clamp-2">{product.name}</p>
                      </Link>
                      <p className="text-xs text-[#888] mb-2">{product.maker}</p>
                      <p className="text-base font-bold">
                        {product.contactForPrice ? <span className="text-brand-green text-sm">Liên hệ báo giá</span> : formatPrice(product.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button onClick={() => removeFromWishlist(product.slug)} className="text-[#ccc] hover:text-brand-red transition-colors" aria-label="Xóa">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                      {!product.contactForPrice && product.stock > 0 && (
                        <button
                          onClick={() => addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, maker: product.maker })}
                          className="text-[11px] font-bold text-brand-green border border-brand-green px-3 py-1.5 rounded hover:bg-brand-green hover:text-white transition-colors"
                        >
                          + giỏ hàng
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ── Not logged in: compact login prompt ── */}
          {loggedIn === false && wishlistProducts.length > 0 && (
            <div className="px-6 py-3 bg-brand-green-lt border-b border-brand-border text-xs text-[#444] flex items-center gap-2">
              <span>Đăng nhập để lưu danh sách yêu thích vĩnh viễn.</span>
              <a href="/tai-khoan/dang-nhap" className="font-semibold text-brand-green underline">Đăng nhập</a>
            </div>
          )}

          {/* ── Not logged in + empty: show auth form ── */}
          {loggedIn === false && wishlistProducts.length === 0 && (
            <div className="divide-y divide-gray-200">

              {/* Sign In accordion */}
              <div>
                <button
                  onClick={() => setSignInOpen(o => !o)}
                  className="w-full flex items-center justify-between px-6 py-4 text-xl font-bold text-[#1a1a1a] hover:bg-gray-50 transition-colors"
                >
                  Đăng Nhập
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-transform duration-200 ${signInOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {signInOpen && (
                  <div className="px-6 pb-6 space-y-3">
                    {/* Social buttons */}
                    <button onClick={() => socialLogin('google')} className="w-full flex items-center gap-3 border border-gray-200 rounded px-4 py-2.5 text-sm font-medium text-[#1a1a1a] hover:bg-gray-50 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Đăng nhập bằng Google
                    </button>

                    <button onClick={() => socialLogin('facebook')} className="w-full flex items-center gap-3 bg-[#1877F2] rounded px-4 py-2.5 text-sm font-bold text-white hover:bg-[#166fe5] transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Đăng nhập bằng Facebook
                    </button>

                    <button disabled className="w-full flex items-center gap-3 border border-gray-100 rounded px-4 py-2.5 text-sm font-medium text-[#bbb] bg-gray-50 cursor-not-allowed">
                      <svg width="18" height="18" viewBox="0 0 48 48"><rect width="48" height="48" rx="8" fill="#0068FF"/><text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="'Be Vietnam Pro', sans-serif">Z</text></svg>
                      Zalo <span className="ml-auto text-[10px] text-[#ccc]">Sắp có</span>
                    </button>

                    <button disabled className="w-full flex items-center gap-3 border border-gray-100 rounded px-4 py-2.5 text-sm font-medium text-[#bbb] bg-gray-50 cursor-not-allowed">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#26A5E4"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.01 9.476c-.148.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.873.745z"/></svg>
                      Telegram <span className="ml-auto text-[10px] text-[#ccc]">Sắp có</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-gray-200"/>
                      <span className="text-xs font-bold text-[#888]">HOẶC</span>
                      <div className="flex-1 h-px bg-gray-200"/>
                    </div>

                    {/* Email + Password */}
                    {authError && <p className="text-xs text-brand-red">{authError}</p>}
                    {magicSent ? (
                      <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded text-center">
                        Đã gửi link đăng nhập đến <strong>{email}</strong>. Kiểm tra email nhé!
                      </div>
                    ) : (
                      <form onSubmit={handleSignIn} className="space-y-2.5">
                        <input
                          type="email"
                          placeholder="Địa chỉ email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-green"
                        />
                        <div className="relative">
                          <input
                            type={showPw ? 'text' : 'password'}
                            placeholder="Mật khẩu:"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-green pr-16"
                          />
                          <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-green text-xs font-bold">
                            {showPw ? 'ẩn' : 'hiện'}
                          </button>
                        </div>
                        <button type="submit" disabled={authLoading} className="w-full bg-brand-green text-white font-bold py-3 rounded text-sm hover:bg-brand-green-dk transition-colors disabled:opacity-60">
                          {authLoading ? 'Đang đăng nhập...' : 'đăng nhập'}
                        </button>
                        <p className="text-sm text-[#888]">
                          Quên mật khẩu?{' '}
                          <Link href="/tai-khoan/quen-mat-khau" onClick={onClose} className="text-brand-green underline">Đặt lại.</Link>
                        </p>
                        <div className="pt-1">
                          <p className="text-sm font-bold text-[#1a1a1a] mb-2">Hoặc đăng nhập không cần mật khẩu:</p>
                          <button
                            type="button"
                            onClick={handleMagicLink}
                            disabled={authLoading}
                            className="w-full bg-brand-green text-white font-bold py-3 rounded text-sm hover:bg-brand-green-dk transition-colors disabled:opacity-60"
                          >
                            nhận link đăng nhập qua email
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Create Account accordion */}
              <div>
                <button
                  onClick={() => setCreateOpen(o => !o)}
                  className="w-full flex items-center justify-between px-6 py-4 text-xl font-bold text-[#1a1a1a] hover:bg-gray-50 transition-colors"
                >
                  Tạo Tài Khoản
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-transform duration-200 ${createOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {createOpen && (
                  <div className="px-6 pb-6 space-y-3">
                    {regSuccess ? (
                      <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded text-center">
                        Kiểm tra email <strong>{regEmail}</strong> để xác nhận tài khoản!
                      </div>
                    ) : (
                      <form onSubmit={handleRegister} className="space-y-2.5">
                        {regError && <p className="text-xs text-brand-red">{regError}</p>}
                        <input
                          type="text"
                          placeholder="Họ và tên (tuỳ chọn)"
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-green"
                        />
                        <input
                          type="email"
                          placeholder="Địa chỉ email"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          required
                          className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-green"
                        />
                        <input
                          type="password"
                          placeholder="Mật khẩu (ít nhất 6 ký tự)"
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          required
                          className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-green"
                        />
                        <button type="submit" disabled={regLoading} className="w-full bg-brand-green text-white font-bold py-3 rounded text-sm hover:bg-brand-green-dk transition-colors disabled:opacity-60">
                          {regLoading ? 'Đang tạo...' : 'tạo tài khoản'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
