/** Hairline placeholders — no shimmer (Obsidian design rule). */
export default function Loading() {
  return (
    <div className="min-h-full bg-paper-warm px-5 py-24 md:px-12">
      <div className="mx-auto max-w-[720px] space-y-8">
        <div className="h-3 w-24 border border-hairline bg-paper" />
        <div className="h-14 max-w-xl border border-hairline bg-paper" />
        <div className="space-y-3">
          <div className="h-4 w-full border border-hairline bg-paper" />
          <div className="h-4 w-[92%] border border-hairline bg-paper" />
          <div className="h-4 w-[85%] border border-hairline bg-paper" />
        </div>
      </div>
    </div>
  );
}
