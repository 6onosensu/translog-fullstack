import { BadRequestException } from '@nestjs/common';
import { ShipmentStatus } from '../enums/shipment-status.enum';
import { ShipmentStatusService } from './shipment-status.service';

describe('ShipmentStatusService', () => {
  let service: ShipmentStatusService;

  beforeEach(() => {
    service = new ShipmentStatusService();
  });

  it('should allow valid status transition', () => {
    expect(() =>
      service.validateChange(
        ShipmentStatus.CREATED,
        ShipmentStatus.IN_WAREHOUSE,
      ),
    ).not.toThrow();
  });

  it('should reject invalid status transition', () => {
    expect(() =>
      service.validateChange(ShipmentStatus.CREATED, ShipmentStatus.DELIVERED),
    ).toThrow(BadRequestException);
  });
});
