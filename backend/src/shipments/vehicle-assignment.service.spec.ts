import { VehicleAssignmentService } from './services/vehicle-assignment.service';
import { Shipment } from './entities/shipment.entity';

describe('VehicleAssignmentService', () => {
  let service: VehicleAssignmentService;

  beforeEach(() => {
    service = new VehicleAssignmentService();
  });

  it('should assign shipments using FFD', () => {
    const shipments = [
      { id: '1', trackingCode: 'ENV-1', weight: 8 },
      { id: '2', trackingCode: 'ENV-2', weight: 7 },
      { id: '3', trackingCode: 'ENV-3', weight: 3 },
    ] as Shipment[];

    const result = service.assign(shipments, 10);

    expect(result.totalVehiclesUsed).toBe(2);
    expect(result.totalWeight).toBe(18);
    expect(result.vehicles[0].totalWeight).toBe(8);
    expect(result.vehicles[1].totalWeight).toBe(10);
    expect(result.vehicles[0].shipments[0].weight).toBe(8);
    expect(result.vehicles[1].shipments[0].weight).toBe(7);
    expect(result.vehicles[1].shipments[1].weight).toBe(3);
  });
});
