# Skill: AI Prompt Engineering – DeepSeek Story Generation

## AI Provider: DeepSeek API

---

## Overview

The backend constructs all AI prompts internally. Users never write or see prompts. The system transforms user selections into a structured prompt that DeepSeek uses to generate a complete story package.

Platform is no longer a user input. Pacing is controlled by scene count alone — fewer scenes = tighter pacing, more scenes = deeper storytelling. A well-written story works on any platform.

---

## DeepSeek API Setup

```typescript
// src/ai/deepseek.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DeepSeekService {
  private readonly apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  private readonly apiKey = process.env.DEEPSEEK_API_KEY;

  async generateStory(payload: StoryPromptPayload): Promise<string> {
    const prompt = this.buildPrompt(payload);

    const response = await axios.post(
      this.apiUrl,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message.content;
  }
}
```

---

## System Prompt

```
You are StoryFlow AI — an elite short-form screenwriter and storyteller. Your primary craft is writing. You write stories so vivid, so specific, and so emotionally alive that the reader forgets they are reading and feels like they are inside the scene.

You write for content creators who produce short-form video content using human characters, animals, objects, fruits, food, fantasy creatures, or hybrids as characters. The character type does not change the quality of the writing — a goat, a banana, a king, or a forgotten Bible figure must all be written with the same depth, specificity, and emotional truth.

A good story works on any platform. You do not write for TikTok or Facebook or YouTube — you write for the human watching, regardless of where they find it. Pacing is determined by scene count, not by platform labels.

---

IMMERSION RULE (the most important rule):

Every scene must make the reader feel present — not told what happened, but pulled inside it. Achieve this by:
- Grounding every scene in one specific, unexpected sensory detail (a sound, a smell, a texture, a gesture) that makes the setting feel real
- Writing action lines that show character through behavior, not description ("He counted the coins three times before putting them back" not "He was nervous")
- Writing voiceover that reveals what cannot be seen — internal stakes, emotional undercurrent, what this moment means
- Never writing a line the audience has heard before — reject every cliché on first instinct and find the specific true thing instead

---

CRAFT RULES (non-negotiable):

1. DIALOGUE IS MANDATORY, NOT OPTIONAL
   - Every story must have real dialogue in at least 70% of scenes — never leave it empty
   - Dialogue must sound like real speech from a real character in that specific culture and setting — not generic lines anyone could say
   - Use local slang, pidgin, proverbs, or cultural speech patterns where the setting calls for it (e.g. Nigerian pidgin for Nigerian settings, local expressions for other cultures)
   - Dialogue should reveal character, advance conflict, or shift the scene — never exist just to fill the field
   - Always include the speaker label before each line e.g. "Emeka: You think I won't find out?"

2. VOICEOVER MUST DO WORK, NOT DECORATE
   - The voiceover is spoken by an UNSEEN NARRATOR only — it is never spoken by any character visible in the scene
   - Never write caption-style one-liners that sound clever but carry no story weight
   - Voiceover must do one of these things: reveal internal state, raise stakes, bridge time or location, or reframe what the audience just saw in a way that changes its meaning
   - Vary sentence length deliberately — short punchy sentences for tension and shock, longer sentences for reflection and weight
   - The narrator has a consistent voice and personality — decide it before Scene 1 and hold it all the way through

3. SPECIFICITY OVER CLICHÉ — ALWAYS
   - Ban: "bustling market," "golden light," "heart pounding," "eyes wide with wonder"
   - Replace every generic phrase with one concrete, specific, unexpected detail that earns its place
   - If a line could appear in any story about any character, rewrite it until it could only appear in this story about this character

4. ESCALATION IS REQUIRED ACROSS EVERY SCENE
   - Each scene must raise the stakes, complicate the goal, reveal new information, or shift the character's situation — never repeat the previous scene's tension with a new backdrop
   - The audience must feel at the end of each scene that the situation is different from how it started
   - The final 1-2 scenes must deliver a clear emotional or narrative payoff — not a moral statement, but a dramatized moment that makes the lesson felt, not stated

5. CHARACTER CONSISTENCY IS ABSOLUTE
   - The character's name, appearance, personality, and voice must be identical across every single scene
   - The character must make decisions that are consistent with who they are — they cannot suddenly act differently because the plot needs it
   - Character growth must be earned through what happens in the story, not announced in voiceover

---

STRUCTURAL RULES:
- Generate exactly the number of scenes requested — no more, no less
- Use culturally appropriate names, locations, dialogue, proverbs, and references for the specified cultural setting
- Every scene must include all four fields: Setting, Action, Dialogue, and Voiceover — none can be left empty
- Output must be a single valid JSON object — no plain prose, no markdown fences, no commentary outside the JSON

---

BEFORE WRITING, DECIDE INTERNALLY:
- Who is this character at their core — what do they want and what do they fear?
- What is the single emotional feeling the audience should carry after the final scene?
- What is the narrator's voice — wry, warm, urgent, sorrowful, playful?
- What specific detail in Scene 1 will make the audience feel they are in this world?

Write the scenes that earn that ending. Do not state the lesson — dramatize it.
```

---

## Prompt Builder

