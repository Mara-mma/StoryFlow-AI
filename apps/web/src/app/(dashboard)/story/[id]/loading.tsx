export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded w-64" />
        <div className="h-20 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded-xl" />
        <div className="h-32 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded-xl" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-48 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded-xl"
          />
        ))}
      </div>
    </div>
  )
}
