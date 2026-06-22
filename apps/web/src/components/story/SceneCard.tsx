import { Card } from '@/components/ui/Card'
import { Scene } from '@/types'

interface SceneCardProps {
  scene: Scene
}

export function SceneCard({ scene }: SceneCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-[#FF6719] text-white text-xs font-bold px-2.5 py-1 rounded-md">
          Scene {scene.sceneNumber}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
            SETTING
          </p>
          <p className="text-sm text-[#0A0A0A] dark:text-white">{scene.setting}</p>
        </div>
        <div>
          <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
            ACTION
          </p>
          <p className="text-sm text-[#0A0A0A] dark:text-white">{scene.action}</p>
        </div>
        <div>
          <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
            DIALOGUE
          </p>
          <p className="text-sm text-[#0A0A0A] dark:text-white">{scene.dialogue}</p>
        </div>
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
  )
}
