import { IsDateString, IsIn, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  trainerId!: string;

  // ISO-8601; must line up with one of the trainer's open slots.
  @IsDateString()
  startAt!: string;

  @IsIn(['in-person', 'online'])
  sessionType!: 'in-person' | 'online';
}
