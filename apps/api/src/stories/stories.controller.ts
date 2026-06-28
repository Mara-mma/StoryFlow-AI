import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StoriesService } from './stories.service';
import { GenerateStoryDto } from './dto/generate-story.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stories')
export class StoriesController {
  constructor(
    private storiesService: StoriesService,
    private jwt: JwtService,
  ) {}

  @Post('generate')
  async generate(
    @Body() dto: GenerateStoryDto,
    @Headers('authorization') auth?: string,
  ) {
    let userId: string | undefined;
    if (auth?.startsWith('Bearer ')) {
      try {
        const payload = this.jwt.verify(auth.slice(7));
        userId = payload.sub;
      } catch {}
    }
    return this.storiesService.generate(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  save(@Body() body: any, @Request() req: any) {
    return this.storiesService.save(body, req.user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.storiesService.findAll(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query('q') query: string, @Request() req: any) {
    return this.storiesService.search(query, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.storiesService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.storiesService.remove(id, req.user.userId);
  }
}
