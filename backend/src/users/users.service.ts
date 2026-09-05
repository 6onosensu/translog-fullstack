import { Injectable } from '@nestjs/common';
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
      where: { email }
    });
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
 
}
