export default function ProductsLoading() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-3 w-24 bg-brand-border rounded-full animate-pulse mb-3" />
          <div className="h-8 w-56 bg-brand-border rounded-full animate-pulse mb-2" />
          <div className="h-3 w-32 bg-brand-border rounded-full animate-pulse opacity-60" />
        </div>

        {/* Search + sort bar skeleton */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 h-10 bg-brand-border rounded-full animate-pulse" />
          <div className="w-40 h-10 bg-brand-border rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-[240px_1fr] gap-8">
          {/* Sidebar skeleton */}
          <div className="bg-white rounded-xl p-6 border border-[#EDE5D8] space-y-4">
            <div className="h-4 w-28 bg-brand-border rounded animate-pulse" />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-3 bg-brand-border rounded animate-pulse opacity-60" style={{ width: `${60 + i * 8}%` }} />
            ))}
            <div className="pt-4 border-t border-[#EDE5D8]">
              <div className="h-4 w-24 bg-brand-border rounded animate-pulse mb-3" />
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-3 bg-brand-border rounded animate-pulse opacity-60 mb-2" style={{ width: `${55 + i * 7}%` }} />
              ))}
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#EDE5D8]">
                <div className="aspect-square bg-brand-green-lt animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-2.5 w-20 bg-brand-border rounded animate-pulse opacity-60" />
                  <div className="h-4 bg-brand-border rounded animate-pulse" />
                  <div className="h-3 w-4/5 bg-brand-border rounded animate-pulse opacity-50" />
                  <div className="h-5 w-28 bg-brand-border rounded animate-pulse mt-1" />
                  <div className="h-9 bg-brand-border rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
