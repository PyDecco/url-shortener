import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/requests/login.dto';
import { RegisterDto } from './dtos/requests/register.dto';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { UserResponseDto } from './dtos/responses/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<UserResponseDto> {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authService.validateUser(body);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
