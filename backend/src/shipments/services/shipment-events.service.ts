import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShipmentEvent } from "../entities/shipment-event.entity";
import { Repository } from "typeorm";
import { ShipmentStatus } from "../enums/shipment-status.enum";
import { Shipment } from "../entities/shipment.entity";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class ShipmentEventsService {
  constructor(
    @InjectRepository(ShipmentEvent)
    private readonly shipmentEventRepo: Repository<ShipmentEvent>,
  ) {}

  async create(
    shipment: Shipment,
    user: User,
    status: ShipmentStatus,
    location: string,
    notes?: string,
  ): Promise<void> {
    const event = this.shipmentEventRepo.create({
      shipment,
      user,
      status,
      location,
      notes,
    });

    await this.shipmentEventRepo.save(event);
  }
}