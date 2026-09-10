import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  create(
    email: string,
    passwordHash: string,
    role: UserRole,
    name: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      email,
      passwordHash,
      role,
      name,
    });
    return this.userRepository.save(user);
  }

  findSupervisor(): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        role: UserRole.SUPERVISOR,
      },
    });
  }
}
