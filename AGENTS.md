# StoryFlow AI – Agent Context

## What You Are Building

You are building **StoryFlow AI**, an AI-powered storytelling platform that helps short-form content creators generate structured, scene-by-scene stories for TikTok, Facebook, and YouTube Shorts.

The platform acts as an **AI Story Director** — users select story preferences through a guided UI and the AI generates a complete, production-ready story package.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS |
| Backend | NestJS |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| AI Layer | DeepSeek API |
| Version Control | Git + GitHub |

Always use the App Router pattern in Next.js. Never use the Pages Router.

---

## Project Structure

```
storyflow-ai/
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/       # Login, Signup pages
│   │   │   ├── (dashboard)/  # Story library, account
│   │   │   ├── generate/     # Story generation flow
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI components
│   │   │   ├── story/        # Story-specific components
│   │   │   └── forms/        # Input/selection forms
│   │   └── lib/
│   │       ├── api.ts        # API client
│   │       └── utils.ts
│   └── api/                  # NestJS backend
│       ├── src/
│       │   ├── auth/         # Auth module
│       │   ├── stories/      # Stories module
│       │   ├── characters/   # Characters module
│       │   ├── scenes/       # Scenes module
│       │   ├── ai/           # DeepSeek AI module
│       │   └── main.ts
│       └── prisma/
│           └── schema.prisma
```

---

## Core Features to Build

### 1. Hybrid Input System
- **Beginner Mode** – Guided dropdowns/selectors only
- **Advanced Mode** – Adds free-text fields for Story Idea and Additional Instructions

### 2. Story Generation Flow
Step 1 → Select Inputs → Step 2 → Blueprint Preview → Step 3 → Generate Story

### 3. Generated Output
Each story must include:
- Story Title
- Character Profile (name, appearance, personality, motivation, role)
- Story Blueprint (setting, conflict, goal, lesson)
- Scene-by-Scene breakdown (setting, action, dialogue, narration, camera direction)
- Moral/Lesson

### 4. Guest Mode
- No account required
- Stories saved to `localStorage`
- Prompt to register to save permanently

### 5. Authentication
- Sign Up / Login
- JWT-based sessions
- Stories auto-saved to database for registered users

### 6. Story Library
- View, search, open, delete saved stories
- Available to registered users only

---

## User Flows

### Guest User
```
Visit → Select Inputs → Review Blueprint → Generate → Story saved locally
```

### Registered User
```
Login → Select Inputs → Review Blueprint → Generate → Auto-saved → Access Library
```

---

## AI Prompt Architecture

The backend constructs structured prompts. Users never see the raw prompt.

Prompt payload shape:
```json
{
  "genre": "",
  "character_type": "",
  "cultural_setting": "",
  "environment": "",
  "conflict": "",
  "tone": "",
  "platform": "",
  "scene_count": "",
  "story_idea": "",
  "additional_instructions": ""
}
```

The AI must always:
- Match the requested scene count exactly
- Maintain character consistency across all scenes
- Use culturally appropriate names and locations
- Adjust pacing based on the target platform
- Include dialogue, narration, and camera direction in every scene

---

## Data Models

See `skills/database.md` for the full Prisma schema.

---

## Key Constraints

- No video generation
- No image generation
- No social media publishing
- English only for MVP
- Output must be usable without major edits 70%+ of the time
- Story generation target: under 10 seconds

---

## References

- `skills/database.md` – Prisma schema and data models
- `skills/ai-prompt.md` – DeepSeek prompt engineering guide
- `skills/auth.md` – JWT authentication implementation
- `skills/story-generation.md` – Story generation flow and output structure
- `skills/design-system.md` – Brand colors, Tailwind tokens, and all component patterns (Writesonic-inspired)
- `skills/frontend-structure.md` – Next.js file structure, auth context, shared types, hooks, component rules
- `rules/coding-standards.md` – Code style and conventions
- `rules/ui-patterns.md` – UI/UX layout rules and page structure
- `rules/api-conventions.md` – REST API design rules
- `rules/error-handling.md` – Backend and frontend error handling, timeouts, AI failure states
