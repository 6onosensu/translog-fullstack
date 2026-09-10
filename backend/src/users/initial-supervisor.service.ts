import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class InitialSupervisorService implements OnApplicationBootstrap {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const supervisor = await this.usersService.findSupervisor();
    if (supervisor) {
      return;
    }

    const email = this.configService.getOrThrow<string>(
      'INITIAL_SUPERVISOR_EMAIL',
    );
    const password = this.configService.getOrThrow<string>(
      'INITIAL_SUPERVISOR_PASSWORD',
    );
    const name = this.configService.getOrThrow<string>(
      'INITIAL_SUPERVISOR_NAME',
    );

    const passwordHash = await bcrypt.hash(password, 10);

    await this.usersService.create(
      email,
      passwordHash,
      UserRole.SUPERVISOR,
      name,
    );
  }
}
