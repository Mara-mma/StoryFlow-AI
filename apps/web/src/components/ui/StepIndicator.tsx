import { GenerationStep } from '@/types'

const steps = ['Select Inputs', 'Review Blueprint', 'Your Story']

interface StepIndicatorProps {
  currentStep: GenerationStep
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3 mb-10">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentStep > i + 1
                ? 'bg-[#FF6719] text-white'
                : currentStep === i + 1
                  ? 'bg-[#FF6719] text-white ring-4 ring-[#FF6719]/20'
                  : 'bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#999999] dark:text-[#666666] border border-[#E5E5E5] dark:border-[#2A2A2A]'
            }`}
          >
            {currentStep > i + 1 ? '✓' : i + 1}
          </div>
          <span
            className={`text-sm font-medium ${
              currentStep === i + 1
                ? 'text-[#0A0A0A] dark:text-white'
                : 'text-[#999999] dark:text-[#666666]'
            }`}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`w-10 h-px ml-1 ${
                currentStep > i + 1
                  ? 'bg-[#FF6719]'
                  : 'bg-[#E5E5E5] dark:bg-[#2A2A2A]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
