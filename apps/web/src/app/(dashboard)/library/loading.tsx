export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded w-48" />
        <div className="h-10 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
