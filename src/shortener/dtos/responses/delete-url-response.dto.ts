export class DeleteUrlResponseDto {
    id: string;
    shortCode: string;
    originalUrl: string;
    clickCount: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    userId: string | null;
  }
  