'use client'

import { useStoryGeneration } from '@/hooks/useStoryGeneration'
import { useAuth } from '@/context/AuthContext'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { StoryInput } from '@/types'
import { saveGuestStory } from '@/lib/guestStorage'
import { useRouter } from 'next/navigation'

const GENRE_OPTIONS = [
  'Moral Story',
  'Inspirational',
  'Comedy',
  'Drama',
  'Adventure',
  'Romance',
  'Fantasy',
  'Mystery',
  'Plot Twist',
  'Emotional',
]

const CHARACTER_OPTIONS = [
  'Human',
  'Animal',
  'Object',
  'Fruits',
  'Food',
  'Fantasy Creature',
  'Hybrid',
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

const SCENE_COUNT_OPTIONS = [4, 6, 8, 10, 12]

export default function GeneratePage() {
  const {
    step,
    mode,
    inputs,
    story,
    isGenerating,
    error,
    setMode,
    setInputs,
    setStep,
    previewBlueprint,
    generateStory,
    reset,
  } = useStoryGeneration()
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()

  const updateInput = (key: keyof StoryInput, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  const handleGenerate = async () => {
    await generateStory()
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <StepIndicator currentStep={step} />

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
        <div>
          <div className="flex items-center gap-1 bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg p-1 w-fit mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Select
              label="Story Category"
              placeholder="Select genre..."
              value={inputs.genre || ''}
              onChange={(e) => updateInput('genre', e.target.value)}
              options={GENRE_OPTIONS.map((g) => ({ value: g, label: g }))}
            />
            <Select
              label="Character Type"
              placeholder="Select character..."
              value={inputs.characterType || ''}
              onChange={(e) => updateInput('characterType', e.target.value)}
              options={CHARACTER_OPTIONS.map((c) => ({ value: c, label: c }))}
            />
            <Select
              label="Cultural Setting"
              placeholder="Select setting..."
              value={inputs.culturalSetting || ''}
              onChange={(e) => {
                updateInput('culturalSetting', e.target.value)
              }}
              options={CULTURAL_SETTINGS.map((s) => ({ value: s, label: s }))}
            />
            <Select
              label="Conflict Type"
              placeholder="Select conflict..."
              value={inputs.conflict || ''}
              onChange={(e) => updateInput('conflict', e.target.value)}
              options={CONFLICT_OPTIONS.map((c) => ({ value: c, label: c }))}
            />
            <Select
              label="Tone"
              placeholder="Select tone..."
              value={inputs.tone || ''}
              onChange={(e) => updateInput('tone', e.target.value)}
              options={TONE_OPTIONS.map((t) => ({ value: t, label: t }))}
            />
            <Select
              label="Scene Count"
              placeholder="Select count..."
              value={inputs.sceneCount?.toString() || ''}
              onChange={(e) =>
                updateInput('sceneCount', parseInt(e.target.value))
              }
              options={SCENE_COUNT_OPTIONS.map((s) => ({
                value: s.toString(),
                label: `${s} Scenes`,
              }))}
            />
          </div>

          {mode === 'advanced' && (
            <div className="space-y-4 mb-6">
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
          )}

          <Button onClick={previewBlueprint}>Preview Blueprint →</Button>
        </div>
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
                ['Scenes', inputs.sceneCount?.toString()],
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
            <div className="bg-[#FF6719]/10 border border-[#FF6719]/30 rounded-lg px-4 py-3">
              <p className="text-sm text-[#FF6719] font-medium">
                {story.moral}
              </p>
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
    </div>
  )
}
