import { GeneratedStory } from '@/types'

const KEY = 'storyflow_guest_stories'

export function useGuestStories() {
  const getAll = (): GeneratedStory[] => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  }

  const save = (story: GeneratedStory) => {
    const all = getAll()
    const updated = [
      { ...story, id: crypto.randomUUID(), savedAt: new Date().toISOString() },
      ...all,
    ]
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  const remove = (id: string) => {
    const updated = getAll().filter((s: any) => s.id !== id)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  return { getAll, save, remove }
}
