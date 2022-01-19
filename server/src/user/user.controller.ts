import { User } from '@prisma/client';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RecaptchaGuard } from 'src/auth/guards/recaptcha.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @UseGuards(RecaptchaGuard)
  @Post('register')
  async signupUser(
    @Body() data: { username: string; password: string; email: string; recaptcha: string },
    @Res({ passthrough: true }) res: Response
  ): Promise<User | object> {
    const { recaptcha, ...newData } = data;
    const user = await this.userService.createUser(newData);
    // Check if user is valid
    console.log(user);
    if (user['errors']) {
      return user;
    } else {
      const token = await this.authService.getTokens(user);
      res.cookie('accessToken', token.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      res.cookie('refreshToken', token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      user['path'] = '/';
      return user;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    const token = await this.authService.getTokens(req.user);
    await this.userService.setRefreshToken(token.refreshToken, req.user['username']);
    res.cookie('accessToken', token.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.json({ message: 'Successful login', path: '/' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  // The 'user' object is created at `jwt-strategy`.validate with parameters
  // that are passed here and sent to the user.
  async getProfile(@Req() req: Request): Promise<any> {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request): Promise<any> {
    await this.userService.removeRefreshToken(req.user['username']);
    req.res.clearCookie('accessToken');
    req.res.clearCookie('refreshToken');
    return { path: '/' };
  }
}
