import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/base.entity";
import { UserRole } from "../enums/user-role.enum";

@Entity('users')
export class User extends BaseEntity { 
  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ 
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole;

  @Column()
  name!: string;
}