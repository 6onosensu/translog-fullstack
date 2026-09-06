import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Shipment } from './entities/shipment.entity';

@Controller('shipments')
@UseGuards(JwtAuthGuard)
export class ShipmentsController { 
  constructor(
    private readonly shipmentsService: ShipmentsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateShipmentDto,
  ): Promise<Shipment> {
    return this.shipmentsService.create(dto)
  };
}
