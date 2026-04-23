/** Hairline placeholders — khớp layout Journal. */
export default function JournalLoading() {
  return (
    <div className="min-h-full bg-paper-warm px-5 py-24 md:px-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="h-3 w-24 border border-hairline bg-paper" />
        <div className="h-12 max-w-md border border-hairline bg-paper" />
        <div className="h-4 max-w-xl border border-hairline bg-paper" />
        <div className="mt-16 space-y-10">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="space-y-3 border-b border-hairline pb-10"
            >
              <div className="h-3 w-32 border border-hairline bg-paper" />
              <div className="h-8 max-w-lg border border-hairline bg-paper" />
              <div className="h-4 w-full border border-hairline bg-paper" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
