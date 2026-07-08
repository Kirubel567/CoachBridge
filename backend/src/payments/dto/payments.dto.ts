import { IsIn, IsInt, IsString, Min } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  bookingId!: string;
}

export class PayoutDto {
  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsIn(['telebirr', 'cbe'])
  method!: 'telebirr' | 'cbe';

  @IsString()
  destination!: string; // phone (Telebirr) or account number (CBE)
}
