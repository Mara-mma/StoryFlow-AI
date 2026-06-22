import { Card } from '@/components/ui/Card'
import { Blueprint } from '@/types'

interface BlueprintCardProps {
  blueprint: Blueprint
}

export function BlueprintCard({ blueprint }: BlueprintCardProps) {
  return (
    <Card className="mb-8">
      <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest mb-4">
        Blueprint
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(blueprint).map(([key, val]) => (
          <div key={key}>
            <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">
              {key}
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
