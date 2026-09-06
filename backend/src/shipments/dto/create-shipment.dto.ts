import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateShipmentDto {
  @Transform(({value}) => value?.trim())
  @IsString()
  @IsNotEmpty()
  originAddress!: string;

  @Transform(({value}) => value?.trim())
  @IsString()
  @IsNotEmpty()
  destinationAddress!: string;

  @Transform(({value}) => value?.trim())
  @IsString()
  @IsNotEmpty()
  recipientName!: string;

  @IsString()
  @IsOptional()
  recipientPhone?: string;

  @IsNumber()
  @IsPositive()
  weight!: number;
}