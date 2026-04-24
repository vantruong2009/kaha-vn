import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Kiểm Tra Đơn Hàng | LongDenViet',
  description: 'Tra cứu trạng thái đơn hàng tại LongDenViet.',
};

// Redirect to the canonical order tracking page
export default function KiemTraDonHangPage() {
  redirect('/theo-doi-don-hang');
}
