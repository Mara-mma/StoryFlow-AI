import {
  Injectable,
  InternalServerErrorException,
  GatewayTimeoutException,
  ServiceUnavailableException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DeepSeekService } from '../ai/deepseek.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateStoryDto } from './dto/generate-story.dto';

@Injectable()
export class StoriesService {
  constructor(
    private deepseek: DeepSeekService,
    private prisma: PrismaService,
  ) {}

  async generate(dto: GenerateStoryDto, userId?: string) {
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { generationCount: true, maxGenerations: true, tier: true },
      });

      if (user && user.tier === 'free' && user.generationCount >= user.maxGenerations) {
        throw new HttpException(
          {
            statusCode: 402,
            error: 'Limit Reached',
            message: `You've used all ${user.maxGenerations} free generations. Upgrade to continue creating stories.`,
            code: 'LIMIT_REACHED',
          },
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
    }

    let raw: string;

    try {
      raw = await this.deepseek.generateStory({
        genre: dto.genre,
        characterType: dto.characterType,
        culturalSetting: dto.culturalSetting,
        conflict: dto.conflict,
        tone: dto.tone,
        sceneCount: dto.sceneCount,
        storyIdea: dto.storyIdea,
        additionalInstructions: dto.additionalInstructions,
      });
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        throw new GatewayTimeoutException(
          'Generation timed out. Please try again.',
        );
      }
      if (err.response?.status === 429) {
        throw new ServiceUnavailableException(
          'Our AI is busy right now. Please try again in a moment.',
        );
      }
      if (err.response?.status >= 500) {
        throw new ServiceUnavailableException(
          'The AI service is temporarily unavailable. Please try again.',
        );
      }
      if (err.response?.status === 401 || err.response?.status === 403) {
        throw new InternalServerErrorException(
          'AI service authentication failed. Please check the API key configuration.',
        );
      }
      if (!err.response) {
        throw new InternalServerErrorException(
          'Unable to reach the AI service. Please check your network connection and try again.',
        );
      }
      throw new InternalServerErrorException(
        'Story generation failed. Please try again.',
      );
    }

    const data = this.parseResponse(raw, dto.sceneCount);

    if (userId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { generationCount: { increment: 1 } },
      });
    }

    return { success: true, data };
  }

  private parseResponse(raw: string, expectedSceneCount: number) {
    const clean = raw.replace(/```json|```/g, '').trim();

    let parsed: any;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error('[DeepSeek] Parse failed', { raw: raw.substring(0, 500) });
      throw new InternalServerErrorException(
        'The AI returned an unexpected response. Please try generating again.',
      );
    }

    if (!parsed.title || !parsed.character || !Array.isArray(parsed.scenes)) {
      throw new InternalServerErrorException(
        'The AI response was incomplete. Please try generating again.',
      );
    }

    if (parsed.scenes.length === 0) {
      throw new InternalServerErrorException(
        'No scenes were generated. Please try again.',
      );
    }

    if (parsed.scenes.length !== expectedSceneCount) {
      console.warn(
        `Expected ${expectedSceneCount} scenes, got ${parsed.scenes.length}`,
      );
    }

    return parsed;
  }

  async save(dto: any, userId?: string) {
    const story = await this.prisma.story.create({
      data: {
        userId: userId || null,
        title: dto.title,
        genre: dto.genre || '',
        culturalSetting: dto.culturalSetting || '',
        conflict: dto.conflict || '',
        tone: dto.tone || '',
        sceneCount: dto.scenes?.length || 0,
        moral: dto.moral || '',
        character: {
          create: dto.character,
        },
        scenes: {
          create: dto.scenes.map((s: any) => ({
            sceneNumber: s.sceneNumber,
            setting: s.setting,
            action: s.action,
            dialogue: s.dialogue,
            voiceover: s.voiceover,
          })),
        },
      },
      include: {
        character: true,
        scenes: true,
      },
    });

    return { success: true, data: story };
  }

  async findAll(userId: string) {
    const stories = await this.prisma.story.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        genre: true,
        sceneCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: stories };
  }

  async findOne(id: string, userId: string) {
    const story = await this.prisma.story.findFirst({
      where: { id, userId },
      include: {
        character: true,
        scenes: { orderBy: { sceneNumber: 'asc' } },
      },
    });

    if (!story) {
      return { success: false, statusCode: 404, message: 'Story not found.' };
    }

    return {
      success: true,
      data: {
        ...story,
        character: story.character,
        blueprint: {
          setting: story.culturalSetting,
          conflict: story.conflict,
          goal: '',
          lesson: story.moral,
        },
      },
    };
  }

  async remove(id: string, userId: string) {
    const story = await this.prisma.story.findFirst({
      where: { id, userId },
    });

    if (!story) {
      return { success: false, statusCode: 404, message: 'Story not found.' };
    }

    await this.prisma.story.delete({ where: { id } });
    return { success: true, data: { id } };
  }

  async search(query: string, userId: string) {
    const stories = await this.prisma.story.findMany({
      where: {
        userId,
        title: { contains: query, mode: 'insensitive' },
      },
      select: {
        id: true,
        title: true,
        genre: true,
        sceneCount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: stories };
  }
}
