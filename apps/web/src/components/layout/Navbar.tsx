'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const isLanding = pathname === '/'

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0C0C0C]/90 border-b border-white/7 transition-colors duration-200">
      <div className="max-w-[1160px] mx-auto px-10 h-[62px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-extrabold text-[17px] tracking-tight">
            StoryFlow <span className="text-[#FF6719]">AI</span>
          </span>
        </Link>

        {isLanding && !isAuthenticated && (
          <ul className="hidden md:flex items-center gap-8 list-none">
            <li><a href="#platforms" className="text-[#A8A49E] hover:text-white text-sm font-medium no-underline transition-colors">Platforms</a></li>
            <li><a href="#how-it-works" className="text-[#A8A49E] hover:text-white text-sm font-medium no-underline transition-colors">How it works</a></li>
            <li><a href="#features" className="text-[#A8A49E] hover:text-white text-sm font-medium no-underline transition-colors">Features</a></li>
            <li><a href="#pricing" className="text-[#A8A49E] hover:text-white text-sm font-medium no-underline transition-colors">Pricing</a></li>
          </ul>
        )}

        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              <Link
                href="/library"
                className="text-sm text-[#A8A49E] hover:text-white transition-colors font-medium no-underline"
              >
                My Stories
              </Link>
              <button
                onClick={logout}
                className="text-sm text-[#A8A49E] hover:text-white transition-colors font-medium"
              >
                Logout
              </button>
              <Link
                href="/generate"
                className="bg-[#FF6719] hover:bg-[#FF7A2E] text-white text-sm font-bold px-[18px] py-2 rounded-lg transition-all no-underline"
              >
                Create Story
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm text-[#A8A49E] hover:text-white transition-colors font-medium no-underline"
              >
                Login
              </Link>
              <Link
                href="/auth?tab=signup"
                className="bg-[#FF6719] hover:bg-[#FF7A2E] text-white text-sm font-bold px-[18px] py-2 rounded-lg transition-all no-underline"
              >
                Sign Up Free
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
