import { Controller, UseGuards, Post, Body, Get, Query, Param, Patch, Req, Delete, Header } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { GetShipmentsDto } from './dto/get-shipments.dto';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { CancelShipmentDto } from './dto/cancel-shipment.dto';
import { AssignVehiclesDto } from './dto/assign-vehicles.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('shipments')
@ApiBearerAuth()
@Controller('shipments')
@UseGuards(JwtAuthGuard)
export class ShipmentsController { 
  constructor(
    private readonly shipmentsService: ShipmentsService,
  ) {}

  @ApiOperation({ summary: 'Get shipments' })
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

  @ApiOperation({ summary: 'Get shipments to CSV' })
  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header(
    'Content-Disposition',
    'attachment; filename="shipments.csv"',
  )
  exportCSV() {
    return this.shipmentsService.exportCSV();
  }
  
  @ApiOperation({ summary: 'Get shipment by id' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Shipment> {
    return this.shipmentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create shipment' })
  @Post()
  create(
    @Body() dto: CreateShipmentDto,
  ): Promise<Shipment> {
    return this.shipmentsService.create(dto)
  };

  @ApiOperation({ summary: 'Assign shipments to vehicles' })
  @Post('assign-vehicles')
  assignVehicles(
    @Body() dto: AssignVehiclesDto,
  ) {
    return this.shipmentsService.assignVehicles(dto);
  }

  @ApiOperation({ summary: 'Update shipment status' })
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

  @ApiOperation({ summary: 'Cancel shipment' })
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
