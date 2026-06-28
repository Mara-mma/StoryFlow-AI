# Rule: UI/UX Layout & Page Structure

## Applies To: Next.js Frontend

---

## Critical Rule

**All colors, typography, component styles, spacing tokens, and Tailwind classes are defined in `skills/design-system.md`.**

Do NOT invent colors or component styles here. Always reference and follow `skills/design-system.md` for every visual decision. The design system is the single source of truth.

---

## Design Principles

- **Speed first** – The UI should feel instant. Use skeleton loaders during generation. Never show a blank state.
- **Minimal friction** – Fewest possible clicks to generate a story. No unnecessary modals or confirmation screens.
- **Desktop primary** – Optimise for `lg:` (1024px+). Must not break on tablet (`md:`) or mobile.
- **Creator-focused** – UI copy should feel energetic and creative, not corporate or technical.
- **One accent color** – Brand orange `#FF6719` only. Never introduce a second accent color.

---

## Page Inventory

Every page the agent must build:

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing / Home | No |
| `/generate` | Story Generation (3-step flow) | No (guest allowed) |
| `/library` | Story Library | Yes — redirect to `/login` if not authed |
| `/story/[id]` | Single Story View | Yes |
| `/login` | Login | No |
| `/signup` | Sign Up | No |

---

## Page Layout Shell

Every page uses this wrapper:

```tsx
// app/layout.tsx
<html lang="en">
  <body className="bg-[#0A0A0A] text-white font-sans antialiased">
    <Navbar />
    <main>{children}</main>
  </body>
</html>
```

Page content wrapper (used inside each page):
```tsx
<div className="max-w-5xl mx-auto px-4 py-10">
  {/* page content */}
</div>
```

---

## Page Structures

### `/` – Landing Page

```
Navbar
├── Hero Section
│   ├── Headline: "Generate Captivating Stories for Any Platform"
│   ├── Subheadline: one-line value prop
│   ├── [Create a Story] CTA → /generate
│   └── [Sign Up Free] CTA → /signup
├── How It Works (3 steps: Select → Preview → Generate)
└── Footer
```

### `/generate` – Story Generation (Core Page)

```
Navbar
├── Step Indicator (Step 1 → 2 → 3)
│
├── STEP 1: Input Form
│   ├── Mode Toggle: [Beginner] [Advanced]
│   ├── Input Grid (2–3 cols on desktop, 1 col mobile)
│   │   ├── Story Category (select)
│   │   ├── Character Type (select)
│   │   ├── Cultural Setting (select)
│   │   ├── Conflict Type (select)
│   │   ├── Tone (select)
│   │   └── Story Duration (hybrid component)
│   │       ├── Quick-select buttons: 30s / 1 min / 2 mins / 3 mins
│   │       └── Custom input: number field (min 3, max 20) with auto duration label
│   ├── [Advanced only] Story Idea (textarea)
│   ├── [Advanced only] Additional Instructions (textarea)
│   └── [Preview Blueprint →] button
│
├── STEP 2: Blueprint Preview
│   ├── Blueprint Card showing Duration label (not raw scene count)
│   ├── [← Edit Inputs] button
│   └── [Generate Story →] button
│
└── STEP 3: Story Output
    ├── Story Title
    ├── Estimated Duration badge (e.g. "Estimated duration: 1 minute")
    ├── Moral banner
    ├── View Toggle: [Structured] [Script]
    │
    ├── STRUCTURED VIEW (default)
    │   ├── Character card
    │   ├── Blueprint card
    │   └── Scene cards (SETTING, ACTION, DIALOGUE, VOICEOVER per scene)
    │
    └── SCRIPT VIEW
        ├── Character intro paragraph (flowing prose)
        ├── Scene blocks (Scene 1, Scene 2... in orange heading)
        │   └── Setting → Action → Dialogue (screenplay format) → Narrator: voiceover (italics)
        ├── Moral: (italics, end of script)
        └── [Copy Script] button → copies full text, shows toast "Script copied to clipboard"
```

