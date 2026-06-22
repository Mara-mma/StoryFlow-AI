import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({
  label,
  options,
  placeholder = 'Select...',
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] dark:focus:border-[#FF6719] focus:outline-none text-[#0A0A0A] dark:text-white rounded-lg px-3 py-2.5 text-sm transition-colors appearance-none cursor-pointer ${className}`}
        {...props}
      >
        <option value="" className="text-[#999999] dark:text-[#666666]">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
