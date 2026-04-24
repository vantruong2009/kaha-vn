'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SecondaryNavItemSetting } from '@/lib/site-settings';

const DEFAULT_NAV_ITEMS: SecondaryNavItemSetting[] = [
  { label: '🧧 Đèn Tết', href: '/c/den-long-tet', categoryId: 'den-long-tet', isTet: true },
  { label: 'Đèn Lồng', href: '/c/hoi-an-lantern', categoryId: 'hoi-an-lantern' },
  { label: 'Đèn Tre & Mây', href: '/c/den-may-tre', categoryId: 'den-may-tre' },
  { label: 'Đèn Vải Lụa', href: '/c/den-vai-cao-cap', categoryId: 'den-vai-cao-cap' },
  { label: 'Đèn Gỗ', href: '/c/den-long-go', categoryId: 'den-long-go' },
  { label: 'Sản Phẩm Hot', href: '/c/san-pham-hot', categoryId: 'san-pham-hot' },
  { label: 'Cho Cà Phê & Nhà Hàng', href: '/den-trang-tri-nha-hang-quan-cafe', categoryId: null },
  { label: 'Cho Khách Sạn & Resort', href: '/den-trang-tri-khach-san-resort', categoryId: null },
  { label: 'Noel & Giáng Sinh', href: '/c/den-noel', categoryId: 'den-noel' },
  { label: 'Halloween', href: '/c/den-halloween', categoryId: 'den-halloween' },
  { label: 'Câu Chuyện Nghệ Nhân', href: '/ve-chung-toi', categoryId: null },
  { label: 'Blog', href: '/blog', categoryId: null },
];

/**
 * Determine which nav category is "active" for a given pathname.
 * - /c/[cat]           → match by categoryId
 * - /p/[slug]          → look up product's category, match by categoryId
 * - /san-pham          → no category active (all products)
 * - exact match or startsWith for simple routes (/ve-chung-toi)
 */
function getActiveCategoryId(pathname: string): string | null {
  // Product detail: /p/[slug] — category unknown client-side, skip highlight
  if (pathname.startsWith('/p/')) {
    return null;
  }
  // Category: /c/[cat]
  if (pathname.startsWith('/c/')) {
    return pathname.replace('/c/', '').split('/')[0];
  }
  return null;
}

export default function Navigation({ items }: { items?: SecondaryNavItemSetting[] }) {
  const pathname = usePathname();
  const activeCategoryId = getActiveCategoryId(pathname);
  const effectiveItems = items?.length ? items : DEFAULT_NAV_ITEMS;

  return (
    <nav className="bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <div className="flex items-center min-w-max md:min-w-0 md:justify-center">
          {effectiveItems.map((item) => {
            // Active logic:
            // 1. If item has a categoryId, check if it matches the active category
            // 2. Otherwise, do exact or startsWith match on href path (ignoring query)
            const isActive = item.categoryId
              ? activeCategoryId === item.categoryId
              : pathname === item.href.split('?')[0] ||
                (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150',
                  item.isTet
                    ? isActive
                      ? 'text-brand-red font-bold border-brand-red'
                      : 'text-brand-red font-bold border-transparent hover:border-brand-red/30'
                    : isActive
                    ? 'text-brand-green font-bold border-brand-green'
                    : 'text-[#4a4a4a] border-transparent hover:text-brand-green hover:border-brand-green-lt',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
