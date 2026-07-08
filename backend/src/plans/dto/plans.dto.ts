import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  traineeId!: string;

  @IsIn(['workout', 'nutrition'])
  type!: 'workout' | 'nutrition';

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsObject()
  content!: Record<string, unknown>;
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;
}

export class FromTemplateDto {
  @IsString()
  traineeId!: string;

  @IsString()
  templateKey!: string;
}
