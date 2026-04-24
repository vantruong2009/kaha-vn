export default function CategoryLoading() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Category hero skeleton */}
      <div className="bg-white border-b border-[#EDE5D8] py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-2.5 w-32 bg-[#EDE5D8] rounded-full animate-pulse mb-3" />
          <div className="h-8 w-64 bg-[#EDE5D8] rounded-full animate-pulse mb-2" />
          <div className="h-3 w-48 bg-[#EDE5D8] rounded-full animate-pulse opacity-60" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter bar skeleton */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[80, 100, 90, 110, 85].map((w, i) => (
            <div key={i} className="h-8 bg-[#EDE5D8] rounded-full animate-pulse" style={{ width: w }} />
          ))}
        </div>

        {/* Product grid skeleton — 5 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EDE5D8]">
              <div className="aspect-[4/5] bg-[#E8E0D4] animate-pulse" />
              <div className="p-3.5 space-y-2">
                <div className="h-2 w-16 bg-[#EDE5D8] rounded animate-pulse opacity-60" />
                <div className="h-3.5 bg-[#EDE5D8] rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-[#EDE5D8] rounded animate-pulse opacity-50" />
                <div className="h-4 w-24 bg-[#EDE5D8] rounded animate-pulse mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
