'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface WishlistContextType {
  wishlistItems: string[];
  addToWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
  toggleWishlist: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  clearWishlist: () => void;
  totalWishlist: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = 'ldv_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  // Load from localStorage after mount (avoid SSR/client mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setWishlistItems(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch { /* ignore */ }
  }, [wishlistItems]);

  const addToWishlist = useCallback((slug: string) => {
    setWishlistItems(prev =>
      prev.includes(slug) ? prev : [...prev, slug]
    );
  }, []);

  const removeFromWishlist = useCallback((slug: string) => {
    setWishlistItems(prev => prev.filter(s => s !== slug));
  }, []);

  const isInWishlist = useCallback(
    (slug: string) => wishlistItems.includes(slug),
    [wishlistItems]
  );

  const toggleWishlist = useCallback((slug: string) => {
    setWishlistItems(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const totalWishlist = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist, totalWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
