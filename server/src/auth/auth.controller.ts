import { Controller, Get, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from './guards/jwtRefresh-auth.guard';
import { Request, Response } from 'express';
import { UnauthorizedFilter } from './filters/unauthorized.filter';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CheckUserFilter } from './filters/checkuser.filter';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @UseGuards(JwtRefreshAuthGuard)
  @UseFilters(UnauthorizedFilter)
  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
    const newRefreshToken = await this.authService.getRefreshToken(req.user['username']);
    const newAccessToken = await this.authService.getAccessToken({
      sub: req.user['id'],
      username: req.user['username']
    });
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    await this.userService.setRefreshToken(newRefreshToken, req.user['username']);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @UseFilters(CheckUserFilter)
  @Get('check-user')
  async checkUser(@Req() req: Request): Promise<any> {
    return req.user;
  }

}
