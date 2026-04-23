"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-paper-warm px-6 py-24 text-center">
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-500">
        Lỗi
      </p>
      <p className="mt-4 max-w-md text-sm text-ink-700">
        {error.message || "Đã xảy ra lỗi."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-10 border border-ink-900 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-900 hover:text-paper"
      >
        Thử lại
      </button>
    </div>
  );
}
