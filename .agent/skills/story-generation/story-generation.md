# Skill: Story Generation – Flow, Inputs & Output Structure

---

## Overview

Story generation is the core feature of StoryFlow AI. It is a 3-step flow:

```
Step 1: Select Inputs → Step 2: Review Blueprint → Step 3: Generated Story
```

---

## Step 1 – Input Selection

### Beginner Mode (all dropdown/selector based)

| Input | Type | Options |
|---|---|---|
| Story Category | Select | Moral Story, Inspirational, Comedy, Drama, Adventure, Romance, Fantasy, Mystery, Plot Twist, Emotional |
| Character Type | Select | Human, Animal, Object, Fruits, Food, Fantasy Creature, Hybrid |
| Cultural Setting | Select | See cultural settings below |
| Conflict Type | Select | See conflict list below |
| Tone | Select | Serious, Lighthearted, Inspirational, Suspenseful, Humorous, Emotional |
| Story Duration | Hybrid | Quick-select: 30s (3 scenes), 1 min (5 scenes), 2 mins (8 scenes), 3 mins (12 scenes) — OR — Custom number input (min 3, max 20) with auto estimated duration label |

### Advanced Mode (adds optional free-text fields)

| Input | Type |
|---|---|
| Story Idea | Textarea (optional) |
| Additional Instructions | Textarea (optional) |

---

## Cultural Settings

The AI freely chooses environments within the selected cultural setting as the story demands. The cultural setting defines the world — the AI decides which specific locations each scene visits.

### African
- Nigerian Village
- Nigerian City
- Ghanaian Community
- Kenyan Community
- South African Community
- Generic African Setting

### Western
- American Suburb
- American City
- British Town
- European City

### Asian
- Japanese City
- Chinese Community
- Indian Community
- Korean Community

### Middle Eastern
- Traditional Community
- Modern City

### Fantasy
- Magical Kingdom
- Ancient Realm
- Futuristic World

---

## Conflict Types

- Betrayal
- Competition
- Greed
- Jealousy
- Dishonesty
- Lost Item
- Family Conflict
- Friendship Conflict
- Mistaken Identity
- Unexpected Discovery
- Kindness Rewarded
- Pride Before a Fall
- Sacrifice
- Redemption
- Secret Revealed

---

## Step 2 – Story Blueprint Preview

Before generating, show the user a preview card:

```
┌─────────────────────────────────────┐
│  Story Blueprint                    │
│                                     │
│  Main Character:  Young Nigerian Boy│
│  Character Type:  Human             │
│  Cultural Setting: Nigerian Village │
│  Conflict:        Lost Wallet       │
│  Story Goal:      Return the Wallet │
│  Lesson:          Honesty Rewarded  │
│  Scenes:          8                 │
│                                     │
│  [Edit Inputs]    [Generate Story]  │
└─────────────────────────────────────┘
```

The blueprint is derived client-side from the user's selections — no AI call in Step 2. The only DeepSeek API call happens in Step 3 when the user clicks Generate Story.

---

## Step 3 – Generated Story Output

### Full Output Structure

```typescript
interface GeneratedStory {
  title: string;
  moral: string;
  character: {
    name: string;
    appearance: string;
    personality: string;
    motivation: string;
    role: string;
    culturalContext: string;
  };
  blueprint: {
    setting: string;
    conflict: string;
    goal: string;
    lesson: string;
  };
  scenes: Scene[];
}

interface Scene {
  sceneNumber: number;
  setting: string;
  action: string;
  dialogue: string;
  voiceover: string;
}
```

---

## Story Display UI

Present the output in a clean, readable layout:

1. **Story Header** – Title + Moral banner
2. **Character Card** – Name, appearance, personality, motivation
3. **Blueprint Summary** – Setting, conflict, goal, lesson
4. **Scene Cards** – One card per scene with tabs or sections for:
   - Setting
   - Action
   - Dialogue
   - Voiceover
5. **Save Button** – Auto-saves for registered users, prompts login for guests

---

## Guest Mode – Local Storage

For guest users, save the generated story to `localStorage`:

```typescript
// lib/guestStorage.ts

const GUEST_STORIES_KEY = 'storyflow_guest_stories';

export function saveGuestStory(story: GeneratedStory) {
  const existing = getGuestStories();
  const updated = [{ ...story, id: crypto.randomUUID(), savedAt: new Date().toISOString() }, ...existing];
  localStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated));
}

export function getGuestStories(): GeneratedStory[] {
  const raw = localStorage.getItem(GUEST_STORIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function deleteGuestStory(id: string) {
  const updated = getGuestStories().filter((s: any) => s.id !== id);
  localStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(updated));
}
```

---

## API Endpoints – Story Generation

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /stories/generate | No | Generate a story (returns JSON) |
| POST | /stories | Yes | Save a generated story |
| GET | /stories | Yes | Get all stories for current user |
| GET | /stories/:id | Yes | Get a specific story |
| DELETE | /stories/:id | Yes | Delete a story |

---

## Story Generation API – Request Body

```json
{
  "genre": "Moral Story",
  "characterType": "Human",
  "culturalSetting": "Nigerian Village",
  "conflict": "Lost Item",
  "tone": "Inspirational",
  "sceneCount": 8,
  "storyIdea": "Optional story idea text",
  "additionalInstructions": "Optional extra instructions"
}
```

---

## Pacing Rule

Pacing is controlled by scene count alone — not by platform.
- 4 scenes → tight, fast, punchy
- 6–8 scenes → balanced storytelling with room to breathe
- 10–12 scenes → deep, layered narrative with full character arc

A well-written story works on any platform. Do not restrict output by platform label.
