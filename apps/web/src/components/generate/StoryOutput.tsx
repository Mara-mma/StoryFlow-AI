import { GeneratedStory } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface StoryOutputProps {
  story: GeneratedStory
  onSave: () => void
  onReset: () => void
  isAuthenticated: boolean
}

export function StoryOutput({
  story,
  onSave,
  onReset,
}: StoryOutputProps) {
  return (
    <div>
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
                  <p className="text-sm text-[#0A0A0A] dark:text-white">{text}</p>
                </div>
              ))}
              <div>
                <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
                  VOICEOVER
                </p>
                <p className="text-sm text-[#0A0A0A] dark:text-white">{scene.voiceover}</p>
                <p className="text-xs text-[#999999] dark:text-[#666666] mt-0.5 italic">
                  Spoken by unseen narrator — not by any character on screen
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onSave}>Save Story</Button>
        <Button variant="secondary" onClick={onReset}>
          Generate Another
        </Button>
      </div>
    </div>
  )
}
