# Skill: Design System – StoryFlow AI

## Brand Inspiration: Writesonic.com (brand color only)
## Stack: Tailwind CSS + Next.js + CSS Variables

---

## Design Philosophy

StoryFlow AI uses a **dual-theme design system** — dark and light — both built around the same brand orange `#FF6719` accent color borrowed from Writesonic.

- **Dark theme** (default): near-black backgrounds, white text, subtle dark borders
- **Light theme**: white/light-grey backgrounds, dark text, subtle light borders
- **Brand orange `#FF6719`** is the single accent color in both themes — for buttons, highlights, active states, and focus rings
- Cards use subtle borders — no heavy shadows
- Typography is clean, confident, and consistent across both themes
- The UI should feel **fast, creative, and professional** in either theme

---

## Theme Toggle Implementation

### How It Works

Use Tailwind's `darkMode: 'class'` strategy. The `dark` class is toggled on the `<html>` element.

```typescript
// tailwind.config.ts
const config: Config = {
  darkMode: 'class', // ← enables class-based dark mode
  ...
}
```

When the user toggles the theme:
- Add `class="dark"` to `<html>` → dark theme activates
- Remove `class="dark"` from `<html>` → light theme activates
- Save preference to `localStorage` key: `storyflow_theme`

### Theme Context (`context/ThemeContext.tsx`)

```tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('storyflow_theme') as Theme | null
    const preferred = saved || 'dark'
    setTheme(preferred)
    document.documentElement.classList.toggle('dark', preferred === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('storyflow_theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

### Add ThemeProvider to Root Layout

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark"> {/* default dark */}
      <body className="bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-white font-sans antialiased transition-colors duration-200">
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

### Theme Toggle Button Component

```tsx
'use client'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF6719] transition-colors text-[#666666] dark:text-[#A0A0A0] hover:text-[#FF6719]"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  )
}
```

Place `<ThemeToggle />` inside the Navbar, beside the auth buttons.

---

## Brand Colors (Same in Both Themes)

| Role | Hex | Usage |
|---|---|---|
| **Brand Orange** | `#FF6719` | Primary buttons, active states, focus rings, highlights |
| **Brand Orange Hover** | `#E5580E` | Button hover state |
| **Brand Orange Tint** | `#FF6719` at 10% opacity | Backgrounds behind orange text/icons |

These never change between themes. Always use:
```
bg-[#FF6719]          → orange background
hover:bg-[#E5580E]    → orange hover
bg-[#FF6719]/10       → orange tint background
text-[#FF6719]        → orange text
border-[#FF6719]      → orange border
ring-[#FF6719]/20     → orange glow ring
```

---

## Full Color Palette — Both Themes

All classes use Tailwind's `dark:` prefix pattern.

### Page Backgrounds

| Role | Light Class | Dark Class |
|---|---|---|
| Page background | `bg-[#F7F7F8]` | `dark:bg-[#0A0A0A]` |
| Surface / Card | `bg-white` | `dark:bg-[#111111]` |
| Elevated Card | `bg-[#F0F0F0]` | `dark:bg-[#1A1A1A]` |
| Input / Select | `bg-[#F7F7F8]` | `dark:bg-[#161616]` |
| Hover state | `bg-[#EFEFEF]` | `dark:bg-[#1F1F1F]` |

### Borders

| Role | Light Class | Dark Class |
|---|---|---|
| Default border | `border-[#E5E5E5]` | `dark:border-[#2A2A2A]` |
| Subtle border | `border-[#EBEBEB]` | `dark:border-[#222222]` |
| Focus border | `border-[#FF6719]` | `dark:border-[#FF6719]` |

### Text

| Role | Light Class | Dark Class |
|---|---|---|
| Primary text | `text-[#0A0A0A]` | `dark:text-white` |
| Secondary text | `text-[#555555]` | `dark:text-[#A0A0A0]` |
| Muted text | `text-[#999999]` | `dark:text-[#666666]` |
| Brand text | `text-[#FF6719]` | `dark:text-[#FF6719]` |
| Inverted (on orange bg) | `text-white` | `text-white` |

