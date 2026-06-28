'use client'

import { useState } from 'react'
import { useStoryGeneration } from '@/hooks/useStoryGeneration'
import { useAuth } from '@/context/AuthContext'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { StoryInput } from '@/types'
import { saveGuestStory, hasGuestReachedLimit, incrementGuestGenerationCount } from '@/lib/guestStorage'
import { UpgradePrompt } from '@/components/generate/UpgradePrompt'

const GENRE_OPTIONS = [
  { value: 'Moral Story', label: 'Moral Story', emoji: '📖' },
  { value: 'Inspirational', label: 'Inspirational', emoji: '✨' },
  { value: 'Comedy', label: 'Comedy', emoji: '😂' },
  { value: 'Drama', label: 'Drama', emoji: '🎭' },
  { value: 'Adventure', label: 'Adventure', emoji: '🏔️' },
  { value: 'Romance', label: 'Romance', emoji: '💕' },
  { value: 'Fantasy', label: 'Fantasy', emoji: '🦄' },
  { value: 'Mystery', label: 'Mystery', emoji: '🔍' },
  { value: 'Plot Twist', label: 'Plot Twist', emoji: '🌀' },
  { value: 'Emotional', label: 'Emotional', emoji: '💖' },
]

const CHARACTER_OPTIONS = [
  { value: 'Human', label: 'Human', emoji: '🧑' },
  { value: 'Animal', label: 'Animal', emoji: '🐾' },
  { value: 'Object', label: 'Object', emoji: '📦' },
  { value: 'Fruits', label: 'Fruits', emoji: '🍎' },
  { value: 'Food', label: 'Food', emoji: '🍕' },
  { value: 'Fantasy Creature', label: 'Fantasy Creature', emoji: '🐉' },
  { value: 'Hybrid', label: 'Hybrid', emoji: '🧬' },
]

const CULTURAL_SETTINGS = [
  'Nigerian Village',
  'Nigerian City',
  'Ghanaian Community',
  'Kenyan Community',
  'South African Community',
  'Generic African Setting',
  'American Suburb',
  'American City',
  'British Town',
  'European City',
  'Japanese City',
  'Chinese Community',
  'Indian Community',
  'Korean Community',
  'Traditional Middle Eastern',
  'Modern Middle Eastern City',
  'Magical Kingdom',
  'Ancient Realm',
  'Futuristic World',
]

const CONFLICT_OPTIONS = [
  'Betrayal',
  'Competition',
  'Greed',
  'Jealousy',
  'Dishonesty',
  'Lost Item',
  'Family Conflict',
  'Friendship Conflict',
  'Mistaken Identity',
  'Unexpected Discovery',
  'Kindness Rewarded',
  'Pride Before a Fall',
  'Sacrifice',
  'Redemption',
  'Secret Revealed',
]

const TONE_OPTIONS = [
  'Serious',
  'Lighthearted',
  'Inspirational',
  'Suspenseful',
  'Humorous',
  'Emotional',
]

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

function buildScriptText(story: any, durationLabel: string): string {
  const lines: string[] = []

  lines.push(story.title)
  lines.push('')

  const c = story.character
  lines.push(`Our story follows ${c.name}, a ${c.appearance.toLowerCase()} character with a ${c.personality.toLowerCase()} nature. ${c.motivation} ${c.culturalContext ? c.culturalContext + '.' : ''}`)
  lines.push('')

  for (const scene of story.scenes) {
    lines.push(`Scene ${scene.sceneNumber}`)
    lines.push('')
    lines.push(scene.setting)
    lines.push('')
    lines.push(scene.action)
    lines.push('')
    if (scene.dialogue) {
      const dialogueLines = scene.dialogue.split('\n').filter(Boolean)
      for (const dl of dialogueLines) {
        lines.push(dl)
      }
      lines.push('')
    }
    lines.push(`Narrator: ${scene.voiceover}`)
    lines.push('')
  }

  lines.push(`Moral: ${story.moral}`)

  return lines.join('\n')
}

