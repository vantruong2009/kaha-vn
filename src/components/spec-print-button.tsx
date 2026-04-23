"use client";

export function SpecPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="border border-ink-900 px-4 py-2 text-xs uppercase tracking-[0.06em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-paper print:hidden"
    >
      In / Lưu PDF
    </button>
  );
}
