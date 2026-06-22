'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { GeneratedStory } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'

export default function StoryPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/stories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Story not found.')
        const data = await res.json()
        setStory(data.data)
      } catch (err: any) {
        setError(err.message || 'Story not found.')
      } finally {
        setLoading(false)
      }
    }

    if (token && id) fetchStory()
  }, [token, id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Skeleton lines={2} />
        <div className="h-40 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded-xl mt-6" />
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-semibold text-[#0A0A0A] dark:text-white mb-2">
          {error || 'Story not found.'}
        </h2>
        <Link
          href="/library"
          className="text-sm text-[#FF6719] hover:underline font-medium"
        >
          Back to Library
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/library"
        className="text-sm text-[#555555] dark:text-[#A0A0A0] hover:text-[#FF6719] transition-colors mb-6 inline-block"
      >
        ← Back to Library
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A0A0A] dark:text-white mb-2">
          {story.title}
        </h1>
        <div className="bg-[#FF6719]/10 border border-[#FF6719]/30 rounded-lg px-4 py-3">
          <p className="text-sm text-[#FF6719] font-medium">{story.moral}</p>
        </div>
      </div>

      <Card className="mb-6">
        <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
          Character
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(story.character).map(([key, val]) => (
            <div key={key}>
              <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-sm text-[#0A0A0A] dark:text-white font-medium">
                {val as string}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-8">
        <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
          Blueprint
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(story.blueprint).map(([key, val]) => (
            <div key={key}>
              <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
                {key}
              </p>
              <p className="text-sm text-[#0A0A0A] dark:text-white font-medium">
                {val as string}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {story.scenes.map((scene) => (
          <Card key={scene.sceneNumber}>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#FF6719] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                Scene {scene.sceneNumber}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                ['Setting', scene.setting],
                ['Action', scene.action],
                ['Dialogue', scene.dialogue],
              ].map(([label, text]) => (
                <div key={label}>
                  <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm text-[#0A0A0A] dark:text-white">
                    {text}
                  </p>
                </div>
              ))}
              <div>
                <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
                  VOICEOVER
                </p>
                <p className="text-sm text-[#0A0A0A] dark:text-white">
                  {scene.voiceover}
                </p>
                <p className="text-xs text-[#999999] dark:text-[#666666] mt-0.5 italic">
                  Spoken by unseen narrator — not by any character on screen
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
