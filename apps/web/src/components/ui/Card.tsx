import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
}

export function Card({
  elevated = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const base = 'rounded-xl p-6 transition-colors duration-200'

  const styles = elevated
    ? 'bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#FF6719]/30 ring-1 ring-[#FF6719]/20'
    : 'bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A]'

  return (
    <div className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </div>
  )
}
