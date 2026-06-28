import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    AiModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
