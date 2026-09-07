import { Controller, Get, Param } from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { Shipment } from "./entities/shipment.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('tracking')
@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly shipmentsService: ShipmentsService,
  ) {}

  @ApiOperation({ summary: 'Track shipment by tracking code' })
  @Get(':trackingCode')
  findByTrackingCode(
    @Param('trackingCode') trackingCode: string,
  ): Promise<Shipment> {
    return this.shipmentsService.findByTrackingCode(trackingCode);
  }
}