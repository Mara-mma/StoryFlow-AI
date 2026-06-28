import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] dark:focus:border-[#FF6719] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,103,25,0.15)] dark:focus:shadow-[0_0_0_3px_rgba(255,103,25,0.35)] text-[#0A0A0A] dark:text-white placeholder-[#999999] dark:placeholder-[#666666] rounded-lg px-3 py-2.5 text-sm transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] dark:focus:border-[#FF6719] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,103,25,0.15)] dark:focus:shadow-[0_0_0_3px_rgba(255,103,25,0.35)] text-[#0A0A0A] dark:text-white placeholder-[#999999] dark:placeholder-[#666666] rounded-lg px-3 py-2.5 text-sm transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  )
}
