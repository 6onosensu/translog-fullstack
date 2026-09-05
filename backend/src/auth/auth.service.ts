import { 
  ConflictException, 
  Injectable, 
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  
  async register(dto: RegisterDto): Promise<void> {
    const user = await this.getUser(dto.email);

    if (user) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    await this.usersService.create(
      dto.email,
      passwordHash,
      dto.role,
      dto.name,
    );
  }

  async login(dto: LoginDto): Promise<{ accessToken: string}> {
    const user = await this.validateCredentials(dto);
    const accessToken = await this.generateToken(user);

    return { accessToken };
  }


  private getUser(email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  private async validateCredentials(loginDto: LoginDto): Promise<User> {
    const user = await this.getUser(loginDto.email);

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  private generateToken(user: User): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
