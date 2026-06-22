export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-md px-4">
        <div className="h-6 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded w-3/4 mx-auto" />
        <div className="h-4 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded w-1/2 mx-auto" />
        <div className="h-32 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded-xl" />
      </div>
    </div>
  )
}
