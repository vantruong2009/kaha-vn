export default function BlogLoading() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-3 w-20 bg-[#e0e0e0] rounded animate-pulse" />
          <div className="h-3 w-3 bg-[#e0e0e0] rounded animate-pulse" />
          <div className="h-3 w-16 bg-[#e0e0e0] rounded animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="h-10 w-64 bg-[#e0e0e0] rounded animate-pulse mb-8" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#EDE5D8] overflow-hidden">
              <div className="h-48 bg-[#e8e8e8] animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-[#e0e0e0] rounded animate-pulse" />
                <div className="h-5 w-full bg-[#e0e0e0] rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-[#e0e0e0] rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-[#e0e0e0] rounded animate-pulse" />
                <div className="h-3 w-24 bg-[#e0e0e0] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