### Status Colors (Same in Both Themes)

| Role | Classes |
|---|---|
| Success | `text-[#16A34A]` / `bg-[#16A34A]/10` |
| Warning | `text-[#D97706]` / `bg-[#D97706]/10` |
| Error | `text-[#DC2626]` / `bg-[#DC2626]/10` |
| Info | `text-[#2563EB]` / `bg-[#2563EB]/10` |

---

## Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FF6719',
          hover: '#E5580E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Typography Scale

Text colors must always include both light and dark variants.

| Role | Classes |
|---|---|
| Display | `text-5xl font-bold tracking-tight text-[#0A0A0A] dark:text-white` |
| H1 | `text-4xl font-bold tracking-tight text-[#0A0A0A] dark:text-white` |
| H2 | `text-2xl font-semibold text-[#0A0A0A] dark:text-white` |
| H3 | `text-xl font-semibold text-[#0A0A0A] dark:text-white` |
| H4 | `text-base font-semibold text-[#0A0A0A] dark:text-white` |
| Body Large | `text-base text-[#555555] dark:text-[#A0A0A0] leading-relaxed` |
| Body | `text-sm text-[#555555] dark:text-[#A0A0A0] leading-relaxed` |
| Label | `text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest` |
| Caption | `text-xs text-[#999999] dark:text-[#666666]` |

**Font:** `Inter` via `next/font/google`

---

## Spacing System

Same in both themes — spacing never changes.

| Token | Value | Usage |
|---|---|---|
| `p-4` | 16px | Compact card padding |
| `p-5` | 20px | Standard card padding |
| `p-6` | 24px | Generous card padding |
| `gap-4` | 16px | Grid gaps |
| `gap-6` | 24px | Section gaps |
| `py-10` | 40px | Page vertical padding |
| `py-16` | 64px | Section vertical padding |
| `max-w-5xl` | 1024px | Content max width |
| `max-w-3xl` | 768px | Centered narrow content |

---

## Component Patterns (Dual Theme)

Every component must include both light and `dark:` classes.

### Primary Button
```tsx
<button className="bg-[#FF6719] hover:bg-[#E5580E] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 text-sm">
  Generate Story
</button>
```
*(Brand orange — same in both themes)*

### Secondary Button
```tsx
<button className="border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#FF6719] dark:hover:border-[#FF6719] text-[#555555] dark:text-[#A0A0A0] hover:text-[#FF6719] dark:hover:text-[#FF6719] font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 text-sm bg-transparent">
  Edit Inputs
</button>
```

### Destructive Button
```tsx
<button className="border border-[#DC2626]/30 hover:bg-[#DC2626]/10 text-[#DC2626] font-medium px-4 py-2 rounded-lg transition-colors duration-150 text-sm">
  Delete
</button>
```

### Card
```tsx
<div className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-xl p-6">
  {/* content */}
</div>
```

### Elevated / Active Card
```tsx
<div className="bg-[#F0F0F0] dark:bg-[#1A1A1A] border border-[#FF6719]/30 rounded-xl p-6 ring-1 ring-[#FF6719]/20">
  {/* active/selected card */}
</div>
```

### Input Field
```tsx
<input
  className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] dark:focus:border-[#FF6719] focus:outline-none text-[#0A0A0A] dark:text-white placeholder-[#999999] dark:placeholder-[#666666] rounded-lg px-3 py-2.5 text-sm transition-colors"
  placeholder="Enter your story idea..."
/>
```

### Select Dropdown
```tsx
<select className="w-full bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] focus:border-[#FF6719] dark:focus:border-[#FF6719] focus:outline-none text-[#0A0A0A] dark:text-white rounded-lg px-3 py-2.5 text-sm transition-colors appearance-none cursor-pointer">
  <option value="">Select genre...</option>
</select>
```

