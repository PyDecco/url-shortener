import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/database/prisma.service';
import { User } from '@prisma/client';
import { RegisterDto } from 'src/auth/dtos/requests/register.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: RegisterDto): Promise<User> {
    const { email, password } = body;
    return this.prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
