import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  Res,
  Session,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { Prisma, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { LoginSessionGuard } from 'src/auth/guards/login-session.guard';
import { RecaptchaGuard } from 'src/auth/guards/recaptcha.guard';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { LocalSerializer } from 'src/auth/serializers/local.serializer';
import { PrismaService } from 'src/database/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { UserService } from './user.service';
import path = require('path');
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

dotenv.config();

let baseUrl: string = null;

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://images.kpoppop.com/';
} else {
  baseUrl = 'https://test.kpoppop.com/';
}

type UpdateProfileData = {
  displayname: string;
  banner: string;
  photo: string;
};

type SocialMediaLinkData = {
  title?: string;
  url: string;
};

export type RegisterUserData = {
  id?: number;
  createdAt?: Date;
  username?: string;
  email?: string;
  displayname?: string;
  role?: string;
  errors?: { User: string };
};

@Controller('user')
@UseGuards(ThrottlerGuard)
@UseInterceptors(LocalSerializer)
export class UserController {
  constructor(
    private readonly userService: UserService,
    // private readonly mailService: MailService,
    private readonly prisma: PrismaService
  ) { }

  @UseGuards(RecaptchaGuard)
  @Post('register')
  async signupUser(
    @Res() res: Response,
    @Body() data: { username: string; password: string; email: string; recaptcha: string }
  ): Promise<User | RegisterUserData | object> {
    const { recaptcha, ...newData } = data;
    const user = await this.userService.createUser(newData);
    // Check if user is valid
    if (user['errors']) {
      return res.status(200).json(user);
    } else {
      console.log(user);
      // this.mailService.sendVerificationLink(user.email);
      res.status(201).json(user);
    }
  }

  @UseGuards(LoginSessionGuard)
  @Post('login')
  async loginUser(@Req() req: Request): Promise<any> {
    return req.user;
  }

  @UseGuards(SessionGuard)
  @Get('profile/settings')
  async getUserSettings(@Session() session: Record<string, any>): Promise<any> {
    const { id, discordId } = session.passport.user;
    if (id) return this.userService.getUserProfile({ id });
    else return this.userService.getUserProfile({ discordId });
  }

  @UseGuards(SessionGuard)
  @HttpCode(205)
  @Post('logout')
  async logout(@Res() res: Response): Promise<any> {
    res
      .clearCookie('connect.sid', {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: true,
        domain: process.env.NODE_ENV === 'production' ? '.kpoppop.com' : null,
        sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
      })
      .end();
  }

  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'photo', maxCount: 1 },
    ])
  )
  @HttpCode(200)
  @Post('update_profile')
  async updateProfile(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles() files: { banner?: Express.Multer.File[]; photo?: Express.Multer.File[] }
  ): Promise<any> {
    const { id, discordId } = req.session.passport.user;
    const data: UpdateProfileData = { ...req.body };

    for (const key in files) {
      const uuid = randomUUID();
      const fileName = uuid + path.extname(files[key][0].originalname);
      const url = baseUrl + fileName;
      data[key] = url;

      firebase
        .storage()
        .bucket()
        .file(fileName)
        .save(files[key][0].buffer, {
          metadata: {
            metadata: {
              contentType: files[key][0].mimetype,
            },
          },
        });
    }

    for (const key in data) {
      if (data[key] === 'undefined' && key !== 'displayname') {
        delete data[key];
      }
    }

    let user;
    if (id) user = await this.userService.updateProfile({ id }, data);
    if (discordId) user = await this.userService.updateProfile({ discordId }, data);
    return res.json(user);
  }

  @Get(':name')
  @SkipThrottle()
  async getUser(@Res() res: Response, @Param('name') username: string): Promise<any> {
    const user = await this.userService.getUser({ username });

    if (user['errors']) {
      return res.status(200).json(user).end();
    }
    return res.json(user);
  }

  @UseGuards(SessionGuard)
  @SkipThrottle()
  @Put('add_social')
  @UseInterceptors(FileInterceptor('file'))
  async addSocialMediaLink(
    @Req() req: Request,
    @UploadedFile() _file: Express.Multer.File
  ): Promise<any> {
    const { id, discordId } = req.session.passport.user;
    const data: SocialMediaLinkData = { ...req.body };
    if (id) {
      return await this.userService.addSocialMediaLink({
        ...data,
        user: { connect: { id } },
      });
    }
    if (discordId) {
      const user = await this.prisma.discordUser.findUnique({ where: { discordId } });
      const u = await this.userService.addSocialMediaLink({
        ...data,
        user: { connect: { id: user.userId } },
      });
      return u;
    }
  }

  @UseGuards(SessionGuard)
  @SkipThrottle()
  @Delete('delete_social')
  async deleteSocialMediaLink(@Req() req: Request, @Res() res: Response): Promise<any> {
    const { uuid } = req.body;
    const result = await this.userService.deleteSocialMediaLink({ uuid });

    if (result.uuid === uuid) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN')
  @SkipThrottle()
  @Put('mod_user')
  async modUser(@Res() res: Response, @Body() data: { username: string }): Promise<any> {
    console.log(data);
    const updatedUser = await this.prisma.user.update({
      where: { username: data.username },
      data: { role: 'MODERATOR' },
    });
    res.json(updatedUser);
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN')
  @SkipThrottle()
  @Put('unmod_user')
  async unmodUser(@Res() res: Response, @Body() data: { username: string }): Promise<any> {
    const updatedUser = await this.prisma.user.update({
      where: { username: data.username },
      data: { role: 'USER' },
    });
    res.json(updatedUser);
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN')
  @SkipThrottle()
  @Put('ban_user')
  async banUser(@Res() res: Response, @Body() data: { username: string }): Promise<any> {
    const bannedUser = await this.prisma.user.delete({
      where: { username: data.username },
    });
    res.json(bannedUser);
  }
}