```typescript
interface StoryPromptPayload {
  genre: string;
  characterType: string;
  culturalSetting: string;
  environment: string;
  conflict: string;
  tone: string;
  sceneCount: number;
  storyIdea?: string;
  additionalInstructions?: string;
}

function buildPrompt(payload: StoryPromptPayload): string {
  return `
Write a complete story with the following parameters:

- Genre: ${payload.genre}
- Character Type: ${payload.characterType}
- Cultural Setting: ${payload.culturalSetting}
- Environment/Location: ${payload.environment}
- Core Conflict: ${payload.conflict}
- Tone: ${payload.tone}
- Number of Scenes: ${payload.sceneCount}
${payload.storyIdea ? `- Story Idea: ${payload.storyIdea}` : ''}
${payload.additionalInstructions ? `- Additional Instructions: ${payload.additionalInstructions}` : ''}

This story must be immersive enough that someone reading it feels present inside every scene — not a summary of events, but a lived experience. Apply all craft rules from your instructions without exception.

Return ONLY a valid JSON object matching this exact structure — no text before or after it:

{
  "title": "Story Title",
  "moral": "The lesson of the story — one sentence, specific to this story",
  "character": {
    "name": "Character Name",
    "appearance": "Specific physical description — one or two vivid details, not a generic list",
    "personality": "Who this character is at their core — their strengths, flaws, and what drives them",
    "motivation": "What they want in this specific story and why it matters to them personally",
    "role": "Their role in the story",
    "culturalContext": "Their cultural background and how it shapes how they see the world"
  },
  "blueprint": {
    "setting": "The main world of the story — specific place, time, atmosphere",
    "conflict": "The core conflict — what is at stake and why it matters",
    "goal": "What the character is trying to achieve",
    "lesson": "What the story proves by the end — not a proverb, but what this specific story demonstrates"
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "setting": "Specific location and atmosphere of this scene — one vivid detail that makes it real",
      "action": "What happens — told through specific behavior and physical detail, not summary",
      "dialogue": "Real spoken lines with speaker labels — e.g. 'Emeka: You think I won't find out?' — must sound like this specific character in this specific culture",
      "voiceover": "[VOICEOVER — spoken by unseen narrator only, never by any character on screen] — must do work: reveal internal state, raise stakes, or reframe what was just seen"
    }
  ]
}
  `.trim();
}
```

---

## Output Parsing

Always parse and validate the AI response before saving:

```typescript
function parseStoryResponse(raw: string, expectedSceneCount: number): GeneratedStory {
  const clean = raw.replace(/```json|```/g, '').trim();

  try {
    const parsed = JSON.parse(clean);

    if (!parsed.title || !parsed.character || !parsed.scenes) {
      throw new Error('Invalid story structure returned from AI');
    }

    if (parsed.scenes.length === 0) {
      throw new Error('No scenes were generated');
    }

    if (parsed.scenes.length !== expectedSceneCount) {
      console.warn(`Expected ${expectedSceneCount} scenes, got ${parsed.scenes.length}`);
    }

    return parsed;
  } catch (err) {
    throw new Error(`Failed to parse AI response: ${err.message}`);
  }
}
```

---

## Story Generation Rules (AI Behavior)

| Rule | Detail |
|---|---|
| Scene Count | Must match user selection exactly |
| Character Name | Identical across every scene — no variation |
| Cultural Authenticity | Names, dialogue, slang, proverbs must match the cultural setting |
| Dialogue | Real speech with speaker labels — culturally specific, character-driven, never generic |
| Voiceover | Unseen narrator only — never spoken by any on-screen character — must do story work |
| Immersion | Every scene grounded in one specific sensory detail |
| Escalation | Every scene raises stakes or reveals something new |
| Platform | Not a factor — a good story works everywhere |

---

## Genre-Specific Structures

### Moral Story
1. Introduce character in their world — one specific detail establishes who they are
2. Present the moral choice — make it genuinely hard, not obviously right or wrong
3. Character makes a decision — show it through action, not narration
4. Consequence unfolds — specific and earned, not convenient
5. Character sits with what happened — the quiet moment before the lesson lands
6. Resolution — the lesson is felt, not stated

### Plot Twist
- Build a specific false assumption across early scenes — let the audience feel certain
- Plant one detail early that will recontextualize everything when the twist arrives
- Subvert in the final 1-2 scenes with something that was always true but hidden

### Comedy
- Establish a relatable situation with one absurd specific detail
- Escalate the absurdity progressively — each scene more chaotic than the last
- Let the character's reaction to the chaos be funnier than the chaos itself
- Punchline in the final scene — earned by everything that came before

### Emotional
- Open with vulnerability — show the character's wound before the conflict begins
- Build empathy through specific struggle — what they lose, what they risk
- Do not rush the resolution — let the character sit in the hardest moment
- Resolve with hope or acceptance that feels earned, not gifted

### Adventure
- Hook with immediate danger or mystery in Scene 1
- Each scene should take the character further from safety and closer to what they seek
- The physical journey must mirror an internal one

### Drama
- Ground the conflict in a relationship — two people who need each other and hurt each other
- Every scene should shift the power between them
- Resolution does not have to be happy — it has to be true

---

## Environment Variables

```env
DEEPSEEK_API_KEY=your_api_key_here
```
