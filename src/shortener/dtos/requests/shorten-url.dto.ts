import { IsUrl } from 'class-validator';

export class ShortenUrlDto {
  @IsUrl({}, { message: 'originalUrl must be a valid URL' })
  originalUrl: string;
}
