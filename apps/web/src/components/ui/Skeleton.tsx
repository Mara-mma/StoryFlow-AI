import { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number
}

export function Skeleton({ lines = 3, className = '' }: SkeletonProps) {
  const widths = ['w-3/4', 'w-1/2', 'w-5/6', 'w-2/3', 'w-4/5']

  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded ${
            widths[i % widths.length]
          }`}
        />
      ))}
    </div>
  )
}
