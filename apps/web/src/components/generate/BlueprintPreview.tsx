import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StoryInput } from '@/types'

interface BlueprintPreviewProps {
  inputs: Partial<StoryInput>
  onEdit: () => void
  onGenerate: () => void
  isGenerating: boolean
}

export function BlueprintPreview({
  inputs,
  onEdit,
  onGenerate,
  isGenerating,
}: BlueprintPreviewProps) {
  const items = [
    ['Genre', inputs.genre],
    ['Character Type', inputs.characterType],
    ['Cultural Setting', inputs.culturalSetting],
    ['Conflict', inputs.conflict],
    ['Tone', inputs.tone],
    ['Scenes', inputs.sceneCount?.toString()],
  ]

  return (
    <div>
      <Card elevated className="mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full bg-[#FF6719]" />
          <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest">
            Story Blueprint
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {items.map(([label, value]) => (
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
        <Button variant="secondary" onClick={onEdit}>
          ← Edit Inputs
        </Button>
        <Button onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Story →'}
        </Button>
      </div>
    </div>
  )
}
