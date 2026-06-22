'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

interface StorySummary {
  id: string
  title: string
  genre: string
  platform: string
  sceneCount: number
  createdAt: string
}

export default function LibraryPage() {
  const { token } = useAuth()
  const [stories, setStories] = useState<StorySummary[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/stories', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to load stories')
        const data = await res.json()
        setStories(data.data || [])
      } catch (err: any) {
        setError(err.message || "Couldn't load your stories.")
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchStories()
  }, [token])

  const filtered = stories.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/stories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Delete failed')
      setStories((prev) => prev.filter((s) => s.id !== id))
    } catch {
      setError("Couldn't delete story. Please try again.")
    }
  }

  if (loading) {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-[#0A0A0A] dark:text-white mb-6">
        My Stories
      </h1>

      {error && (
        <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg px-4 py-3 mb-4">
          <p className="text-sm text-[#DC2626]">{error}</p>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search stories..."
        className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] focus:outline-none text-[#0A0A0A] dark:text-white placeholder-[#999999] dark:placeholder-[#666666] rounded-lg px-3 py-2.5 text-sm transition-colors mb-6"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6719]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#FF6719] text-2xl">✦</span>
          </div>
          <h3 className="text-[#0A0A0A] dark:text-white font-semibold text-lg mb-2">
            No stories yet
          </h3>
          <p className="text-[#999999] dark:text-[#666666] text-sm mb-6">
            Generate your first story to get started.
          </p>
          <Link
            href="/generate"
            className="bg-[#FF6719] hover:bg-[#E5580E] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Create a Story
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-5 flex flex-col gap-3"
            >
              <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-white">
                {story.title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="brand">{story.genre}</Badge>
              </div>
              <p className="text-xs text-[#999999] dark:text-[#666666]">
                {story.sceneCount} scenes •{' '}
                {new Date(story.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 mt-auto">
                <Link
                  href={`/story/${story.id}`}
                  className="text-xs font-semibold text-[#FF6719] hover:underline"
                >
                  Open
                </Link>
                <button
                  onClick={() => handleDelete(story.id)}
                  className="text-xs font-semibold text-[#DC2626] hover:underline ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
