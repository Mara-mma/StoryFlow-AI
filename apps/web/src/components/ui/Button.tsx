import { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 text-sm disabled:opacity-50 disabled:cursor-not-allowed'

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-[#FF6719] hover:bg-[#E5580E] text-white',
    secondary:
      'border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF6719] dark:hover:border-[#FF6719] text-[#555555] dark:text-[#A0A0A0] hover:text-[#FF6719] dark:hover:text-[#FF6719] bg-transparent',
    destructive:
      'border border-[#DC2626]/30 hover:bg-[#DC2626]/10 text-[#DC2626]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
