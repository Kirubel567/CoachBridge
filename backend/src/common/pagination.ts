import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** Shared query params for every list endpoint (see docs/API.md Pagination). */
export class PaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @IsString()
  sort?: string; // e.g. "-createdAt"
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Marker shape the ResponseInterceptor unwraps into { data, meta }.
export interface Page<T> {
  __page: true;
  data: T[];
  meta: PageMeta;
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): Page<T> {
  return {
    __page: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

/** Translate a "-createdAt" / "createdAt" sort string into a Prisma orderBy. */
export function parseSort(
  sort: string | undefined,
  allowed: string[],
  fallback: Record<string, 'asc' | 'desc'>,
): Record<string, 'asc' | 'desc'> {
  if (!sort) return fallback;
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  if (!allowed.includes(field)) return fallback;
  return { [field]: desc ? 'desc' : 'asc' };
}
