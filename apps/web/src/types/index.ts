export interface User {
  id: string
  name: string
  email: string
}

export interface StoryInput {
  genre: string
  characterType: string
  culturalSetting: string
  conflict: string
  tone: string
  sceneCount: number
  storyIdea?: string
  additionalInstructions?: string
}

export interface Character {
  name: string
  appearance: string
  personality: string
  motivation: string
  role: string
  culturalContext: string
}

export interface Blueprint {
  setting: string
  conflict: string
  goal: string
  lesson: string
}

export interface Scene {
  sceneNumber: number
  setting: string
  action: string
  dialogue: string
  voiceover: string
}

export interface GeneratedStory {
  id?: string
  title: string
  moral: string
  character: Character
  blueprint: Blueprint
  scenes: Scene[]
  genre?: string
  createdAt?: string
}

export type GenerationStep = 1 | 2 | 3

export type AppMode = 'beginner' | 'advanced'
