# Skill: Frontend Structure – Next.js App Router

## Stack: Next.js (App Router) + Tailwind CSS + TypeScript

---

## Overview

This file defines how the Next.js frontend is structured — file layout, routing, auth state management, context providers, and how components are organised. The agent must follow this structure exactly when scaffolding the frontend.

---

## Full Frontend File Structure

```
apps/web/
├── app/
│   ├── layout.tsx                  # Root layout — wraps all pages
│   ├── page.tsx                    # Landing page (/)
│   ├── (auth)/                     # Auth route group — no dashboard nav
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/                # Protected route group
│   │   ├── layout.tsx              # Auth guard — redirects if not logged in
│   │   ├── library/
│   │   │   └── page.tsx            # Story library
│   │   └── story/
│   │       └── [id]/
│   │           └── page.tsx        # Single story view
│   └── generate/
│       └── page.tsx                # Story generation (guest + auth)
│
├── components/
│   ├── ui/                         # Generic reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── StepIndicator.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── story/                      # Story-specific components
│   │   ├── StoryCard.tsx           # Card used in library grid
│   │   ├── StoryHeader.tsx         # Title + moral banner
│   │   ├── CharacterCard.tsx       # Character profile display
│   │   ├── BlueprintCard.tsx       # Blueprint preview/summary
│   │   ├── SceneCard.tsx           # Individual scene display
│   │   └── SceneList.tsx           # Renders all scene cards
│   └── generate/                   # Generation flow components
│       ├── ModeToggle.tsx          # Beginner / Advanced toggle
│       ├── InputForm.tsx           # Step 1 — all dropdowns
│       ├── EnvironmentSelect.tsx   # Dynamic environment dropdown
│       ├── BlueprintPreview.tsx    # Step 2 — blueprint card + actions
│       ├── GenerationLoader.tsx    # Loading skeletons during generation
│       ├── StoryOutput.tsx         # Step 3 — full story display
│       └── GuestBanner.tsx         # Banner prompting guest to sign up
│
├── context/
│   ├── AuthContext.tsx             # Global auth state
│   └── ThemeContext.tsx            # Dark/light theme toggle state
│
├── hooks/
│   ├── useAuth.ts                  # Access auth context
│   ├── useStoryGeneration.ts       # Generation flow logic
│   └── useGuestStories.ts          # localStorage guest story management
│
├── lib/
│   ├── api.ts                      # All API calls + ApiError class
│   ├── guestStorage.ts             # localStorage helpers for guest stories
│   └── utils.ts                    # General helpers (formatDate, etc.)
│
├── types/
│   └── index.ts                    # All shared TypeScript interfaces
│
├── public/
│   └── favicon.ico
│
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Root Layout (`app/layout.tsx`)

```tsx
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { Navbar } from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#F7F7F8] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-white antialiased transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## Auth Context (`context/AuthContext.tsx`)

```tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const login = (token: string, user: User) => {
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!token,
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

---

## Protected Route Layout (`app/(dashboard)/layout.tsx`)

```tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  return <>{children}</>
}
```

---

## Shared TypeScript Types (`types/index.ts`)

```typescript
export interface User {
  id: string
  name: string
  email: string
}

export interface StoryInput {
  genre: string
  characterType: string
  culturalSetting: string
  conflict: string
  tone: string
  sceneCount: number
  storyIdea?: string
  additionalInstructions?: string
}

export interface Character {
  name: string
  appearance: string
  personality: string
  motivation: string
  role: string
  culturalContext: string
}

export interface Blueprint {
  setting: string
  conflict: string
  goal: string
  lesson: string
}

export interface Scene {
  sceneNumber: number
  setting: string
  action: string
  dialogue: string
  voiceover: string
}

export interface GeneratedStory {
  id?: string
  title: string
  moral: string
  character: Character
  blueprint: Blueprint
  scenes: Scene[]
  genre?: string
  platform?: string
  createdAt?: string
}

export type GenerationStep = 1 | 2 | 3

export type AppMode = 'beginner' | 'advanced'
```

---

## Story Generation Hook (`hooks/useStoryGeneration.ts`)

```typescript
'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { StoryInput, GeneratedStory, GenerationStep, AppMode } from '@/types'

export function useStoryGeneration() {
  const [step, setStep] = useState<GenerationStep>(1)
  const [mode, setMode] = useState<AppMode>('beginner')
  const [inputs, setInputs] = useState<Partial<StoryInput>>({})
  const [story, setStory] = useState<GeneratedStory | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewBlueprint = () => {
    // Validate required inputs before proceeding
    const required = ['genre', 'characterType', 'culturalSetting', 'environment', 'conflict', 'tone', 'platform', 'sceneCount']
    const missing = required.filter(k => !inputs[k as keyof StoryInput])
    if (missing.length > 0) {
      setError('Please fill in all required fields.')
      return
    }
    setError(null)
    setStep(2)
  }

  const generateStory = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await api.generateStory(inputs as StoryInput)
      setStory(result.data)
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const reset = () => {
    setStep(1)
    setInputs({})
    setStory(null)
    setError(null)
    setIsGenerating(false)
  }

  return {
    step, mode, inputs, story, isGenerating, error,
    setMode, setInputs, previewBlueprint, generateStory, reset,
  }
}
```

---

## Guest Storage Hook (`hooks/useGuestStories.ts`)

```typescript
import { GeneratedStory } from '@/types'

const KEY = 'storyflow_guest_stories'

export function useGuestStories() {
  const getAll = (): GeneratedStory[] => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  }

  const save = (story: GeneratedStory) => {
    const all = getAll()
    const updated = [
      { ...story, id: crypto.randomUUID(), savedAt: new Date().toISOString() },
      ...all,
    ]
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  const remove = (id: string) => {
    const updated = getAll().filter((s: any) => s.id !== id)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  return { getAll, save, remove }
}
```

---

## Component Rules

- All components in `components/ui/` must be **generic and reusable** — no story-specific logic
- All components in `components/story/` receive data as **props** — no API calls inside them
- All components in `components/generate/` can use hooks but **no direct fetch calls** — go through `lib/api.ts`
- Every component file that uses hooks, events, or browser APIs must have `'use client'` at the top
- Server Components (no `'use client'`) are used only for static layouts and pages that don't need interactivity

---

## Navbar Component (`components/layout/Navbar.tsx`)

```tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-[#FF6719] font-bold text-xl">StoryFlow</span>
          <span className="text-white font-bold text-xl">AI</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/library" className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                My Stories
              </Link>
              <button
                onClick={logout}
                className="text-sm text-[#666666] hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-[#A0A0A0] hover:text-white transition-colors">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-[#FF6719] hover:bg-[#E5580E] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up Free
              </Link>
            </>
          )}
          <Link
            href="/generate"
            className="border border-[#FF6719] text-[#FF6719] hover:bg-[#FF6719] hover:text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Create Story
          </Link>
        </div>
      </div>
    </nav>
  )
}
```
