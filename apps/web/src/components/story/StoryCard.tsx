import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

interface StoryCardProps {
  id: string
  title: string
  genre: string
  platform: string
  sceneCount: number
  createdAt: string
  onDelete: (id: string) => void
}

export function StoryCard({
  id,
  title,
  genre,
  platform,
  sceneCount,
  createdAt,
  onDelete,
}: StoryCardProps) {
  return (
    <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-5 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-white">
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <Badge variant="brand">{genre}</Badge>
        <Badge>{platform}</Badge>
      </div>
      <p className="text-xs text-[#999999] dark:text-[#666666]">
        {sceneCount} scenes •{' '}
        {new Date(createdAt).toLocaleDateString()}
      </p>
      <div className="flex items-center gap-2 mt-auto">
        <Link
          href={`/story/${id}`}
          className="text-xs font-semibold text-[#FF6719] hover:underline"
        >
          Open
        </Link>
        <button
          onClick={() => onDelete(id)}
          className="text-xs font-semibold text-[#DC2626] hover:underline ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
