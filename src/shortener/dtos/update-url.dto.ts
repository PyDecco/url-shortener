import { IsUrl } from 'class-validator';

export class UpdateShortUrlDto {
  @IsUrl({}, { message: 'originalUrl must be a valid URL' })
  originalUrl: string;
}