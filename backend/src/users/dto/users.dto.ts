import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  avatarUrl?: string;

  // To change password, send both currentPassword and newPassword.
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ValidateIf((o) => o.newPassword !== undefined)
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword?: string;
}

export class UpsertTraineeProfileDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  goals?: string[];

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsInt()
  @Min(50)
  @Max(260)
  heightCm?: number;

  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(400)
  weightKg?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredSessionTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coachingStylePrefs?: string[];
}

export class UpsertTrainerProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  specialties?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(70)
  experienceYears?: number;

  // Integer cents of ETB.
  @IsOptional()
  @IsInt()
  @Min(0)
  pricePerSession?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sessionTypes?: string[];
}