### Form Field (Label + Input)
```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-xs font-medium text-[#999999] dark:text-[#666666] uppercase tracking-widest">
    Story Category
  </label>
  {/* input or select here */}
</div>
```

### Badge / Tag
```tsx
{/* Brand badge */}
<span className="bg-[#FF6719]/10 text-[#FF6719] text-xs font-semibold px-2.5 py-1 rounded-full">
  TikTok
</span>

{/* Neutral badge */}
<span className="bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#555555] dark:text-[#A0A0A0] text-xs font-medium px-2.5 py-1 rounded-full border border-[#E5E5E5] dark:border-[#2A2A2A]">
  8 Scenes
</span>
```

### Scene Number Badge
```tsx
<span className="bg-[#FF6719] text-white text-xs font-bold px-2.5 py-1 rounded-md">
  Scene 1
</span>
```

### Divider
```tsx
<hr className="border-[#E5E5E5] dark:border-[#2A2A2A]" />
```

### Loading Skeleton
```tsx
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded w-3/4" />
  <div className="h-4 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded w-1/2" />
  <div className="h-4 bg-[#F0F0F0] dark:bg-[#1A1A1A] rounded w-5/6" />
</div>
```

---

## Step Indicator

```tsx
const steps = ['Select Inputs', 'Review Blueprint', 'Your Story']

<div className="flex items-center gap-3 mb-10">
  {steps.map((step, i) => (
    <div key={i} className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
        ${currentStep > i + 1
          ? 'bg-[#FF6719] text-white'
          : currentStep === i + 1
          ? 'bg-[#FF6719] text-white ring-4 ring-[#FF6719]/20'
          : 'bg-[#F0F0F0] dark:bg-[#1A1A1A] text-[#999999] dark:text-[#666666] border border-[#E5E5E5] dark:border-[#2A2A2A]'
        }`}>
        {currentStep > i + 1 ? '✓' : i + 1}
      </div>
      <span className={`text-sm font-medium ${
        currentStep === i + 1
          ? 'text-[#0A0A0A] dark:text-white'
          : 'text-[#999999] dark:text-[#666666]'
      }`}>
        {step}
      </span>
      {i < steps.length - 1 && (
        <div className={`w-10 h-px ml-1 ${
          currentStep > i + 1 ? 'bg-[#FF6719]' : 'bg-[#E5E5E5] dark:bg-[#2A2A2A]'
        }`} />
      )}
    </div>
  ))}
</div>
```

---

## Page Layout Shell

```tsx
<div className="min-h-screen bg-[#F7F7F8] dark:bg-[#0A0A0A] transition-colors duration-200">
  <nav className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] px-6 py-4">
    {/* nav content */}
  </nav>
  <main className="max-w-5xl mx-auto px-4 py-10">
    {/* page content */}
  </main>
</div>
```

---

## Navigation Bar

```tsx
<nav className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-200">
  <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-1">
      <span className="text-[#FF6719] font-bold text-xl">StoryFlow</span>
      <span className="text-[#0A0A0A] dark:text-white font-bold text-xl">AI</span>
    </div>

    {/* Nav actions */}
    <div className="flex items-center gap-3">
      <a href="/library" className="text-sm text-[#555555] dark:text-[#A0A0A0] hover:text-[#0A0A0A] dark:hover:text-white transition-colors">
        My Stories
      </a>
      <ThemeToggle />
      <a href="/generate" className="bg-[#FF6719] hover:bg-[#E5580E] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
        Create Story
      </a>
    </div>
  </div>