export default function GeneratePage() {
  const {
    step, mode, inputs, story, isGenerating, error,
    selectedPreset, customCount, showUpgrade,
    setMode, setInputs, setStep,
    previewBlueprint, generateStory, reset, setShowUpgrade,
    handlePresetSelect, handleCustomCountChange, getDurationLabel,
  } = useStoryGeneration()
  const { isAuthenticated, token } = useAuth()

  const [view, setView] = useState<'structured' | 'script'>('structured')
  const [toast, setToast] = useState<string | null>(null)

  const updateInput = (key: keyof StoryInput, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  const handleGenerate = async () => {
    if (!isAuthenticated && hasGuestReachedLimit()) {
      setShowUpgrade(true)
      return
    }
    const ok = await generateStory(token || undefined)
    if (!isAuthenticated && ok) {
      incrementGuestGenerationCount()
    }
  }

  const handleSave = () => {
    if (story) {
      if (isAuthenticated) {
        fetch('http://localhost:3001/api/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(story),
        }).catch(() => {})
      } else {
        saveGuestStory(story)
      }
    }
  }

  const handleCopyScript = async () => {
    if (!story) return
    const text = buildScriptText(story, inputs.durationLabel || '')
    try {
      await navigator.clipboard.writeText(text)
      setToast('Script copied to clipboard')
      setTimeout(() => setToast(null), 2500)
    } catch {
      setToast('Failed to copy')
      setTimeout(() => setToast(null), 2500)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <StepIndicator currentStep={step} />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-white dark:bg-[#111111] border border-[#16A34A]/30 text-[#0A0A0A] dark:text-white text-sm px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
          <span className="text-[#16A34A]">✓</span> {toast}
        </div>
      )}

      {error && (
        <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-xl p-4 flex items-center justify-between mb-6">
          <p className="text-sm text-[#DC2626]">{error}</p>
          {step === 3 && (
            <Button variant="destructive" onClick={handleGenerate}>
              Try Again
            </Button>
          )}
        </div>
      )}

      {step === 1 && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-white">
                Create Your Story
              </h2>
              <p className="text-sm text-[#555555] dark:text-[#A0A0A0] mt-0.5">
                Select your preferences to generate a unique story
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg p-1">
              {['Beginner', 'Advanced'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m.toLowerCase() as 'beginner' | 'advanced')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    mode === m.toLowerCase()
                      ? 'bg-[#FF6719] text-white'
                      : 'text-[#999999] dark:text-[#666666] hover:text-[#0A0A0A] dark:hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
              Story Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {GENRE_OPTIONS.map((g) => {
                const isSelected = inputs.genre === g.value
                return (
                  <button
                    key={g.value}
                    onClick={() => updateInput('genre', g.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors text-center ${
                      isSelected
                        ? 'bg-white dark:bg-[#111111] border-[#FF6719]/60 ring-1 ring-[#FF6719]/40'
                        : 'bg-white dark:bg-[#111111] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF6719] hover:ring-1 hover:ring-[#FF6719]/10'
                    }`}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <span className={`text-xs font-medium leading-tight ${
                      isSelected
                        ? 'text-[#FF6719]'
                        : 'text-[#555555] dark:text-[#A0A0A0]'
                    }`}>
                      {g.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <hr className="border-[#E5E5E5] dark:border-[#2A2A2A] mb-8" />

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
              Character Type
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {CHARACTER_OPTIONS.map((c) => {
                const isSelected = inputs.characterType === c.value
                return (
                  <button
                    key={c.value}
                    onClick={() => updateInput('characterType', c.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors text-center ${
                      isSelected
                        ? 'bg-white dark:bg-[#111111] border-[#FF6719]/60 ring-1 ring-[#FF6719]/40'
                        : 'bg-white dark:bg-[#111111] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF6719] hover:ring-1 hover:ring-[#FF6719]/10'
                    }`}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className={`text-xs font-medium leading-tight ${
                      isSelected
                        ? 'text-[#FF6719]'
                        : 'text-[#555555] dark:text-[#A0A0A0]'
                    }`}>
                      {c.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <hr className="border-[#E5E5E5] dark:border-[#2A2A2A] mb-8" />

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
              Story Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Cultural Setting"
                placeholder="Select setting..."
                value={inputs.culturalSetting || ''}
                onChange={(e) => updateInput('culturalSetting', e.target.value)}
                options={CULTURAL_SETTINGS.map((s) => ({ value: s, label: s }))}
              />
              <Select
                label="Conflict Type"
                placeholder="Select conflict..."
                value={inputs.conflict || ''}
                onChange={(e) => updateInput('conflict', e.target.value)}
                options={CONFLICT_OPTIONS.map((c) => ({ value: c, label: c }))}
              />
            </div>
          </div>

          <hr className="border-[#E5E5E5] dark:border-[#2A2A2A] mb-8" />

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
              Tone
            </h3>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((t) => {
                const isSelected = inputs.tone === t
                return (
                  <button
                    key={t}
                    onClick={() => updateInput('tone', t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      isSelected
                        ? 'bg-[#FF6719] text-white border-[#FF6719]'
                        : 'bg-white dark:bg-[#111111] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#555555] dark:text-[#A0A0A0] hover:border-[#FF6719] hover:text-[#FF6719]'
                    }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          <hr className="border-[#E5E5E5] dark:border-[#2A2A2A] mb-8" />

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
              Duration
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {DURATION_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handlePresetSelect(i)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${
                    selectedPreset === i
                      ? 'bg-[#F0F0F0] dark:bg-[#1A1A1A] border-[#FF6719]/60 ring-1 ring-[#FF6719]/40 text-[#FF6719]'
                      : 'bg-white dark:bg-[#111111] border-[#E5E5E5] dark:border-[#2A2A2A] text-[#555555] dark:text-[#A0A0A0] hover:border-[#FF6719] hover:text-[#FF6719]'
                  }`}
                >
                  <span className="block font-semibold">{preset.label}</span>
                  <span className="block text-xs mt-0.5 opacity-70">{preset.scenes} scenes</span>
                </button>
              ))}
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-1.5 block">
                  Or enter a custom scene count
                </label>
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={customCount}
                  onChange={(e) => handleCustomCountChange(e.target.value)}
                  placeholder="3–20"
                  className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,103,25,0.15)] dark:focus:shadow-[0_0_0_3px_rgba(255,103,25,0.35)] text-[#0A0A0A] dark:text-white placeholder-[#999999] dark:placeholder-[#666666] rounded-lg px-3 py-2.5 text-sm transition-colors"
                />
              </div>
              {customCount && (
                <div className="pb-2.5">
                  <span className="text-sm text-[#555555] dark:text-[#A0A0A0]">
                    {estimateDurationLabel(parseInt(customCount) || 0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {mode === 'advanced' && (
            <>
              <hr className="border-[#E5E5E5] dark:border-[#2A2A2A] mb-8" />
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
                  Advanced Options
                </h3>
                <div className="space-y-4">
                  <Textarea
                    label="Story Idea (optional)"
                    placeholder="Describe your story idea..."
                    value={inputs.storyIdea || ''}
                    onChange={(e) => updateInput('storyIdea', e.target.value)}
                    rows={3}
                  />
                  <Textarea
                    label="Additional Instructions (optional)"
                    placeholder="Any specific directions for the AI..."
                    value={inputs.additionalInstructions || ''}
                    onChange={(e) =>
                      updateInput('additionalInstructions', e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}

          <Button onClick={previewBlueprint} className="w-full sm:w-auto">
            Preview Blueprint →
          </Button>
        </Card>
      )}

      {step === 2 && (
        <div>
          <Card elevated className="mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-[#FF6719]" />
              <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest">
                Story Blueprint
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Genre', inputs.genre],
                ['Character Type', inputs.characterType],
                ['Cultural Setting', inputs.culturalSetting],
                ['Conflict', inputs.conflict],
                ['Tone', inputs.tone],
                ['Duration', getDurationLabel()],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm text-[#0A0A0A] dark:text-white font-medium">
                    {value as string}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              ← Edit Inputs
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Story →'}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && story && (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0A0A0A] dark:text-white mb-2">
              {story.title}
            </h1>
            {inputs.durationLabel && (
              <p className="text-xs text-[#999999] dark:text-[#666666] mb-3">
                Estimated duration: {inputs.durationLabel}
              </p>
            )}
            <div className="bg-[#FF6719]/10 border border-[#FF6719]/30 rounded-lg px-4 py-3">
              <p className="text-sm text-[#FF6719] font-medium">
                {story.moral}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg p-1 w-fit mb-8">
            {(['structured', 'script'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                  view === v
                    ? 'bg-[#FF6719] text-white'
                    : 'text-[#999999] dark:text-[#666666] hover:text-[#0A0A0A] dark:hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {view === 'structured' ? (
            <>
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

              <div className="space-y-4 mb-8">
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
            </>
          ) : (
            <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6 mb-8">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm text-[#0A0A0A] dark:text-white leading-relaxed select-all">
                <p className="text-lg font-bold mb-4">{story.title}</p>
                <p className="mb-6">
                  Our story follows <strong>{story.character.name}</strong>, a{' '}
                  {story.character.appearance.toLowerCase()} character with a{' '}
                  {story.character.personality.toLowerCase()} nature.{' '}
                  {story.character.motivation}{' '}
                  {story.character.culturalContext
                    ? story.character.culturalContext + '.'
                    : ''}
                </p>
                {story.scenes.map((scene) => (
                  <div key={scene.sceneNumber} className="mb-6">
                    <p className="text-[#FF6719] font-bold text-base mb-2">
                      Scene {scene.sceneNumber}
                    </p>
                    <p className="mb-2">{scene.setting}</p>
                    <p className="mb-2">{scene.action}</p>
                    {scene.dialogue &&
                      scene.dialogue.split('\n').filter(Boolean).map((line, li) => (
                        <p key={li} className="mb-1">
                          {line}
                        </p>
                      ))}
                    <p className="italic text-[#555555] dark:text-[#A0A0A0] mt-2">
                      Narrator: {scene.voiceover}
                    </p>
                  </div>
                ))}
                <p className="italic mt-6 pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                  Moral: {story.moral}
                </p>
              </div>
              <Button onClick={handleCopyScript} className="mt-6">
                Copy Script
              </Button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>
              {isAuthenticated ? 'Save Story' : 'Save Locally'}
            </Button>
            <Button variant="secondary" onClick={reset}>
              Generate Another
            </Button>
          </div>
        </div>
      )}

      {step === 3 && isGenerating && (
        <div className="space-y-6">
          <p className="text-[#A0A0A0] text-sm animate-pulse">
            Writing your story...
          </p>
          {Array.from({ length: inputs.sceneCount || 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6"
            >
              <Skeleton lines={4} />
            </div>
          ))}
        </div>
      )}

      {showUpgrade && (
        <UpgradePrompt onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  )
}
