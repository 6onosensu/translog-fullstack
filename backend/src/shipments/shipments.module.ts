import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { Shipment } from './entities/shipment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentEvent } from './entities/shipment-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Shipment,
    ShipmentEvent,
  ])],
  providers: [ShipmentsService],
  controllers: [ShipmentsController]
})
export class ShipmentsModule {}
