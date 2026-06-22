# Rule: Error Handling

## Applies To: NestJS Backend + Next.js Frontend

---

## Core Principle

**Never let an error silently fail or show a raw error to the user.**
Every error must be caught, logged, and surfaced as a clear, human-readable message.

---

## Backend Error Handling (NestJS)

### Global Exception Filter

Apply a global exception filter in `main.ts` to catch all unhandled errors:

```typescript
// main.ts
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

const app = await NestFactory.create(AppModule);
const { httpAdapter } = app.get(HttpAdapterHost);
app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
```

```typescript
// filters/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'An unexpected error occurred. Please try again.';

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
```

---

### DeepSeek API Errors

The most critical error surface in the app. Always wrap DeepSeek calls with full error handling:

```typescript
// ai/deepseek.service.ts
async generateStory(payload: StoryPromptPayload): Promise<GeneratedStory> {
  try {
    const response = await axios.post(this.apiUrl, { ... }, { timeout: 15000 });
    return this.parseResponse(response.data);
  } catch (err) {
    // Timeout
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw new GatewayTimeoutException(
        'Story generation timed out. Please try again.'
      );
    }
    // DeepSeek API error response
    if (err.response?.status === 429) {
      throw new ServiceUnavailableException(
        'Our AI is busy right now. Please try again in a moment.'
      );
    }
    if (err.response?.status >= 500) {
      throw new ServiceUnavailableException(
        'The AI service is temporarily unavailable. Please try again.'
      );
    }
    // Generic fallback
    throw new InternalServerErrorException(
      'Story generation failed. Please try again.'
    );
  }
}
```

---

### AI Response Parsing Errors

When DeepSeek returns malformed or non-JSON output:

```typescript
private parseResponse(data: any): GeneratedStory {
  const raw = data.choices?.[0]?.message?.content || '';
  const clean = raw.replace(/```json|```/g, '').trim();

  let parsed: GeneratedStory;

  try {
    parsed = JSON.parse(clean);
  } catch {
    throw new InternalServerErrorException(
      'The AI returned an unexpected response. Please try generating again.'
    );
  }

  // Validate required fields
  if (!parsed.title || !parsed.character || !Array.isArray(parsed.scenes)) {
    throw new InternalServerErrorException(
      'The AI response was incomplete. Please try generating again.'
    );
  }

  // Warn but don't reject on scene count mismatch
  if (parsed.scenes.length === 0) {
    throw new InternalServerErrorException(
      'No scenes were generated. Please try again.'
    );
  }

  return parsed;
}
```

---

### Database Errors

Handle Prisma errors at the service level — never let them bubble raw to the client:

```typescript
// Common Prisma error codes
import { Prisma } from '@prisma/client';

try {
  await this.prisma.story.create({ data });
} catch (err) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      throw new ConflictException('A record with this value already exists.');
    }
    if (err.code === 'P2025') {
      throw new NotFoundException('The requested record was not found.');
    }
  }
  throw new InternalServerErrorException('Database error. Please try again.');
}
```

---

### HTTP Error Responses

Always use the correct NestJS exception class:

| Situation | Exception Class |
|---|---|
| Invalid input / validation | `BadRequestException` |
| Not logged in | `UnauthorizedException` |
| Not allowed (wrong user) | `ForbiddenException` |
| Resource not found | `NotFoundException` |
| Email already taken | `ConflictException` |
| DeepSeek unavailable | `ServiceUnavailableException` |
| DeepSeek timeout | `GatewayTimeoutException` |
| Everything else | `InternalServerErrorException` |

---

## Frontend Error Handling (Next.js)

### API Client — Centralised Error Handling

All errors from the API must be caught in `lib/api.ts`:

```typescript
// lib/api.ts
async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new ApiError(
        error.message || 'Something went wrong. Please try again.',
        res.status
      );
    }

    return res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Network failure (no internet, server down)
    throw new ApiError('Unable to connect. Check your internet connection.', 0);
  }
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}
```

---

### Story Generation Error States

The generation page must handle and display these specific error states:

```typescript
type GenerationError =
  | 'timeout'        // Generation took too long
  | 'ai_unavailable' // DeepSeek down
  | 'parse_failed'   // Bad AI output
  | 'network'        // No internet
  | 'unknown'        // Catch-all

const ERROR_MESSAGES: Record<GenerationError, string> = {
  timeout: 'Generation timed out. Please try again.',
  ai_unavailable: 'Our AI is busy right now. Try again in a moment.',
  parse_failed: 'Something went wrong with your story. Please try again.',
  network: 'No internet connection. Please check your network.',
  unknown: 'Something went wrong. Please try again.',
}
```

Display errors inline on the generation page — never navigate away:

```tsx
{error && (
  <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-4 flex items-center justify-between">
    <p className="text-sm text-[#EF4444]">{error}</p>
    <button
      onClick={handleRetry}
      className="text-sm font-semibold text-white bg-[#EF4444] px-4 py-2 rounded-lg"
    >
      Try Again
    </button>
  </div>
)}
```

---

### Auth Errors

| Situation | Behaviour |
|---|---|
| Invalid credentials on login | Show inline error below form: "Incorrect email or password." |
| Email already in use on signup | Show inline error: "An account with this email already exists." |
| Token expired mid-session | Clear auth state, redirect to `/login` with message: "Your session expired. Please log in again." |
| Accessing protected route without auth | Redirect to `/login` |

---

### Story Library Errors

| Situation | Behaviour |
|---|---|
| Failed to load stories | Show error card: "Couldn't load your stories. Refresh to try again." |
| Failed to delete story | Show toast: "Couldn't delete story. Please try again." |
| Story not found (`/story/[id]`) | Show 404-style message: "Story not found." with link back to library |

---

## Generation Timeout Strategy

The PRD requires story generation under 10 seconds. Enforce this with:

- **Frontend timeout**: if no response after 12 seconds, cancel the request and show timeout error
- **Backend timeout**: set `axios timeout: 15000` on the DeepSeek call
- **Scene count limit**: never allow more than 12 scenes in a single generation call

```typescript
// Frontend timeout wrapper
const generateWithTimeout = async (inputs: StoryInput) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const result = await api.generateStory(inputs, { signal: controller.signal });
    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('Generation timed out. Please try again.', 0);
    }
    throw err;
  }
};
```

---

## Logging

- Log all errors server-side with `console.error` at minimum for MVP
- Never log passwords, tokens, or user PII
- Log DeepSeek raw responses when parsing fails (for debugging)

```typescript
// Log format
console.error(`[DeepSeek] Parse failed`, {
  prompt: payload,
  rawResponse: raw.substring(0, 500), // truncate
  error: err.message,
});
```
