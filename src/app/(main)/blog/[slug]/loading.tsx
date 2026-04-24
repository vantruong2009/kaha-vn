export default function BlogPostLoading() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-8">
          <div className="h-2.5 w-16 bg-[#EDE5D8] rounded-full animate-pulse" />
          <div className="h-2.5 w-4 bg-[#EDE5D8] rounded-full animate-pulse opacity-40" />
          <div className="h-2.5 w-32 bg-[#EDE5D8] rounded-full animate-pulse opacity-60" />
        </div>

        {/* Meta */}
        <div className="flex gap-3 mb-5">
          <div className="h-2.5 w-20 bg-[#EDE5D8] rounded-full animate-pulse opacity-50" />
          <div className="h-2.5 w-24 bg-[#EDE5D8] rounded-full animate-pulse opacity-50" />
        </div>

        {/* Title */}
        <div className="space-y-3 mb-6">
          <div className="h-8 bg-[#EDE5D8] rounded animate-pulse" />
          <div className="h-8 w-4/5 bg-[#EDE5D8] rounded animate-pulse" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-8">
          <div className="h-3.5 bg-[#EDE5D8] rounded animate-pulse opacity-60" />
          <div className="h-3.5 w-11/12 bg-[#EDE5D8] rounded animate-pulse opacity-60" />
          <div className="h-3.5 w-3/4 bg-[#EDE5D8] rounded animate-pulse opacity-40" />
        </div>

        {/* Hero image */}
        <div className="aspect-[16/9] bg-[#E8E0D4] rounded-2xl animate-pulse mb-10" />

        {/* Body paragraphs */}
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3.5 bg-[#EDE5D8] rounded animate-pulse opacity-50" style={{ width: i % 3 === 2 ? '60%' : '100%' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
