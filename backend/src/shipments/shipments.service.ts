import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { GetShipmentsDto } from './dto/get-shipments.dto';
import { UsersService } from '../users/users.service';
import { ShipmentStatus } from './enums/shipment-status.enum';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';
import { TrackingCodeService } from './services/tracking-code.service';
import { ShipmentStatusService } from './services/shipment-status.service';
import { ShipmentEventsService } from './services/shipment-events.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepo: Repository<Shipment>,

    private readonly usersService: UsersService,
    private readonly trackingCodeService: TrackingCodeService,
    private readonly shipmentStatusService: ShipmentStatusService,
    private readonly shipmentEventsService: ShipmentEventsService,
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
    const trackingCode = await this.trackingCodeService.generate();

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

    this.validateStatusChange(shipment.status, dto.status);

    const user = await this.getUserById(userId);
    
    this.applyStatus(shipment, dto.status);

    await this.shipmentRepo.save(shipment);
    await this.shipmentEventsService.create(
      shipment,
      user,
      dto.status,
      dto.location,
      dto.notes,
    );

    return this.findOne(id);
  }

  private validateStatusChange(
    currentStatus: ShipmentStatus,
    newStatus: ShipmentStatus,
  ): void {
    if (!this.shipmentStatusService.canChange(currentStatus, newStatus)) {
      throw new BadRequestException('Invalid status transition');
    }
  }

  private async getUserById(userId: string): Promise<User> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private applyStatus(
    shipment: Shipment,
    status: ShipmentStatus,
  ): void {
    shipment.status = status;

    if (status === ShipmentStatus.DELIVERED) {
      shipment.deliveredAt = new Date();
    }
  }
}
