import Link from 'next/link'

export function GuestBanner() {
  return (
    <div className="bg-[#FF6719]/10 border border-[#FF6719]/30 rounded-xl p-4 flex items-center justify-between">
      <p className="text-sm text-[#0A0A0A] dark:text-white">
        Create a free account to save your story and access it anywhere.
      </p>
      <Link
        href="/auth"
        className="bg-[#FF6719] hover:bg-[#E5580E] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Save & Sign Up
      </Link>
    </div>
  )
}
