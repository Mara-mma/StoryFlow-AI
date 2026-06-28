import Link from 'next/link'

interface UpgradePromptProps {
  onClose: () => void
}

export function UpgradePrompt({ onClose }: UpgradePromptProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="w-12 h-12 bg-[#FF6719]/10 border border-[#FF6719]/20 rounded-xl flex items-center justify-center text-2xl mb-4">
          ⭐
        </div>
        <h3 className="text-lg font-bold text-[#0A0A0A] dark:text-white mb-2">
          Free limit reached
        </h3>
        <p className="text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed mb-6">
          You&apos;ve used all your free story generations. Upgrade to
          <span className="font-semibold text-[#0A0A0A] dark:text-white"> Creator </span>
          for unlimited stories, full production scripts, and more.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/pricing"
            className="bg-[#FF6719] hover:bg-[#FF7A2E] text-white text-center font-bold px-5 py-3 rounded-xl text-sm transition-all no-underline"
          >
            Upgrade to Creator — $19/mo
          </Link>
          <button
            onClick={onClose}
            className="text-sm text-[#999999] dark:text-[#666666] hover:text-[#555555] dark:hover:text-[#A0A0A0] transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
