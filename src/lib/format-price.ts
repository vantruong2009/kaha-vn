// Pure price/rating formatting helpers. No data imports → safe cho client.

export function formatPrice(price: number): string {
  if (!price || price <= 0) return "Liên hệ";
  return price.toLocaleString("vi-VN") + "đ";
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = "★".repeat(full);
  if (half) stars += "☆";
  return stars;
}
