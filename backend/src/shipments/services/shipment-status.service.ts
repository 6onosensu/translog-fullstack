import { BadRequestException, Injectable } from "@nestjs/common";
import { ShipmentStatus } from "../enums/shipment-status.enum";
import { Shipment } from "../entities/shipment.entity";

@Injectable()
export class ShipmentStatusService {
  validateChange(
    currentStatus: ShipmentStatus,
    newStatus: ShipmentStatus,
  ): void {
    const transitions: Record<ShipmentStatus, ShipmentStatus[]> = {
      [ShipmentStatus.CREATED]: [ShipmentStatus.IN_WAREHOUSE],
      [ShipmentStatus.IN_WAREHOUSE]: [ShipmentStatus.IN_TRANSIT],
      [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.OUT_FOR_DELIVERY],
      [ShipmentStatus.OUT_FOR_DELIVERY]: [
        ShipmentStatus.DELIVERED,
        ShipmentStatus.RETURNED,
      ],
      [ShipmentStatus.DELIVERED]: [],
      [ShipmentStatus.RETURNED]: [],
      [ShipmentStatus.CANCELLED]: [],
    };

    if (!transitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException('Invalid status transition');
    }

  }

  validateCancellation(status: ShipmentStatus): void {
    if (status === ShipmentStatus.DELIVERED) {
      throw new BadRequestException(
        'Delivered shipment cannot be cancelled',
      );
    }

    if (status === ShipmentStatus.CANCELLED) {
      throw new BadRequestException(
        'Shipment is already cancelled',
      );
    }
  }

  apply(
    shipment: Shipment,
    status: ShipmentStatus,
  ): void {
    shipment.status = status;

    if (status === ShipmentStatus.DELIVERED) {
      shipment.deliveredAt = new Date();
    }
  }
}