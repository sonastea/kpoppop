import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { LoginSessionGuard } from 'src/auth/guards/login-session.guard';
import { LocalSerializer } from 'src/auth/serializers/local.serializer';
import { RecaptchaGuard } from 'src/auth/guards/recaptcha.guard';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import path = require('path');
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
  @Get('profile/settings')
  async getUserSettings(@Session() session: Record<string, any>): Promise<any> {
    return this.userService.getUserProfile({ id: session.passport.user.id });
  }

  @UseGuards(SessionGuard)
  @HttpCode(205)
  @Post('logout')
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('connect.sid').end();
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
    const { id } = req.session.passport.user;
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
    const user = await this.userService.updateProfile({ id }, data);
    return res.json(user);
  }

  @Get(':name')
  async getUser(@Res() res: Response, @Param('name') username: string): Promise<any> {
    const user = await this.userService.getUser({ username });

    if (user['errors']) {
      return res.status(200).json(user).end();
    }
    return res.json(user);
  }

  @UseGuards(SessionGuard)
  @Put('add_social')
  @UseInterceptors(FileInterceptor('file'))
  async addSocialMediaLink(@Req() req: Request, @UploadedFile() _file: Express.Multer.File): Promise<any> {
    const { id } = req.session.passport.user;
    const data: SocialMediaLinkData = { ...req.body };
    const socialLink = await this.userService.addSocialMediaLink({ ...data, user: { connect: { id } } });
    return socialLink;
  }

  @UseGuards(SessionGuard)
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
}
