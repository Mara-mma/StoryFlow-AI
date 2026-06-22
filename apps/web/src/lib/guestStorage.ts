import { GeneratedStory } from '@/types'

const GUEST_STORIES_KEY = 'storyflow_guest_stories'

export function saveGuestStory(story: GeneratedStory) {
  const existing = getGuestStories()
  const updated = [
    { ...story, id: crypto.randomUUID(), savedAt: new Date().toISOString() },
    ...existing,
  ]
  localStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated))
}

export function getGuestStories(): GeneratedStory[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(GUEST_STORIES_KEY)
  return raw ? JSON.parse(raw) : []
}

export function deleteGuestStory(id: string) {
  const updated = getGuestStories().filter((s: any) => s.id !== id)
  localStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated))
}