</nav>
```

---

## Blueprint Preview Card

```tsx
<div className="bg-white dark:bg-[#111111] border border-[#FF6719]/30 rounded-xl p-6 ring-1 ring-[#FF6719]/10">
  <div className="flex items-center gap-2 mb-5">
    <div className="w-2 h-2 rounded-full bg-[#FF6719]" />
    <h3 className="text-sm font-semibold text-[#FF6719] uppercase tracking-widest">Story Blueprint</h3>
  </div>
  <div className="grid grid-cols-2 gap-4">
    {[
      ['Main Character', 'Young Nigerian Boy'],
      ['Setting', 'Village Market'],
      ['Conflict', 'Lost Wallet'],
      ['Story Goal', 'Return the Wallet'],
      ['Lesson', 'Honesty Is Rewarded'],
      ['Platform', 'TikTok'],
      ['Scenes', '8'],
    ].map(([label, value]) => (
      <div key={label}>
        <p className="text-xs text-[#999999] dark:text-[#666666] uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm text-[#0A0A0A] dark:text-white font-medium">{value}</p>
      </div>
    ))}
  </div>
</div>
```

---

## Empty State

```tsx
<div className="text-center py-24">
  <div className="w-16 h-16 rounded-2xl bg-[#FF6719]/10 flex items-center justify-center mx-auto mb-4">
    <span className="text-[#FF6719] text-2xl">✦</span>
  </div>
  <h3 className="text-[#0A0A0A] dark:text-white font-semibold text-lg mb-2">No stories yet</h3>
  <p className="text-[#999999] dark:text-[#666666] text-sm mb-6">Generate your first story to get started.</p>
  <a href="/generate" className="bg-[#FF6719] hover:bg-[#E5580E] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
    Create a Story
  </a>
</div>
```

---

## Mode Toggle (Beginner / Advanced)

```tsx
<div className="flex items-center gap-1 bg-[#F7F7F8] dark:bg-[#161616] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-lg p-1 w-fit">
  {['Beginner', 'Advanced'].map((mode) => (
    <button
      key={mode}
      onClick={() => setActiveMode(mode)}
      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
        activeMode === mode
          ? 'bg-[#FF6719] text-white'
          : 'text-[#999999] dark:text-[#666666] hover:text-[#0A0A0A] dark:hover:text-white'
      }`}
    >
      {mode}
    </button>
  ))}
</div>
```

---

## Toast Notifications

```tsx
{/* Success */}
<div className="fixed bottom-5 right-5 bg-white dark:bg-[#111111] border border-[#16A34A]/30 text-[#0A0A0A] dark:text-white text-sm px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
  <span className="text-[#16A34A]">✓</span> Story saved successfully
</div>

{/* Error */}
<div className="fixed bottom-5 right-5 bg-white dark:bg-[#111111] border border-[#DC2626]/30 text-[#0A0A0A] dark:text-white text-sm px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
  <span className="text-[#DC2626]">✕</span> Generation failed. Try again.
</div>
```

---

## Guest Banner

```tsx
<div className="bg-[#FF6719]/10 border border-[#FF6719]/30 rounded-xl p-4 flex items-center justify-between">
  <p className="text-sm text-[#0A0A0A] dark:text-white">
    Create a free account to save your story and access it anywhere.
  </p>
  <a href="/signup" className="bg-[#FF6719] hover:bg-[#E5580E] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
    Save & Sign Up
  </a>
</div>
```

---

## Responsive Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Form fields */}
</div>
```

---

## Design Do's and Don'ts

### ✅ Do
- Always write BOTH light and `dark:` classes on every element
- Use `#FF6719` as the only accent color in both themes
- Add `transition-colors duration-200` to all themed elements for smooth toggle
- Use `bg-[#F7F7F8]` (not pure white) as the light page background
- Keep borders subtle — `#E5E5E5` in light, `#2A2A2A` in dark
- Place `<ThemeToggle />` in the Navbar so it's always accessible

### ❌ Don't
- Write a class without its `dark:` counterpart — the agent must always do both
- Use hardcoded `text-white` or `text-black` outside of brand orange buttons
- Use purple/violet — orange is the only accent
- Use heavy drop shadows — borders and rings handle depth
- Use `rounded-full` on buttons — always `rounded-lg`
- Forget `transition-colors duration-200` on themed elements — the toggle must feel smooth
