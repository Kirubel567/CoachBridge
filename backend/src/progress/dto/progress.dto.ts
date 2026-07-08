import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProgressDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(20)
  @Max(400)
  weightKg?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(70)
  bodyFatPct?: number;

  @IsOptional()
  @IsBoolean()
  completedWorkout?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  // Arbitrary extra measurements, e.g. { waistCm, chestCm, benchKg, squatKg }.
  @IsOptional()
  @IsObject()
  metrics?: Record<string, number>;
}
