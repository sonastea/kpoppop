import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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
import { Role, User } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { LoginSessionGuard } from 'src/auth/guards/login-session.guard';
import { RecaptchaGuard } from 'src/auth/guards/recaptcha.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { LocalSerializer } from 'src/auth/serializers/local.serializer';
import { PrismaService } from 'src/database/prisma.service';
/* import { MailService } from 'src/mail/mail.service'; */
import { UserService } from './user.service';
import path = require('path');

dotenv.config();

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
  ) {}

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

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://images.kpoppop.com/'
        : 'https://test.kpoppop.com/';

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
      if (data[key] === '' && key === 'displayname') {
        data[key] = null;
      }
    }

    let user: User;
    if (id) user = await this.userService.updateProfile({ id }, data);
    if (discordId) user = await this.userService.updateProfile({ discordId }, data);
    return res.json(user);
  }

  @Get('exists-:name')
  @SkipThrottle()
  async getUserExists(@Res() res: Response, @Param('name') username: string): Promise<any> {
    const user = await this.userService.getUser({ username });

    if (user['errors']) {
      return res.status(200).json(user).end();
    }

    const { banner, createdAt, role, memes, socialMedias, _count, ...strippedUser } = user;
    return res.json(strippedUser);
  }

  @Get('id-:id')
  @SkipThrottle()
  async getUserById(@Res() res: Response, @Param('id') userID: string): Promise<any> {
    if (userID === undefined) return res.status(400).send('Invalid url request').end();

    const id = parseInt(userID, 10);
    const user = await this.userService.getUser({ id });

    if (user['errors']) {
      return res.status(200).json(user).end();
    }

    const { banner, createdAt, role, memes, socialMedias, _count, ...strippedUser } = user;
    return res.json(strippedUser);
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

  @UseGuards(SessionGuard)
  @Post('report_comment')
  async reportComment(
    @Res() res: Response,
    @Body() body: { commentId: number; description: string },
    @Session() session: Record<string, any>
  ): Promise<any> {
    const { commentId, description } = body;

    // Check if user is logged in through local-account or discord
    const { id: reporterId, discordId: reporterDiscordId } = session.passport.user;
    let reporter: { id: number };
    if (reporterId) {
      reporter = { id: reporterId };
    } else {
      reporter = { id: reporterDiscordId };
      const user = await this.prisma.discordUser.findUnique({
        where: { discordId: reporterDiscordId },
      });
      reporter = { id: user.userId };
    }

    const reported = await this.userService.reportComment({
      description: description,
      comment: {
        connect: {
          id: commentId,
        },
      },
      reporter: {
        connect: reporter,
      },
    });

    if (reported.id) {
      res.json({ message: `You successfully reported the comment.` });
    } else {
      res.status(400).json({ message: 'Error processing your report' });
    }
  }

  @UseGuards(SessionGuard)
  @Post('report')
  async reportUser(
    @Res() res: Response,
    @Body() body: { user: { id: number; username: string }; description: string },
    @Session() session: Record<string, any>
  ): Promise<any> {
    const {
      user: { id, username },
      description,
    } = body;

    // Check if user is logged in through local-account or discord
    const { id: reporterId, discordId: reporterDiscordId } = session.passport.user;
    let reporter: { id: number };
    if (reporterId) {
      reporter = { id: reporterId };
    } else {
      reporter = { id: reporterDiscordId };
      const user = await this.prisma.discordUser.findUnique({
        where: { discordId: reporterDiscordId },
      });
      reporter = { id: user.userId };
    }

    const reported = await this.userService.reportUser({
      description: description,
      username: username,
      user: {
        connect: { id },
      },
      reporter: {
        connect: reporter,
      },
    });

    if (reported.id) {
      res.json({ message: `You successfully reported ${reported.username}.` });
    } else {
      res.status(400).json({ message: 'Error processing your report' });
    }
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN')
  @SkipThrottle()
  @Put('mod_user')
  async modUser(
    @Res() res: Response,
    @Body() data: { username?: string; userId?: number }
  ): Promise<any> {
    const { username, userId } = data;
    const moddedUser = await this.userService.modUser(
      { username: username, id: userId },
      { role: 'MODERATOR' },
      {
        id: true,
        username: true,
        status: true,
      }
    );
    res.json(moddedUser);
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN')
  @SkipThrottle()
  @Put('unmod_user')
  async unmodUser(
    @Res() res: Response,
    @Body() data: { username?: string; userId?: number }
  ): Promise<any> {
    const { username, userId } = data;
    const unmoddedUser = await this.userService.unmodUser(
      { username: username, id: userId },
      { role: 'USER' },
      {
        id: true,
        username: true,
        status: true,
      }
    );
    res.json(unmoddedUser);
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @SkipThrottle()
  @Put('ban_user')
  async banUser(
    @Res() res: Response,
    @Body() data: { name?: string; userId?: number }
  ): Promise<any> {
    // Check if suspect is an ADMIN, returns error
    const banSuspect = await this.userService.findOne({ id: data.userId });
    if (banSuspect.role === Role.ADMIN) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You do not have the authority to ban this person.',
        },
        HttpStatus.FORBIDDEN
      );
    }

    const bannedUser = await this.userService.banUser(
      { id: data.userId },
      { status: 'BANNED' },
      {
        id: true,
        username: true,
        status: true,
      }
    );
    res.json(bannedUser);
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @SkipThrottle()
  @Put('unban_user')
  async unbanUser(
    @Res() res: Response,
    @Body() data: { name?: string; userId?: number }
  ): Promise<any> {
    // Check if suspect is an ADMIN, returns error
    const banSuspect = await this.userService.findOne({ id: data.userId });
    if (banSuspect.role === Role.ADMIN) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You do not have the authority to ban this person.',
        },
        HttpStatus.FORBIDDEN
      );
    }

    const unbannedUser = await this.userService.unbanUser(
      { id: data.userId },
      { status: 'ACTIVE' },
      {
        id: true,
        username: true,
        status: true,
      }
    );
    res.json(unbannedUser);
  }
}
