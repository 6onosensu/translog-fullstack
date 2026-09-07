import { ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsUUID } from "class-validator";

export class AssignVehiclesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each:true })
  shipmentIds!: string[];

  @IsNumber()
  @IsPositive()
  vehicleCapacity!: number;
}