import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerService } from './shortener.service';
import { PrismaService } from '../infra/database/prisma.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('nanoid', () => ({
  __esModule: true,
  nanoid: () => 'abc123',
}));

describe('ShortenerService', () => {
  let service: ShortenerService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    prisma = {
      shortUrl: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
      } as any,
    } as unknown as jest.Mocked<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShortenerService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ShortenerService>(ShortenerService);
  });

  describe('createShortUrl', () => {
    it('should create and return a short URL', async () => {
      (prisma.shortUrl.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.shortUrl.create as jest.Mock).mockResolvedValue({
        id: '1',
        shortCode: 'abc123',
        originalUrl: 'https://example.com',
      } as any);

      const result = await service.createShortUrl(
        { originalUrl: 'https://example.com' },
        'user-id',
      );

      expect(result).toEqual({
        id: '1',
        shortUrl: 'http://localhost:3000/abc123',
        originalUrl: 'https://example.com',
      });
    });
  });

  describe('getOriginalUrl', () => {
    it('should return original URL and increment click count', async () => {
      (prisma.shortUrl.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        originalUrl: 'https://example.com',
        deletedAt: null,
      } as any);
      (prisma.shortUrl.update as jest.Mock).mockResolvedValue({} as any);

      const result = await service.getOriginalUrl('abc123');
      expect(result).toBe('https://example.com');
    });

    it('should throw NotFoundException if not found or deleted', async () => {
      (prisma.shortUrl.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getOriginalUrl('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('listUserUrls', () => {
    it('should return user URLs', async () => {
      const data = [
        { id: '1', shortCode: 'a1', originalUrl: 'https://a.com', clickCount: 0, createdAt: new Date(), updatedAt: new Date() },
      ];
      (prisma.shortUrl.findMany as jest.Mock).mockResolvedValue(data);

      const result = await service.listUserUrls('user-id');
      expect(result).toEqual(data);
    });
  });

  describe('updateUserUrl', () => {
    it('should update URL if owned by user', async () => {
      (prisma.shortUrl.findFirst as jest.Mock).mockResolvedValue({ id: '1' } as any);
      (prisma.shortUrl.update as jest.Mock).mockResolvedValue({ id: '1', originalUrl: 'https://updated.com', updatedAt: new Date() } as any);

      const result = await service.updateUserUrl('1', 'user-id', 'https://updated.com');
      expect(result.originalUrl).toBe('https://updated.com');
    });

    it('should throw NotFoundException if URL not found or not owned', async () => {
      (prisma.shortUrl.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.updateUserUrl('1', 'user-id', 'https://fail.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUserUrl', () => {
    it('should soft delete URL if owned by user', async () => {
      (prisma.shortUrl.findFirst as jest.Mock).mockResolvedValue({ id: '1' } as any);
      (prisma.shortUrl.update as jest.Mock).mockResolvedValue({ id: '1', deletedAt: new Date() } as any);

      const result = await service.deleteUserUrl('1', 'user-id');
      expect(result).toHaveProperty('deletedAt');
    });

    it('should throw NotFoundException if URL not found or not owned', async () => {
      (prisma.shortUrl.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUserUrl('1', 'user-id')).rejects.toThrow(NotFoundException);
    });
  });
});
