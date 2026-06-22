'use client'

import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF6719] transition-colors text-[#666666] dark:text-[#A0A0A0] hover:text-[#FF6719]"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
