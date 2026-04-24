'use client';

import { useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/data/products';

const PAGE_SIZE = 24;
const DEFAULT_SORT = 'popular';

interface Props {
  products: Product[];
}

function CategoryProductsInner({ products }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortBy = searchParams.get('sort') ?? DEFAULT_SORT;
  const currentPage = Number(searchParams.get('page') || '1');

  const setSortBy = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === DEFAULT_SORT) {
      params.delete('sort');
    } else {
      params.set('sort', val);
    }
    params.delete('page');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) {
      params.delete('page');
    } else {
      params.set('page', String(p));
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const sorted = useMemo(() => {
    const result = [...products];
    switch (sortBy) {
      case 'price-asc':  return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating':     return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:           return result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    }
  }, [products, sortBy]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const safePage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, sorted.length);
  const paginated = sorted.slice(startIdx, endIdx);

  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safePage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (safePage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages];
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-[#888]">
        <div className="text-base mb-2">Chưa có sản phẩm trong danh mục này.</div>
        <p className="text-sm text-[#aaa]">Thử xem tất cả sản phẩm của chúng tôi.</p>
      </div>
    );
  }

  const sortLabel: Record<string, string> = {
    'rating': 'Đánh giá cao nhất',
    'price-asc': 'Giá tăng dần',
    'price-desc': 'Giá giảm dần',
  };

  return (
    <div>
      {/* Sort + count bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-[#EDE5D8]">
        <span className="text-sm text-[#888]">
          Hiển thị{' '}
          <strong className="text-[#1a1a1a]">{startIdx + 1}–{endIdx}</strong>
          {' '}/ <strong className="text-[#1a1a1a]">{sorted.length}</strong> sản phẩm
        </span>

        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-[#ddd] text-sm text-[#333] px-4 py-2 pr-8 rounded-full cursor-pointer hover:border-brand-green focus:outline-none focus:border-brand-green transition-colors"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#888] text-xs">▾</span>
        </div>
      </div>

      {/* Active filter chips */}
      {sortBy !== DEFAULT_SORT && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold pl-2.5 pr-1.5 py-1 rounded-full" style={{ background: '#145530', color: '#F2B950' }}>
            {sortLabel[sortBy] ?? sortBy}
            <button
              onClick={() => setSortBy(DEFAULT_SORT)}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none flex-shrink-0 transition-colors"
              style={{ background: 'rgba(255,255,255,0.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; }}
              aria-label="Xóa"
            >
              <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="7" y2="7"/><line x1="7" y1="1" x2="1" y2="7"/>
              </svg>
            </button>
          </span>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {paginated.map((product, idx) => (
          <ProductCard key={product.id} product={product} priority={idx < 4} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage(safePage - 1)}
            disabled={safePage === 1}
            className="px-4 py-2 text-sm border border-[#EDE5D8] rounded hover:border-brand-green hover:text-brand-green transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#EDE5D8] disabled:hover:text-inherit"
          >
            ← Trước
          </button>

          {getPageNumbers().map((pg, idx) =>
            pg === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-[#888] text-sm select-none">
                ...
              </span>
            ) : (
              <button
                key={pg}
                onClick={() => setPage(pg as number)}
                className={`min-w-[38px] px-3 py-2 text-sm border rounded transition-colors ${
                  pg === safePage
                    ? 'bg-brand-green text-white border-brand-green font-semibold'
                    : 'border-[#EDE5D8] hover:border-brand-green hover:text-brand-green'
                }`}
              >
                {pg}
              </button>
            )
          )}

          <button
            onClick={() => setPage(safePage + 1)}
            disabled={safePage === totalPages}
            className="px-4 py-2 text-sm border border-[#EDE5D8] rounded hover:border-brand-green hover:text-brand-green transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#EDE5D8] disabled:hover:text-inherit"
          >
            Tiếp →
          </button>
        </div>
      )}
    </div>
  );
}

export default function CategoryProductsClient({ products }: Props) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 text-[#888] text-sm">
        Đang tải sản phẩm...
      </div>
    }>
      <CategoryProductsInner products={products} />
    </Suspense>
  );
}
