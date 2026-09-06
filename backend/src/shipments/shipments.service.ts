import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { GetShipmentsDto } from './dto/get-shipments.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,
  ) {}

  async findAll(query: GetShipmentsDto): Promise<{
    items: Shipment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {page, limit, status } = query;
    const where = status ? { status } : {};

    const [items, total] = await this.shipmentRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });
    return {
      items, total, page, limit,
    };
  }

  async create(dto: CreateShipmentDto): Promise<Shipment> {
    const trackingCode = await this.generateTrackingCode();

    const shipment = this.shipmentRepo.create({
      ...dto,
      trackingCode,
    });

    return this.shipmentRepo.save(shipment);
  }

  private async generateTrackingCode(): Promise<string> {
    let trackingCode: string;
    let exists: boolean;

    do {
      const date = new Date()
        .toISOString()
        .slice(0, 10)
        .replaceAll('-', '');

      const suffix = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
      
      trackingCode = `ENV-${date}-${suffix}`;

      exists = await this.shipmentRepo.exists({
        where: { trackingCode },
      });
    } while (exists);

    return trackingCode;
  }
}
