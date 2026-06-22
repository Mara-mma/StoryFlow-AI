'use client'

import { AppMode } from '@/types'

interface ModeToggleProps {
  mode: AppMode
  onModeChange: (mode: AppMode) => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg p-1 w-fit">
      {(['beginner', 'advanced'] as AppMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onModeChange(m)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
            mode === m
              ? 'bg-[#FF6719] text-white'
              : 'text-[#999999] dark:text-[#666666] hover:text-[#0A0A0A] dark:hover:text-white'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
