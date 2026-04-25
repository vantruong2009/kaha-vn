/**
 * image-seo.ts
 * Helper functions for SEO-optimized image alt text and titles.
 * Dùng chung cho ProductCard, ProductDetailClient, SearchModal, WishlistDrawer.
 */

import type { Product } from '@/data/products';

// Map category slug → từ khóa tìm kiếm phổ biến bằng tiếng Việt
const CATEGORY_KEYWORD: Record<string, string> = {
  // Danh mục đang hoạt động (slug)
  'hoi-an-lantern':       'đèn lồng Hội An',
  'den-trung-thu':        'đèn trung thu',
  'den-vai-cao-cap':      'đèn vải cao cấp',
  'den-may-tre':          'đèn mây tre',
  'den-long-go':          'đèn lồng gỗ',
  'den-nhat-ban':         'đèn kiểu Nhật Bản',
  'den-tha-tran':         'đèn thả trần',
  'den-ve-tranh':         'đèn vẽ tranh',
  'den-ban':              'đèn bàn trang trí',
  'den-trai-tim':         'đèn trái tim',
  'den-tron-10-mau':      'đèn tròn 10 màu',
  'den-nhua-xuyen-sang':  'đèn nhựa xuyên sáng',
  'phu-kien':             'phụ kiện đèn lồng',
  'qua-tang-den-long':    'quà tặng đèn lồng',
  'long-den-khung-sat':   'lồng đèn khung sắt',
  'ngoi-sao-nhua':        'đèn ngôi sao nhựa',
  // Legacy / redirect targets
  'den-tre':              'đèn tre thủ công',
  'den-hoi-an':           'đèn lồng Hội An truyền thống',
  'long-den-vai-lua':     'lồng đèn vải lụa',
  'long-den-cao-cap':     'lồng đèn cao cấp',
  'den-cung-dinh':        'đèn cung đình',
  'den-12-con-giap':      'đèn 12 con giáp',
  'den-chum':             'đèn chùm',
  'den-thong-tang':       'đèn thông tầng',
  'kaha-living':          'đèn trang trí nội thất',
  'den-noi-that':         'đèn nội thất',
  'den-quan-cafe':        'đèn quán cafe',
  'den-nha-hang':         'đèn nhà hàng',
  'den-khach-san':        'đèn khách sạn',
  'den-quan-tra-sua':     'đèn quán trà sữa',
  'den-treo-quan-bbq':    'đèn treo quán BBQ',
  'den-sushi-bbq':        'đèn sushi BBQ',
  'long-den-gia-re':      'lồng đèn giá rẻ',
  'den-long-tet':         'đèn lồng Tết',
  'hoa-dang':             'hoa đăng thả sông',
  'den-nom':              'đèn nón lá',
  'den-vai-nhan':         'đèn vải nhăn',
  'long-den-vai-hoa':     'lồng đèn vải hoa',
  'phong-khach':          'đèn phòng khách',
  'phong-ngu':            'đèn phòng ngủ',
  'phong-bep':            'đèn phòng bếp',
  'ngoai-troi':           'đèn ngoài trời',
  'den-ngoai-troi':       'đèn ngoài trời',
  'den-op-tuong':         'đèn ốp tường',
  'den-gan-tuong':        'đèn gắn tường',
  'den-ap-tuong':         'đèn áp tường',
  'den-san':              'đèn sàn trang trí',
  'den-long-mini':        'đèn lồng mini',
  'hang-moi':             'đèn lồng mới nhất',
  'top-ban-chay':         'đèn lồng bán chạy',
};

function getCategoryKeyword(category: string): string {
  return CATEGORY_KEYWORD[category] ?? 'đèn lồng thủ công';
}

/**
 * Alt text tối ưu SEO cho ảnh chính sản phẩm.
 * Formula: "{tên đầy đủ} — {từ khóa danh mục} {vùng sản xuất} | KAHA"
 */
export function productAlt(product: Product): string {
  const catKw = getCategoryKeyword(product.category);
  return `${product.name} — ${catKw} ${product.makerRegion} | KAHA`;
}

/**
 * Alt text cho ảnh thumbnail thứ N (index bắt đầu từ 0).
 * Formula: "{tên đầy đủ} — hình ảnh {N+1} — {danh mục} | KAHA"
 */
export function productThumbAlt(product: Product, index: number): string {
  if (index === 0) return productAlt(product);
  const catKw = getCategoryKeyword(product.category);
  return `${product.name} — hình ${index + 1} — ${catKw} | KAHA`;
}

/**
 * Caption / title cho image sitemap và JSON-LD.
 * Formula: "{tên đầy đủ} — {danh mục} thủ công tại {vùng}. Sản xuất bởi {maker}."
 */
export function productImageCaption(product: Product): string {
  const catKw = getCategoryKeyword(product.category);
  return `${product.name} — ${catKw} thủ công tại ${product.makerRegion}. Sản xuất bởi ${product.maker}. Chính hãng tại KAHA.`;
}
