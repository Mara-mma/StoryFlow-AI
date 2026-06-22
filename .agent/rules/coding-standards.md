# Rule: Coding Standards

## Applies To: All Code in StoryFlow AI

---

## General

- Use **TypeScript** everywhere — both frontend (Next.js) and backend (NestJS)
- Never use `any` type unless absolutely unavoidable — use `unknown` and narrow
- Always use `async/await` over `.then()` chains
- Prefer named exports over default exports (except for Next.js pages and layouts)
- Use `const` by default; only use `let` when reassignment is needed. Never use `var`

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Variables & functions | camelCase | `storyTitle`, `generateStory()` |
| Classes & interfaces | PascalCase | `StoryService`, `GeneratedStory` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_SCENE_COUNT` |
| Files (Next.js) | kebab-case | `story-card.tsx` |
| Files (NestJS) | kebab-case | `story.service.ts` |
| Database columns | snake_case | `scene_number`, `created_at` |
| API routes | kebab-case | `/stories/generate` |

---

## TypeScript

- Always define interfaces for all data shapes
- Place shared types in a `types/` directory
- API response types should be shared or mirrored between frontend and backend
- Use `Partial<T>` and `Pick<T>` rather than redefining subsets of types

```typescript
// Good
interface StoryInput {
  genre: string;
  sceneCount: number;
  platform: 'tiktok' | 'facebook' | 'youtube_shorts';
}

// Bad
const input: any = { genre: 'Comedy' };
```

---

## Next.js Frontend

- Use **App Router** only — never the Pages Router
- All pages are Server Components by default
- Add `'use client'` only when the component uses hooks, browser APIs, or event handlers
- Use `fetch` with `cache` and `revalidate` options appropriately
- Keep API calls in `lib/api.ts` — never call APIs directly from components
- Use `loading.tsx` and `error.tsx` for async routes

---

## NestJS Backend

- Each feature gets its own NestJS **module**: `auth`, `stories`, `characters`, `scenes`, `ai`
- Use **DTOs** with `class-validator` for all incoming request bodies
- Apply **Guards** to all protected endpoints
- Never put business logic in controllers — all logic goes in services
- Use `PrismaService` injected into services — never import Prisma directly in controllers

```typescript
// Good
@Post('generate')
async generate(@Body() dto: GenerateStoryDto) {
  return this.storiesService.generate(dto);
}

// Bad — logic in controller
@Post('generate')
async generate(@Body() dto: GenerateStoryDto) {
  const prompt = buildPrompt(dto); // ❌ business logic here
  return this.deepseek.call(prompt);
}
```

---

## Error Handling

- Always wrap external API calls (DeepSeek) in `try/catch`
- Throw NestJS `HttpException` subclasses from services
- Return meaningful error messages — never expose raw stack traces
- On the frontend, handle API errors in `lib/api.ts` and surface them via UI state

```typescript
try {
  const story = await this.deepSeekService.generateStory(payload);
  return story;
} catch (err) {
  throw new InternalServerErrorException('Story generation failed. Please try again.');
}
```

---

## Environment Variables

- Store all secrets in `.env`
- Never commit `.env` files — always include `.env.example` with placeholder values
- Validate environment variables at startup using `@nestjs/config`

```env
# .env.example
DATABASE_URL=postgresql://user:password@localhost:5432/storyflow
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
DEEPSEEK_API_KEY=your_key_here
BCRYPT_ROUNDS=10
```

---

## Git Conventions

- Branch naming: `feature/`, `fix/`, `chore/`
- Commit messages: imperative mood — `Add story generation endpoint`, not `Added` or `Adding`
- Never commit directly to `main`

---

## Folder Hygiene

- Delete unused files immediately
- Don't leave commented-out code blocks in production files
- Co-locate component styles with the component file (use Tailwind — no separate CSS files)
