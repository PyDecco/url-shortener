import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../infra/database/prisma.service';
import { nanoid } from 'nanoid';

@Injectable()
export class ShortenerService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um código único de até 6 caracteres
  private async generateUniqueCode(): Promise<string> {
    let code: string;
    let exists = true;

    do {
      code = nanoid(6);
      const existing = await this.prisma.shortUrl.findUnique({
        where: { shortCode: code },
      });
      exists = !!existing;
    } while (exists);

    return code;
  }

  // Cria uma URL encurtada
  async createShortUrl(originalUrl: string, userId?: string) {
    const shortCode = await this.generateUniqueCode();

    const record = await this.prisma.shortUrl.create({
      data: {
        originalUrl,
        shortCode,
        userId: userId || null,
      },
    });

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return {
      id: record.id,
      shortUrl: `${baseUrl}/${shortCode}`,
      originalUrl: record.originalUrl,
    };
  }

  // Redirecionamento e contabilização de clique
  async getOriginalUrl(shortCode: string): Promise<string> {
    const record = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!record || record.deletedAt) {
      throw new NotFoundException('URL not found or deleted');
    }

    await this.prisma.shortUrl.update({
      where: { id: record.id },
      data: { clickCount: { increment: 1 } },
    });

    return record.originalUrl;
  }

  // Listar URLs do usuário autenticado
  async listUserUrls(userId: string) {
    return this.prisma.shortUrl.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Atualizar uma URL do usuário
  async updateUserUrl(id: string, userId: string, newUrl: string) {
    const record = await this.prisma.shortUrl.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!record) {
      throw new NotFoundException('URL not found or not yours');
    }

    return this.prisma.shortUrl.update({
      where: { id },
      data: { originalUrl: newUrl },
    });
  }

  // Soft delete de URL
  async deleteUserUrl(id: string, userId: string) {
    const record = await this.prisma.shortUrl.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!record) {
      throw new NotFoundException('URL not found or not yours');
    }

    return this.prisma.shortUrl.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
