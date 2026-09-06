import { Controller, UseGuards, Post, Body, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { GetShipmentsDto } from './dto/get-shipments.dto';

@Controller('shipments')
@UseGuards(JwtAuthGuard)
export class ShipmentsController { 
  constructor(
    private readonly shipmentsService: ShipmentsService,
  ) {}

  @Get()
  findAll(
    @Query() query: GetShipmentsDto,
  ): Promise<{
    items: Shipment[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.shipmentsService.findAll(query);
  }

  @Post()
  create(
    @Body() dto: CreateShipmentDto,
  ): Promise<Shipment> {
    return this.shipmentsService.create(dto)
  };
}
