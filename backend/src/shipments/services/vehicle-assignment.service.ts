import { Injectable } from "@nestjs/common";
import { Shipment } from "../entities/shipment.entity";

@Injectable()
export class VehicleAssignmentService {
  assign(
    shipments: Shipment[],
    capacity: number,
  ) {
    const sortedShipments = [...shipments].sort(
      (a, b) => Number(b.weight) - Number(a.weight),
    );

    const vehicles: Shipment[][] = [];

    for (const shipment of sortedShipments) {
      const shipmentWeight = Number(shipment.weight);
      let assigned = false;

      for(const vehicle of vehicles) {
        const currentWeight = vehicle.reduce(
          (sum, item) => sum + Number(item.weight),
          0,
        );

        if (currentWeight + shipmentWeight <= capacity) {
          vehicle.push(shipment);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        vehicles.push([shipment]);
      }
    }
    return this.formatResult(vehicles, capacity);
  }

  private formatResult(
    vehicles: Shipment[][],
    capacity: number,
  ) {
    const formattedVehicles = vehicles.map((vehicle, index) => {
      const totalWeight = vehicle.reduce(
        (sum, shipment) => sum + Number(shipment.weight),
        0,
      );

      return {
        vehicleNumber: index + 1,
        shipments: vehicle.map((shipment) => ({
          shipmentId: shipment.id,
          trackingCode: shipment.trackingCode,
          weight: Number(shipment.weight),
        })),
        totalWeight,
        remainingCapacity: capacity - totalWeight,
      };
    })

    const totalWeight = formattedVehicles.reduce(
      (sum, vehicle) => sum + vehicle.totalWeight,
      0,
    )

    return {
      vehicles: formattedVehicles,
      totalVehiclesUsed: formattedVehicles.length,
      totalWeight,
    };
  }
}