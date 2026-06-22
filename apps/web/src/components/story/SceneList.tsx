import { Scene } from '@/types'
import { SceneCard } from './SceneCard'

interface SceneListProps {
  scenes: Scene[]
}

export function SceneList({ scenes }: SceneListProps) {
  return (
    <div className="space-y-4">
      {scenes.map((scene) => (
        <SceneCard key={scene.sceneNumber} scene={scene} />
      ))}
    </div>
  )
}
