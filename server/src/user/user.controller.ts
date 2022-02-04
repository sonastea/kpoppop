import { User } from '@prisma/client';
import { UserService } from './user.service';
import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { RecaptchaGuard } from 'src/auth/guards/recaptcha.guard';
import * as dotenv from 'dotenv';
import { LoginSessionGuard } from 'src/auth/guards/login-session.guard';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { LocalSerializer } from 'src/auth/serializers/local.serializer';

dotenv.config();

@Controller('user')
@UseInterceptors(LocalSerializer)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RecaptchaGuard)
  @Post('register')
  async signupUser(
    @Res() res: Response,
    @Body() data: { username: string; password: string; email: string; recaptcha: string }
  ): Promise<User | object> {
    const { recaptcha, ...newData } = data;
    const user = await this.userService.createUser(newData);
    // Check if user is valid
    if (user['errors']) {
      return res.status(200).json(user);
    } else {
      console.log(user);
      res.status(201).json(user);
    }
  }

  @UseGuards(LoginSessionGuard)
  @Post('login')
  async loginUser(@Req() req: Request): Promise<any> {
    return req.user;
  }

  @UseGuards(SessionGuard)
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<any> {
    return req.user;
  }

  @UseGuards(SessionGuard)
  @HttpCode(205)
  @Post('logout')
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('connect.sid').end();
  }
}
