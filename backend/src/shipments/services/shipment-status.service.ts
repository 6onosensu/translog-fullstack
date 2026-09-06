import { Injectable } from "@nestjs/common";
import { ShipmentStatus } from "../enums/shipment-status.enum";

@Injectable()
export class ShipmentStatusService {
  canChange(
    currentStatus: ShipmentStatus,
    newStatus: ShipmentStatus,
  ): boolean {
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

    return transitions[currentStatus].includes(newStatus);
  }
}