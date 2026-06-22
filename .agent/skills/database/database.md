# Skill: Database – Prisma Schema & Data Models

## ORM: Prisma | Database: PostgreSQL

---

## Full Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  name         String
  email        String    @unique
  passwordHash String    @map("password_hash")
  createdAt    DateTime  @default(now()) @map("created_at")
  stories      Story[]

  @@map("users")
}

model Story {
  id              String      @id @default(uuid())
  userId          String?     @map("user_id")
  title           String
  genre           String
  culturalSetting String      @map("cultural_setting")
  conflict        String
  tone            String
  language        String      @default("en")
  sceneCount      Int         @map("scene_count")
  storyIdea       String?     @map("story_idea")
  additionalNotes String?     @map("additional_notes")
  moral           String?
  createdAt       DateTime    @default(now()) @map("created_at")

  user            User?       @relation(fields: [userId], references: [id], onDelete: Cascade)
  character       Character?
  scenes          Scene[]

  @@map("stories")
}

model Character {
  id              String   @id @default(uuid())
  storyId         String   @unique @map("story_id")
  name            String
  appearance      String
  personality     String
  motivation      String
  role            String
  culturalContext String   @map("cultural_context")

  story           Story    @relation(fields: [storyId], references: [id], onDelete: Cascade)

  @@map("characters")
}

model Scene {
  id              String   @id @default(uuid())
  storyId         String   @map("story_id")
  sceneNumber     Int      @map("scene_number")
  setting         String
  action          String
  dialogue        String
  voiceover       String

  story           Story    @relation(fields: [storyId], references: [id], onDelete: Cascade)

  @@map("scenes")
}
```

---

## Key Relationships

- One `User` has many `Stories`
- One `Story` has one `Character`
- One `Story` has many `Scenes`
- Stories can exist without a `userId` (guest stories are not persisted to DB — they live in localStorage only)

---

## Migrations

Run migrations with:
```bash
npx prisma migrate dev --name <migration_name>
npx prisma generate
```

---

## Seeding

No seed data required for MVP. Prisma seed file is optional.

---

## Environment Variable

```env
DATABASE_URL="postgresql://user:password@localhost:5432/storyflow"
```

---

## Prisma Client Usage (NestJS)

Create a `PrismaService`:

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

Inject `PrismaService` into any module that needs database access.
