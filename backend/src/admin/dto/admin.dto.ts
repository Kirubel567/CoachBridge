import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationQuery } from '../../common/pagination';

export class AdminUsersQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['trainee', 'trainer', 'admin'])
  role?: 'trainee' | 'trainer' | 'admin';

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  suspended?: boolean;
}

export class SuspendDto {
  @IsOptional()
  @IsBoolean()
  suspended?: boolean; // defaults to true
}

export class RejectCertDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  reason!: string;
}

export class ModerateDto {
  @IsIn(['keep', 'remove'])
  action!: 'keep' | 'remove';
}
