import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialSupervisorService } from './initial-supervisor.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, InitialSupervisorService],
  exports: [UsersService],
})
export class UsersModule {}
