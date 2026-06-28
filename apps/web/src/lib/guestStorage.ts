import { GeneratedStory } from '@/types'

const GUEST_STORIES_KEY = 'storyflow_guest_stories'
const GUEST_COUNT_KEY = 'storyflow_guest_generations'
const MAX_GUEST_GENERATIONS = 5

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

export function getGuestGenerationCount(): number {
  if (typeof window === 'undefined') return 0
  const raw = localStorage.getItem(GUEST_COUNT_KEY)
  return raw ? parseInt(raw, 10) : 0
}

export function incrementGuestGenerationCount(): number {
  const count = getGuestGenerationCount() + 1
  localStorage.setItem(GUEST_COUNT_KEY, String(count))
  return count
}

export function hasGuestReachedLimit(): boolean {
  return getGuestGenerationCount() >= MAX_GUEST_GENERATIONS
}

export const GUEST_MAX = MAX_GUEST_GENERATIONS
