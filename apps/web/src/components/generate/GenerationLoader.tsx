import { Skeleton } from '@/components/ui/Skeleton'

interface GenerationLoaderProps {
  sceneCount: number
}

export function GenerationLoader({ sceneCount }: GenerationLoaderProps) {
  return (
    <div className="space-y-6">
      <p className="text-[#A0A0A0] text-sm animate-pulse">
        Writing your story...
      </p>
      {Array.from({ length: sceneCount }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6"
        >
          <Skeleton lines={4} />
        </div>
      ))}
    </div>
  )
}
