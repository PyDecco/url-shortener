import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Req,
    Patch,
    Delete,
    UseGuards,
    Res,
  } from '@nestjs/common';
import { ShortenerService } from './shortener.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response, Request } from 'express';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
  
  @Controller()
  export class ShortenerController {
    constructor(private readonly shortenerService: ShortenerService) {}
  
    @UseGuards(OptionalAuthGuard)
    @Post('shorten')
    async shortenUrl(@Body() body: ShortenUrlDto, @Req() req: Request) {
      const user = req.user as any;
      return this.shortenerService.createShortUrl(body.originalUrl, user?.userId);
    }
    
    @Get(':shortCode')
    async redirect(@Param('shortCode') code: string, @Res() res: Response) {
      const originalUrl = await this.shortenerService.getOriginalUrl(code);
      return res.redirect(originalUrl);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me/urls')
    async listUrls(@Req() req: Request) {
      const user = req.user as any;
      return this.shortenerService.listUserUrls(user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me/urls/:id')
    async updateUrl(
      @Param('id') id: string,
      @Body() body: ShortenUrlDto,
      @Req() req: Request,
    ) {
      const user = req.user as any;
      return this.shortenerService.updateUserUrl(id, user.userId, body.originalUrl);
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete('me/urls/:id')
    async deleteUrl(@Param('id') id: string, @Req() req: Request) {
      const user = req.user as any;
      return this.shortenerService.deleteUserUrl(id, user.userId);
    }
  }
  