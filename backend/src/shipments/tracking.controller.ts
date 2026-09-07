import { Controller, Get, Param } from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { Shipment } from "./entities/shipment.entity";

@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly shipmentsService: ShipmentsService,
  ) {}

  @Get(':trackingCode')
  findByTrackingCode(
    @Param('trackingCode') trackingCode: string,
  ): Promise<Shipment> {
    return this.shipmentsService.findByTrackingCode(trackingCode);
  }
}