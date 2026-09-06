import { Controller, UseGuards, Post, Body, Get, Query, Param, Patch, Req, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { GetShipmentsDto } from './dto/get-shipments.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { CancelShipmentDto } from './dto/cancel-shipment.dto';

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
  
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Shipment> {
    return this.shipmentsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateShipmentStatusDto,
    @Req() request: { user: {sub: string }},
  ): Promise<Shipment> {
    return this.shipmentsService.updateStatus(
      id, 
      dto, 
      request.user.sub
    );
  }

  @Delete(':id')
  cancel(
    @Param('id') id: string,
    @Body() dto: CancelShipmentDto,
    @Req() request: { user: { sub: string } },
  ): Promise<void> {
    return this.shipmentsService.cancel(
      id,
      dto,
      request.user.sub,
    );
  }
}
