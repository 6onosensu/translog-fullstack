import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from '../entities/shipment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrackingCodeService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,
  ) {}

  async generate(): Promise<string> {
    let trackingCode: string;
    let exists: boolean;

    do {
      const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');

      const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();

      trackingCode = `ENV-${date}-${suffix}`;

      exists = await this.shipmentRepo.exists({
        where: { trackingCode },
      });
    } while (exists);

    return trackingCode;
  }
}
