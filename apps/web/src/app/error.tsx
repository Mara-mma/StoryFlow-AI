'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-[#DC2626] text-2xl">!</span>
        </div>
        <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-[#555555] dark:text-[#A0A0A0] mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={reset}
          className="bg-[#FF6719] hover:bg-[#E5580E] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
