import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../infra/database/prisma.service';
import { nanoid } from 'nanoid';
import { ShortUrlResponseDto } from './dtos/responses/short-url-response.dto';
import { ShortenUrlDto } from './dtos/requests/shorten-url.dto';
import { UserUrlDto } from './dtos/responses/user-url.dto';
import { UpdateUrlResponseDto } from './dtos/responses/update-url-response.dto';
import { DeleteUrlResponseDto } from './dtos/responses/delete-url-response.dto';

@Injectable()
export class ShortenerService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createShortUrl(body: ShortenUrlDto, userId: string | null): Promise<ShortUrlResponseDto> {
    const shortCode = await this.generateUniqueCode();
    const { originalUrl} = body;
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

  async listUserUrls(userId: string): Promise<UserUrlDto[]> {
    return this.prisma.shortUrl.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserUrl(id: string, userId: string, newUrl: string): Promise<UpdateUrlResponseDto> {
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
  
  async deleteUserUrl(id: string, userId: string): Promise<DeleteUrlResponseDto> {
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
