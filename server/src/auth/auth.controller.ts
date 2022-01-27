import { Controller, Get, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from './guards/jwtRefresh-auth.guard';
import { Request, Response } from 'express';
import { UnauthorizedFilter } from './filters/unauthorized.filter';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CheckUserFilter } from './filters/checkuser.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtRefreshAuthGuard)
  @UseFilters(UnauthorizedFilter)
  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
    const newAccessToken = await this.authService.getAccessToken(req.user);
    const newRefreshToken = await this.authService.getRefreshToken(req.user);
    res.cookie('access_token', newAccessToken, {
      httpOnly: false,
      secure: true,
    });
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res.json(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @UseFilters(CheckUserFilter)
  @Get('check-user')
  async checkUser(@Req() req: Request): Promise<any> {
    return req.user;
  }
}
