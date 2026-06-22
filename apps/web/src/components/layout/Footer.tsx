'use client'

export function Footer() {
  return (
    <footer className="border-t border-white/7 py-[38px] px-10">
      <div className="max-w-[1160px] mx-auto flex items-center justify-between">
        <div className="font-extrabold text-[17px] tracking-tight">
          StoryFlow <span className="text-[#FF6719]">AI</span>
        </div>
        <div className="flex gap-[22px]">
          <a href="#" className="text-[#6B6762] hover:text-[#A8A49E] text-[13px] no-underline transition-colors">Privacy</a>
          <a href="#" className="text-[#6B6762] hover:text-[#A8A49E] text-[13px] no-underline transition-colors">Terms</a>
          <a href="#" className="text-[#6B6762] hover:text-[#A8A49E] text-[13px] no-underline transition-colors">Blog</a>
          <a href="#" className="text-[#6B6762] hover:text-[#A8A49E] text-[13px] no-underline transition-colors">Changelog</a>
          <a href="#" className="text-[#6B6762] hover:text-[#A8A49E] text-[13px] no-underline transition-colors">Support</a>
        </div>
        <div className="text-[13px] text-[#6B6762]">&copy; 2025 StoryFlow AI</div>
      </div>
    </footer>
  )
}
