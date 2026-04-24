'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';

interface BundleItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  maker: string;
}

interface BoughtTogetherClientProps {
  items: BundleItem[];
  totalPrice: number;
}

export default function BoughtTogetherClient({ items, totalPrice }: BoughtTogetherClientProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddAll = () => {
    for (const item of items) {
      addItem({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        image: item.image,
        maker: item.maker,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
      <div className="text-sm text-[#4a4a4a]">
        <span className="font-semibold text-[#1a1a1a]">Tổng bộ:</span>{' '}
        <span className="text-2xl font-bold text-brand-green">{formatPrice(totalPrice)}</span>
      </div>
      <button
        onClick={handleAddAll}
        className={[
          'px-6 py-3 rounded font-bold text-sm transition-colors duration-200 whitespace-nowrap',
          added
            ? 'bg-brand-teal text-white'
            : 'bg-brand-green text-white hover:bg-brand-green-dk',
        ].join(' ')}
      >
        <span className="flex items-center justify-center gap-2">
          {added ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Đã thêm tất cả vào giỏ!
            </>
          ) : 'Thêm tất cả vào giỏ'}
        </span>
      </button>
    </div>
  );
}
