import { HTMLAttributes } from 'react'

type BadgeVariant = 'brand' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({
  variant = 'neutral',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const styles = {
    brand:
      'bg-[#FF6719]/10 text-[#FF6719]',
    neutral:
      'bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#555555] dark:text-[#A0A0A0] border border-[#E5E5E5] dark:border-[#2A2A2A]',
  }

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
