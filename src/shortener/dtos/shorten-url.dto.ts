// shorten-url.dto.ts
import { IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsUrl()
  originalUrl: string;
}
