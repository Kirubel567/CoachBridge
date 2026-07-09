import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  trainerId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  comment!: string;
}

export class RespondReviewDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  response!: string;
}
