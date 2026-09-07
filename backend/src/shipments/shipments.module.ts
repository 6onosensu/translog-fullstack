import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { Shipment } from './entities/shipment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentEvent } from './entities/shipment-event.entity';
import { UsersModule } from '../users/users.module';
import { TrackingCodeService } from './services/tracking-code.service';
import { ShipmentStatusService } from './services/shipment-status.service';
import { ShipmentEventsService } from './services/shipment-events.service';
import { TrackingController } from './tracking.controller';
import { VehicleAssignmentService } from './services/vehicle-assignment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shipment,
      ShipmentEvent,
    ]),
    UsersModule,
  ],
  providers: [
    ShipmentsService,
    TrackingCodeService,
    ShipmentStatusService,
    ShipmentEventsService,
    VehicleAssignmentService,
  ],
  controllers: [
    ShipmentsController,
    TrackingController,
  ]
})
export class ShipmentsModule {}
