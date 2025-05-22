import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from './dtos/responses/user-response.dto';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { LoginDto } from './dtos/requests/login.dto';
import { RegisterDto } from './dtos/requests/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(body: LoginDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (user && await bcrypt.compare(body.password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<AuthResponseDto> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(body: RegisterDto): Promise<UserResponseDto> { 
    const hash = await bcrypt.hash(body.password, 10);
    const user = await this.usersService.create({ email: body.email, password: hash });
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}

