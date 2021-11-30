import { Controller, Get, Req, UseFilters, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from './guards/jwtRefresh-auth.guard';
import { Request } from 'express';
import { UnauthorizedFilter } from './filters/unauthorized.filter';

@Controller('auth')
export class AuthController {
  constructor() {}

  @UseGuards(JwtRefreshAuthGuard)
  @UseFilters(UnauthorizedFilter)
  @Get('refresh-token')
  async refreshToken(@Req() req: Request): Promise<any> {
    return req.user;
  }
}
