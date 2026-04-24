'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/data/products';

interface QuickViewCtxValue {
  product: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewCtx = createContext<QuickViewCtxValue>({
  product: null,
  openQuickView: () => {},
  closeQuickView: () => {},
});

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <QuickViewCtx.Provider value={{ product, openQuickView: setProduct, closeQuickView: () => setProduct(null) }}>
      {children}
    </QuickViewCtx.Provider>
  );
}

export function useQuickView() {
  return useContext(QuickViewCtx);
}
