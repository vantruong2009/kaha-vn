/** Bỏ qua header — focus vào `#main-content`. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[200] -translate-y-[150%] rounded-sm border border-hairline bg-paper px-4 py-2 text-sm font-medium text-ink-900 shadow-sm outline-none transition-transform focus:translate-y-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-platinum-deep motion-reduce:transition-none"
    >
      Bỏ qua tới nội dung
    </a>
  );
}