### `/library` – Story Library (Auth Protected)

```
Navbar
├── Page Title: "My Stories"
├── Search Input (filters by title)
├── Story Grid (2 cols md, 3 cols lg)
│   └── Story Card per story:
│       ├── Title
│       ├── Genre badge
│       ├── Scene count + Date created
│       └── [Open] [Delete] buttons
└── Empty State (if no stories saved)
```

### `/story/[id]` – Single Story View

```
Navbar
├── Back link → /library
├── Story Header (title + moral)
├── Character Card
├── Blueprint Summary
└── Scene Cards (all scenes in order)
```

### `/login` and `/signup`

```
Centered card layout (max-w-md mx-auto)
├── Logo / Brand name
├── Form fields
├── Submit button
└── Link to the other auth page
```

---

## Step Flow State Management

Manage the 3-step generation flow with local React state:

```tsx
type Step = 1 | 2 | 3

const [currentStep, setCurrentStep] = useState<Step>(1)
const [inputs, setInputs] = useState<StoryInput>({})
const [blueprint, setBlueprint] = useState<StoryBlueprint | null>(null)
const [story, setStory] = useState<GeneratedStory | null>(null)
const [isGenerating, setIsGenerating] = useState(false)
```

State transitions:
- Step 1 → 2: User clicks "Preview Blueprint" — calls `/api/stories/blueprint` (or derives from inputs)
- Step 2 → 1: User clicks "Edit Inputs" — keeps `inputs` state, clears `blueprint`
- Step 2 → 3: User clicks "Generate Story" — calls `/api/stories/generate`, sets `story`
- Step 3 → 1: User clicks "Generate Another" — resets all state

---

## Auth State (Frontend)

Use React Context for auth state across the app:

```tsx
// context/AuthContext.tsx
interface AuthContext {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}
```

- Store token in memory (not localStorage) during the session
- On app load, check for token — if absent, user is guest
- Navbar shows [Login] [Sign Up] for guests, [My Stories] [Logout] for authenticated users

---

## Route Protection

Protect `/library` and `/story/[id]` using a middleware or layout check:

```tsx
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const token = getTokenFromSession() // server-side check
  if (!token) redirect('/login')
  return <>{children}</>
}
```

---

## Generation Loading State

During story generation (Step 2 → 3), show a full loading experience — never a blank screen:

```tsx
{isGenerating && (
  <div className="space-y-6">
    <p className="text-[#A0A0A0] text-sm animate-pulse">
      Writing your story...
    </p>
    {/* Skeleton cards for each expected scene */}
    {Array.from({ length: inputs.sceneCount }).map((_, i) => (
      <div key={i} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-6">
        <LoadingSkeleton />
      </div>
    ))}
  </div>
)}
```

---

## Guest Prompt Banner

After a guest generates a story, show a non-blocking banner above the Save button:

```tsx
{!isAuthenticated && (
  <div className="bg-[#FF6719]/10 border border-[#FF6719]/30 rounded-xl p-4 flex items-center justify-between">
    <p className="text-sm text-white">
      Create a free account to save your story and access it anywhere.
    </p>
    <a href="/signup" className="bg-[#FF6719] text-white text-sm font-semibold px-4 py-2 rounded-lg">
      Save & Sign Up
    </a>
  </div>
)}
```

---

## Responsive Breakpoints

| Breakpoint | Layout Behaviour |
|---|---|
| Default (mobile, <768px) | Single column, full width inputs |
| `md:` (768px) | 2-column input grid, 2-column story library |
| `lg:` (1024px+) | 3-column input grid, 3-column story library — primary target |

---

## Copy / UI Language Rules

- Buttons: action-first — "Generate Story", "Save Story", "Edit Inputs", not "Submit" or "OK"
- Empty states: always explain what to do next — never just "No data found"
- Loading: use active language — "Writing your story...", "Building your blueprint..."
- Errors: plain English — "Generation failed. Please try again." — never show raw error messages
