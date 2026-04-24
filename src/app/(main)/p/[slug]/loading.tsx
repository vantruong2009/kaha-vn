export default function ProductDetailLoading() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 items-center mb-8">
          {[60, 20, 80].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 bg-brand-border rounded animate-pulse" style={{ width: w }} />
              {i < 2 && <span className="text-brand-border">›</span>}
            </div>
          ))}
        </div>

        {/* Product main grid */}
        <div className="grid grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            <div className="aspect-square bg-brand-green-lt rounded-xl animate-pulse mb-3" />
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="aspect-square bg-brand-green-lt rounded-lg animate-pulse opacity-60" />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="h-3 w-48 bg-brand-border rounded animate-pulse opacity-60" />
            <div className="h-10 bg-brand-border rounded animate-pulse w-4/5" />
            <div className="h-10 bg-brand-border rounded animate-pulse w-2/3" />
            <div className="flex gap-2">
              <div className="h-4 w-24 bg-brand-border rounded animate-pulse" />
              <div className="h-4 w-32 bg-brand-border rounded animate-pulse opacity-60" />
            </div>
            <div className="h-20 bg-brand-amber-lt rounded-lg animate-pulse" />
            <div className="h-12 w-40 bg-brand-border rounded animate-pulse" />
            <div className="h-12 bg-brand-green rounded animate-pulse" />
          </div>
        </div>

        {/* Maker skeleton */}
        <div className="bg-brand-green rounded-xl p-8 mb-16">
          <div className="flex gap-6 items-center">
            <div className="w-20 h-20 rounded-full bg-white/20 animate-pulse flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-32 bg-white/20 rounded animate-pulse" />
              <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
              <div className="h-3 w-full bg-white/20 rounded animate-pulse opacity-60" />
              <div className="h-3 w-4/5 bg-white/20 rounded animate-pulse opacity-60" />
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div>
          <div className="h-8 w-48 bg-brand-border rounded animate-pulse mb-6" />
          <div className="grid grid-cols-4 gap-5">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#EDE5D8]">
                <div className="aspect-square bg-brand-green-lt animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-3/4 bg-brand-border rounded animate-pulse" />
                  <div className="h-5 w-24 bg-brand-border rounded animate-pulse" />
                  <div className="h-9 bg-brand-border rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
