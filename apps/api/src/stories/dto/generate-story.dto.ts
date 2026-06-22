import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class GenerateStoryDto {
  @IsString()
  genre: string;

  @IsString()
  characterType: string;

  @IsString()
  culturalSetting: string;

  @IsString()
  conflict: string;

  @IsString()
  tone: string;

  @IsNumber()
  @Min(4)
  @Max(12)
  sceneCount: number;

  @IsOptional()
  @IsString()
  storyIdea?: string;

  @IsOptional()
  @IsString()
  additionalInstructions?: string;
}
