# Rule: API Conventions

## Applies To: NestJS Backend REST API

---

## Base URL

```
http://localhost:3001/api
```

All routes are prefixed with `/api` in the NestJS global prefix config:

```typescript
// main.ts
app.setGlobalPrefix('api');
```

---

## REST Design Rules

- Use **nouns**, not verbs in endpoints: `/stories` not `/getStories`
- Use **plural resource names**: `/stories`, `/characters`, `/scenes`
- Use **nested routes** only when the relationship is always accessed through the parent:
  - `/stories/:id/scenes` ✓ (scenes always belong to a story)
- Use **HTTP methods** correctly:
  - `GET` – Read
  - `POST` – Create
  - `PUT` – Full replace
  - `PATCH` – Partial update
  - `DELETE` – Remove

---

## Full API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | No | Register new user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user |

### Stories

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/stories/generate | No | Generate a story via DeepSeek AI |
| POST | /api/stories | Yes | Save a generated story |
| GET | /api/stories | Yes | List all user stories |
| GET | /api/stories/:id | Yes | Get a specific story with scenes + character |
| DELETE | /api/stories/:id | Yes | Delete a story |
| GET | /api/stories/search?q= | Yes | Search stories by title |

---

## Request / Response Format

All requests and responses use **JSON**.

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["genre is required", "sceneCount must be a number"]
}
```

### Paginated Response (future use)

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

---

## HTTP Status Codes

| Code | When to use |
|---|---|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful POST (resource created) |
| 400 | Validation error / bad request |
| 401 | Unauthenticated |
| 403 | Authenticated but not authorized |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already exists) |
| 500 | Unexpected server error |

---

## Validation

Use `class-validator` on all DTOs and apply globally:

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,         // Strip unknown fields
  forbidNonWhitelisted: true,
  transform: true,         // Auto-transform types
}));
```

---

## CORS

Enable CORS for the frontend origin:

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

---

## Story Generation Endpoint – Detail

`POST /api/stories/generate`

This is the main AI endpoint. It does **not** require auth, allowing guests to generate stories.

**Request body:**
```json
{
  "genre": "Moral Story",
  "characterType": "Human",
  "culturalSetting": "Nigerian Village",
  "environment": "Village Market",
  "conflict": "Lost Item",
  "tone": "Inspirational",
  "platform": "tiktok",
  "sceneCount": 8,
  "storyIdea": "A boy finds a wallet",
  "additionalInstructions": "Make the ending surprising"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "The Honest Boy",
    "moral": "Honesty always pays",
    "character": { ... },
    "blueprint": { ... },
    "scenes": [ ... ]
  }
}
```

---

## Frontend API Client

Centralise all API calls in `lib/api.ts`:

```typescript
// lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'API request failed');
  }

  return res.json();
}

export const api = {
  generateStory: (body: GenerateStoryInput) =>
    request('/stories/generate', { method: 'POST', body: JSON.stringify(body) }),

  saveStory: (body: GeneratedStory, token: string) =>
    request('/stories', { method: 'POST', body: JSON.stringify(body) }, token),

  getStories: (token: string) =>
    request('/stories', {}, token),

  deleteStory: (id: string, token: string) =>
    request(`/stories/${id}`, { method: 'DELETE' }, token),

  login: (body: LoginDto) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  signup: (body: SignupDto) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
};
```
