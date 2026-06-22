'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { StoryInput, GeneratedStory, GenerationStep, AppMode } from '@/types'

export function useStoryGeneration() {
  const [step, setStep] = useState<GenerationStep>(1)
  const [mode, setMode] = useState<AppMode>('beginner')
  const [inputs, setInputs] = useState<Partial<StoryInput>>({})
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewBlueprint = () => {
    const required = [
      'genre', 'characterType', 'culturalSetting',
      'conflict', 'tone', 'sceneCount',
    ]
    const missing = required.filter(k => !inputs[k as keyof StoryInput])
    if (missing.length > 0) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    setStep(2)
  }

  const generateStory = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await api.generateStory(inputs as StoryInput)
      setStory(result.data as GeneratedStory)
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const reset = () => {
    setStep(1)
    setInputs({})
    setStory(null)
    setError(null)
    setIsGenerating(false)
  }

  return {
    step, mode, inputs, story, isGenerating, error,
    setStep, setMode, setInputs, previewBlueprint, generateStory, reset,
  }
}
