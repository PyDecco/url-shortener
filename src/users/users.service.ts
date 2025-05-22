import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, password: string): Promise<User> {
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
