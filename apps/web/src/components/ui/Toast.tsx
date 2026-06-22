'use client'

import { useEffect, useState } from 'react'

type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  const icon = type === 'success' ? '✓' : '✕'
  const borderColor =
    type === 'success' ? 'border-[#16A34A]/30' : 'border-[#DC2626]/30'
  const iconColor = type === 'success' ? 'text-[#16A34A]' : 'text-[#DC2626]'

  return (
    <div
      className={`fixed bottom-5 right-5 bg-white dark:bg-[#111111] border ${borderColor} text-[#0A0A0A] dark:text-white text-sm px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg z-50`}
    >
      <span className={iconColor}>{icon}</span>
      {message}
    </div>
  )
}
