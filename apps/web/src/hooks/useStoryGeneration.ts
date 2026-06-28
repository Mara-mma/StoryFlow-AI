'use client'

import { useState } from 'react'
import { api, ApiError } from '@/lib/api'
import { StoryInput, GeneratedStory, GenerationStep, AppMode } from '@/types'

const DURATION_PRESETS = [
  { label: '30 seconds', scenes: 3 },
  { label: '1 minute', scenes: 5 },
  { label: '2 minutes', scenes: 8 },
  { label: '3 minutes', scenes: 12 },
]

function estimateDurationLabel(count: number): string {
  if (count <= 4) return '~30 seconds'
  if (count <= 6) return '~1 minute'
  if (count <= 9) return '~2 minutes'
  if (count <= 14) return '~3 minutes'
  return '~4-5 minutes'
}

export function useStoryGeneration() {
  const [step, setStep] = useState<GenerationStep>(1)
  const [mode, setMode] = useState<AppMode>('beginner')
  const [inputs, setInputs] = useState<Partial<StoryInput>>({})
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customCount, setCustomCount] = useState<string>('')
  const [showUpgrade, setShowUpgrade] = useState(false)

  const getSceneCount = () => {
    if (selectedPreset !== null) return DURATION_PRESETS[selectedPreset].scenes
    const parsed = parseInt(customCount)
    if (!isNaN(parsed) && parsed >= 3 && parsed <= 20) return parsed
    return null
  }

  const getDurationLabel = () => {
    if (selectedPreset !== null) return DURATION_PRESETS[selectedPreset].label
    const parsed = parseInt(customCount)
    if (!isNaN(parsed) && parsed >= 3 && parsed <= 20) return estimateDurationLabel(parsed)
    return ''
  }

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index)
    setCustomCount('')
    const preset = DURATION_PRESETS[index]
    setInputs((prev) => ({ ...prev, sceneCount: preset.scenes, durationLabel: preset.label }))
  }

  const handleCustomCountChange = (value: string) => {
    setCustomCount(value)
    setSelectedPreset(null)
    const parsed = parseInt(value)
    if (!isNaN(parsed) && parsed >= 3 && parsed <= 20) {
      setInputs((prev) => ({ ...prev, sceneCount: parsed, durationLabel: estimateDurationLabel(parsed) }))
    } else {
      setInputs((prev) => {
        const { sceneCount, durationLabel, ...rest } = prev
        return rest
      })
    }
  }

  const previewBlueprint = () => {
    const required = [
      'genre', 'characterType', 'culturalSetting',
      'conflict', 'tone',
    ]
    const missing = required.filter(k => !inputs[k as keyof StoryInput])
    if (missing.length > 0) {
      setError('Please fill in all required fields.')
      return
    }
    const count = getSceneCount()
    if (count === null) {
      setError('Please select a duration or enter a scene count between 3 and 20.')
      return
    }
    setError(null)
    setStep(2)
  }

  const generateStory = async (token?: string): Promise<boolean> => {
    setIsGenerating(true)
    setError(null)
    setShowUpgrade(false)

    try {
      const { durationLabel, ...apiPayload } = inputs
      const result = await api.generateStory(apiPayload as StoryInput, token)
      setStory(result.data as GeneratedStory)
      setStep(3)
      return true
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 402) {
        setShowUpgrade(true)
        return false
      }
      setError(err.message || 'Generation failed. Please try again.')
      return false
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
    setSelectedPreset(null)
    setCustomCount('')
  }

  return {
    step, mode, inputs, story, isGenerating, error,
    selectedPreset, customCount, showUpgrade,
    setStep, setMode, setInputs, previewBlueprint, generateStory, reset, setShowUpgrade,
    handlePresetSelect, handleCustomCountChange, getSceneCount, getDurationLabel,
  }
}