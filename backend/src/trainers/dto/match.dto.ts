import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

/**
 * Trainee match preferences. Any field left out falls back to the trainee's
 * stored profile.
 */
export class MatchDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  goals?: string[];

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxBudget?: number; // cents ETB, per session

  @IsOptional()
  @IsIn(['in-person', 'online'])
  sessionType?: 'in-person' | 'online';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
