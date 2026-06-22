# StoryFlow AI – Antigravity Agent Context Files

This folder contains all the context files needed to build **StoryFlow AI** using the AI Agent in Antigravity IDE.

---

## File Structure

```
storyflow-ai-context/
├── Agent.md                      ← Start here. Primary agent context.
├── skills/
│   ├── database.md               ← Prisma schema & PostgreSQL models
│   ├── ai-prompt.md              ← DeepSeek API prompt engineering
│   ├── auth.md                   ← JWT + bcrypt authentication
│   ├── story-generation.md       ← Generation flow, inputs & output structure
│   ├── design-system.md          ← Brand colors, Tailwind tokens, all UI components
│   └── frontend-structure.md     ← Next.js file layout, auth context, types, hooks
└── rules/
    ├── coding-standards.md       ← TypeScript, naming, file conventions
    ├── ui-patterns.md            ← Layout, page structure, UX flow rules
    ├── api-conventions.md        ← REST design, endpoints, API client
    └── error-handling.md         ← Backend + frontend error handling, AI failure states
```

---

## How to Use in Antigravity

1. Load `Agent.md` as the primary agent context file
2. Add all files in `skills/` as skill context files
3. Add all files in `rules/` as rule context files
4. The agent will use these to guide all code generation decisions

---

## What Each File Does

| File | Purpose |
|---|---|
| `Agent.md` | Defines what the product is, the tech stack, project structure, core features, user flows, and references all other files |
| `skills/database.md` | Full Prisma schema with all models (User, Story, Character, Scene), relationships, migrations, and PrismaService setup |
| `skills/ai-prompt.md` | DeepSeek API integration, system prompt, prompt builder, output parsing, and genre-specific story structures |
| `skills/auth.md` | JWT auth implementation — signup, login, guards, DTOs, strategy, and frontend token handling |
| `skills/story-generation.md` | 3-step generation flow, all input options (genres, cultural settings, conflicts), blueprint preview, output structure, guest localStorage logic, and API endpoints |
| `skills/design-system.md` | Writesonic-inspired design system — brand orange `#FF6719`, full dark color palette, Tailwind config, typography scale, and every UI component pattern |
| `skills/frontend-structure.md` | Full Next.js App Router file structure, root layout, auth context, protected route layout, shared TypeScript types, generation hook, guest storage hook, component rules, and Navbar |
| `rules/coding-standards.md` | TypeScript rules, naming conventions, NestJS patterns, error handling, environment variables, and Git conventions |
| `rules/ui-patterns.md` | Page inventory, page-by-page layout structures, step flow state, environment selector rule, auth state, route protection, loading states, guest banner, responsive breakpoints, and UI copy rules |
| `rules/api-conventions.md` | REST design rules, full API reference table, request/response format, status codes, validation setup, and the centralised frontend API client |
| `rules/error-handling.md` | Global exception filter, DeepSeek error handling, AI response parsing errors, database errors, frontend API error class, generation error states, auth errors, library errors, timeout strategy, and logging |
