import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/base.entity";
import { ShipmentStatus } from "../enums/shipment-status.enum";
import { Shipment } from "./shipment.entity";
import { User } from "../../users/entities/user.entity";

@Entity('shipment_events')
export class ShipmentEvent extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ShipmentStatus,
  })
  status!: ShipmentStatus;
  
  @Column()
  location!: string;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Shipment, shipment => shipment.events)
  shipment!: Shipment;

  @ManyToOne(() => User)
  user!: User;
}