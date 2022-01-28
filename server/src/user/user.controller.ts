import { User } from '@prisma/client';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RecaptchaGuard } from 'src/auth/guards/recaptcha.guard';
import { AuthService } from 'src/auth/auth.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @UseGuards(RecaptchaGuard)
  @Post('register')
  async signupUser(
    @Res() res: Response,
    @Body() data: { username: string; password: string; email: string; recaptcha: string }
  ): Promise<User | object> {
    const { recaptcha, ...newData } = data;
    const user = await this.userService.createUser(newData);
    const tokens = await this.authService.login(user);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: false,
      secure: true,
      domain:
        process.env.NODE_ENV === 'production' ? '.kpoppop.com' : '.localhost',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      domain:
        process.env.NODE_ENV === 'production' ? '.kpoppop.com' : '.localhost',
    });
    // Check if user is valid
    console.log(user);
    if (user['errors']) {
      return null;
    } else {
      user['path'] = '/';
      return res.status(201).json(user);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Req() req: Request, @Res() res: Response): Promise<any> {
    const tokens = await this.authService.login(req.user);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: false,
      secure: true,
      domain:
        process.env.NODE_ENV === 'production' ? '.kpoppop.com' : '.localhost',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      domain:
        process.env.NODE_ENV === 'production' ? '.kpoppop.com' : '.localhost',
    });
    return res.status(201).json({ message: 'Successful login', path: '/' });
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
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    await this.userService.removeRefreshToken(req.user['username']);
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      domain:
        process.env.NODE_ENV === 'production' ? '.kpoppop.com' : '.localhost',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      domain:
        process.env.NODE_ENV === 'production' ? '.kpoppop.com' : '.localhost',
    });
    return res.json({ sub: null, username: null, role: null, isLoggedIn: false });
  }
}
