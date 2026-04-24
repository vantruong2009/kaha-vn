export interface ProductVariation {
  sku: string;
  price: number;
  attributes: Record<string, string>; // e.g. {color: 'Đỏ', size: '30cm'}
  inStock: boolean;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameShort: string;
  maker: string;
  makerRegion: string;
  story: string;
  description: string;
  price: number;
  priceOriginal?: number;
  image: string;
  images: string[];
  category: string;
  space: string[];
  rating?: number;
  reviewCount?: number;
  badge?: 'new' | 'sale' | 'tet' | 'bestseller';
  badgeLabel?: string;
  contactForPrice?: boolean;
  dimensions?: string;
  material?: string;
  origin?: string;
  weight?: string;
  tags: string[];
  isNew: boolean;
  isBestseller: boolean;
  stock: number;
  variations?: ProductVariation[];
}

// Utility functions — NO product data imports (prevents 2MB JSON from bundling into client JS)
// Server components needing product/category data should import from '@/lib/products' directly
export { formatPrice, renderStars } from '@/lib/format-price';

export const spaces = [
  { id: 'phong-khach', label: 'Phòng Khách', count: 48 },
  { id: 'ban-cong', label: 'Ban Công & Sân Vườn', count: 32 },
  { id: 'cafe', label: 'Quán Cà Phê', count: 56 },
  { id: 'nha-hang', label: 'Nhà Hàng', count: 41 },
  { id: 'tiec-cuoi', label: 'Tiệc Cưới', count: 27 },
];
