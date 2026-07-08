import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class AvailabilityRuleInput {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number; // 0=Sun … 6=Sat

  @Matches(/^\d{2}:\d{2}$/, { message: 'start must be HH:MM' })
  start!: string;

  @Matches(/^\d{2}:\d{2}$/, { message: 'end must be HH:MM' })
  end!: string;
}

export class SetAvailabilityDto {
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => AvailabilityRuleInput)
  rules!: AvailabilityRuleInput[];
}
