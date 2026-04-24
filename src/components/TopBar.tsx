export default function TopBar() {
  return (
    <div className="bg-[#1a6b3c] text-white text-center px-4 py-2 text-xs tracking-wide font-medium">
      Miễn phí vận chuyển đơn từ 500k —{' '}
      <a href="/lien-he" className="font-bold underline underline-offset-2 hover:text-white/80 transition-colors">
        Xem thêm ưu đãi →
      </a>
    </div>
  );
}
