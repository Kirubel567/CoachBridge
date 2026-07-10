import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SubmitCertificationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string; // e.g. "NASM Certified Personal Trainer"

  @IsOptional()
  @IsString()
  @MaxLength(160)
  issuer?: string;
}
