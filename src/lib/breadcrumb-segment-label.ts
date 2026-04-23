/** Nhãn hiển thị từ một segment URL (không đổi slug thật). */
export function breadcrumbSegmentLabel(seg: string): string {
  try {
    return decodeURIComponent(seg).replace(/-/g, " ");
  } catch {
    return seg.replace(/-/g, " ");
  }
}
