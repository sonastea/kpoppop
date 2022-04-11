import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import path = require('path');
import { randomUUID } from 'crypto';
import * as firebase from 'firebase-admin';
import { Response } from 'express';
import { MemeService } from './meme.service';
import { Meme, MemeResource } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';

let baseUrl: string = null;

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://images.kpoppop.com/';
} else {
  baseUrl = 'https://test.kpoppop.com/';
}

@Controller('meme')
@UseGuards(ThrottlerGuard)
export class MemeController {
  constructor(private readonly memeService: MemeService) {}

  @UseGuards(SessionGuard)
  @Throttle(300, 5)
  @UseInterceptors(FileInterceptor('file'))
  @Post('submit')
  async createMeme(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; url?: string; files?: FileList; flagged: Boolean },
    @Session() session: Record<string, any>,
    @Res() res: Response
  ): Promise<any> {
    let data: any = { ...body, authorId: session.passport.user.id };
    data.resource = MemeResource.URL;

    if (body.url.length > 0) {
      data.url = body.url;
      delete data.file;
    }

    // Parse flagged into a boolean
    if (data.flagged === 'true') {
      data.flagged = true;
      data.active = false;
    } else {
      data.flagged = false;
    }

    if (file) {
      const uuid = randomUUID();
      const fileName = uuid + path.extname(file.originalname);
      const url = baseUrl + fileName;

      firebase
        .storage()
        .bucket()
        .file(fileName)
        .save(file.buffer, {
          metadata: {
            metadata: {
              contentType: file.mimetype,
            },
          },
        });
      data.url = url;
    }

    const meme = await this.memeService.createMeme(data, {
      author: {
        select: { username: true },
      },
      flagged: true,
      authorId: true,
      id: true,
      title: true,
      url: true,
    });

    if (meme) {
      return res.status(201).json(meme);
    } else {
      return res.status(502);
    }
  }

  @Post('posts')
  @SkipThrottle()
  async getMemes(@Body() body: { cursor: number }): Promise<any> {
    if (body.cursor === 0) {
      return await this.memeService.posts({
        take: 7,
        orderBy: {
          id: 'desc',
        },
        select: {
          author: {
            select: { username: true },
          },
          active: true,
          authorId: true,
          id: true,
          title: true,
          url: true,
        },
        where: {
          active: { equals: true },
          flagged: { equals: false },
        },
      });
    } else {
      return await this.memeService.posts({
        cursor: {
          id: body.cursor,
        },
        skip: 1,
        take: 7,
        orderBy: {
          id: 'desc',
        },
        select: {
          author: {
            select: { username: true },
          },
          active: true,
          authorId: true,
          id: true,
          title: true,
          url: true,
        },
        where: {
          active: { equals: true },
          flagged: { equals: false },
        },
      });
    }
  }

  @Get(':id')
  @SkipThrottle()
  getMeme(@Param('id') id: string): Promise<Meme | null> {
    return this.memeService.post({
      where: {
        id: parseInt(id),
        active: { equals: true },
        flagged: { equals: false },
      },
      select: {
        author: {
          select: { username: true },
        },
        id: true,
        title: true,
        url: true,
      },
    });
  }

  @Get('likes/:id')
  @SkipThrottle()
  getTotalLikes(@Param('id') id: string): Promise<any> {
    return this.memeService.totalLikes({ where: { id: parseInt(id) } });
  }

  @Get('liked/:id')
  getUserLike(@Param('id') id: string, @Session() session: Record<string, any>): Promise<any> {
    return this.memeService.likedMeme({
      where: {
        id: parseInt(id),
      },
      user: {
        id: session.passport.user.id,
      },
    });
  }

  @UseGuards(SessionGuard)
  @Put('like/:id')
  likeMeme(@Param('id') id: string, @Session() session: Record<string, any>): Promise<any> {
    return this.memeService.likeMeme({
      where: { id: parseInt(id) },
      user: session.passport.user.id,
    });
  }

  @UseGuards(SessionGuard)
  @Delete('like/:id')
  unlikeMeme(@Param('id') id: string, @Session() session: Record<string, any>): Promise<any> {
    return this.memeService.unlikeMeme({
      where: { id: parseInt(id) },
      user: session.passport.user.id,
    });
  }
}
