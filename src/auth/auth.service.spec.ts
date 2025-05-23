import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/requests/login.dto';
import { RegisterDto } from './dtos/requests/register.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user data if password matches', async () => {
      const user = { id: '1', email: 'test@example.com', password: await bcrypt.hash('pass123', 10) };
      usersService.findByEmail!.mockResolvedValue(user);

      const result = await authService.validateUser({ email: 'test@example.com', password: 'pass123' });

      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      usersService.findByEmail!.mockResolvedValue(null);

      const result = await authService.validateUser({ email: 'notfound@example.com', password: 'pass123' });

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = { id: '1', email: 'test@example.com', password: await bcrypt.hash('otherpass', 10) };
      usersService.findByEmail!.mockResolvedValue(user);

      const result = await authService.validateUser({ email: 'test@example.com', password: 'wrongpass' });

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a signed JWT token', async () => {
      jwtService.sign!.mockReturnValue('signed-token');

      const result = await authService.login({ id: '1', email: 'test@example.com' });

      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });

  describe('register', () => {
    it('should hash password and return user data without password', async () => {
      const createdUser = { id: '1', email: 'test@example.com', password: 'hashed' };
      usersService.create!.mockResolvedValue(createdUser);

      const result = await authService.register({ email: 'test@example.com', password: 'plainpass' });

      expect(result).toHaveProperty('id', '1');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
    });
  });
});
