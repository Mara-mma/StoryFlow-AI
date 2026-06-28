'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { api } from '@/lib/api'

interface StorySummary {
  id: string
  title: string
  createdAt: string
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false)
  const [stories, setStories] = useState<StorySummary[]>([])
  const [loading, setLoading] = useState(false)
  const { logout, token, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    if (!token) return
    setLoading(true)
    api.getStories(token)
      .then((res) => setStories(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const links = [
    {
      href: '/library',
      label: 'My Stories',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      href: '/generate',
      label: 'Create Story',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-white dark:bg-[#0C0C0C] border-r border-[#E5E5E5] dark:border-[#1A1A1A] flex flex-col transition-transform duration-200 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-[62px] border-b border-[#E5E5E5] dark:border-[#1A1A1A] shrink-0">
          <Link href="/" className="font-extrabold text-[17px] tracking-tight text-[#0A0A0A] dark:text-white no-underline">
            StoryFlow <span className="text-[#FF6719]">AI</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-[#666666] dark:text-[#A0A0A0] hover:text-[#0A0A0A] dark:hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="px-3 py-3 shrink-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                isActive(link.href)
                  ? 'bg-[#FF6719]/10 text-[#FF6719]'
                  : 'text-[#666666] dark:text-[#A0A0A0] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] hover:text-[#0A0A0A] dark:hover:text-white'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {isAuthenticated && (
          <div className="flex-1 overflow-y-auto min-h-0 px-3">
            <div className="flex items-center justify-between px-3 mb-1">
              <p className="text-[11px] font-semibold text-[#999999] dark:text-[#666666] uppercase tracking-widest">
                History
              </p>
            </div>
            {loading ? (
              <div className="space-y-2 px-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded animate-pulse" />
                ))}
              </div>
            ) : stories.length === 0 ? (
              <p className="text-xs text-[#999999] dark:text-[#666666] px-3">
                No stories yet
              </p>
            ) : (
              <div className="space-y-0.5">
                {stories.slice(0, 20).map((s) => (
                  <Link
                    key={s.id}
                    href={`/story/${s.id}`}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-1.5 rounded-lg text-sm truncate no-underline transition-colors ${
                      pathname === `/story/${s.id}`
                        ? 'bg-[#FF6719]/10 text-[#FF6719]'
                        : 'text-[#666666] dark:text-[#A0A0A0] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] hover:text-[#0A0A0A] dark:hover:text-white'
                    }`}
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="px-3 py-3 border-t border-[#E5E5E5] dark:border-[#1A1A1A] space-y-1 shrink-0">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#666666] dark:text-[#A0A0A0] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] hover:text-[#0A0A0A] dark:hover:text-white transition-colors"
          >
            <span className="w-[18px] h-[18px] flex items-center justify-center">
              {theme === 'dark' ? '☀' : '☾'}
            </span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#666666] dark:text-[#A0A0A0] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] hover:text-[#0A0A0A] dark:hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="fixed top-3.5 left-4 z-30 md:hidden p-2 rounded-lg text-[#666666] dark:text-[#A0A0A0] hover:bg-[#F5F5F5] dark:hover:bg-[#1A1A1A] transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12h18" />
          <path d="M3 6h18" />
          <path d="M3 18h18" />
        </svg>
      </button>
    </>
  )
}
