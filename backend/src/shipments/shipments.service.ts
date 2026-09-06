import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { GetShipmentsDto } from './dto/get-shipments.dto';
import { ShipmentEvent } from './entities/shipment-event.entity';
import { UsersService } from '../users/users.service';
import { ShipmentStatus } from './enums/shipment-status.enum';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,

    @InjectRepository(ShipmentEvent)
    private readonly shipmentEventRepo: Repository<ShipmentEvent>,

    private readonly usersService: UsersService,
  ) {}

  async findOne(id: string): Promise<Shipment> {
    const shipment = await this.shipmentRepo.findOne({
      where: { id },
      relations: { events: true },
    });

    if(!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }

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

  async updateStatus(
    id: string,
    dto: UpdateShipmentStatusDto,
    userId: string,
  ): Promise<Shipment> {
    const shipment = await this.findOne(id);
    if(!this.canChangeStatus(shipment.status, dto.status)) {
      throw new BadRequestException('Invalid status translation')
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    shipment.status = dto.status;

    if (dto.status === ShipmentStatus.DELIVERED) {
      shipment.deliveredAt = new Date();
    }

    await this.shipmentRepo.save(shipment);

    const event = this.shipmentEventRepo.create({
      shipment,
      user,
      status: dto.status,
      location: dto.location,
      notes: dto.notes,
    });

    await this.shipmentEventRepo.save(event);
    return this.findOne(id);
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

  private canChangeStatus(
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
  };
}
