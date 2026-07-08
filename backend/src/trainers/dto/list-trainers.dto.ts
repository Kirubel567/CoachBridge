import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationQuery } from '../../common/pagination';

export class ListTrainersDto extends PaginationQuery {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  // City / area free-text (docs: ?location=addis).
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number; // cents

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number; // cents

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  minRating?: number;

  @IsOptional()
  @IsIn(['in-person', 'online'])
  sessionType?: 'in-person' | 'online';

  // Accepted for forward-compat; real availability filtering arrives in Phase 3.
  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsIn(['rating', 'sessions', 'price-asc', 'price-desc', 'experience'])
  sortBy?: 'rating' | 'sessions' | 'price-asc' | 'price-desc' | 'experience';
}
