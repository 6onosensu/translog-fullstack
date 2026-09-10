import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateShipmentDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  @IsString()
  @IsNotEmpty()
  originAddress!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  @IsString()
  @IsNotEmpty()
  destinationAddress!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  @IsString()
  @IsNotEmpty()
  recipientName!: string;

  @IsString()
  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Phone number is invalid',
  })
  recipientPhone?: string;

  @IsNumber()
  @IsPositive()
  weight!: number;
}
