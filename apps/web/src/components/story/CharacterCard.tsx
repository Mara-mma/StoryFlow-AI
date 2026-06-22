import { Card } from '@/components/ui/Card'
import { Character } from '@/types'

interface CharacterCardProps {
  character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card className="mb-6">
      <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
        Character
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(character).map(([key, val]) => (
          <div key={key}>
            <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-sm text-[#0A0A0A] dark:text-white font-medium">
              {val}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
