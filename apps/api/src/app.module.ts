import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StoriesModule } from './stories/stories.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, StoriesModule, AiModule],
})
export class AppModule {}
