
import { ShipmentStatus } from "../enums/shipment-status.enum";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/base.entity";

@Entity('shipments')
export class Shipment extends BaseEntity {
  @Column({ 
    type: 'enum',
    enum: ShipmentStatus,
    default: ShipmentStatus.CREATED,
  })
  status!: ShipmentStatus;

  @Column({ unique: true })
  trackingCode!: string;
  
  @Column({ type: 'decimal' })
  weight!: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  deliveredAt?: Date;

  @Column()
  originAddress!: string;

  @Column()
  destinationAddress!: string;

  @Column()
  recipientName!: string;

  @Column({ nullable: true })
  recipientPhone?: string;
}