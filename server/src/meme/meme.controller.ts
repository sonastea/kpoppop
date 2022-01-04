import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import path = require('path');
import { Request } from 'express';
import { randomUUID } from 'crypto';
import * as firebase from 'firebase-admin';
import { MemeService } from './meme.service';
import { Meme, MemeResource } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

let baseUrl: string = null;

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://images.kpoppop.com/';
} else {
  baseUrl = 'https://test.kpoppop.com/';
}

@Controller('meme')
export class MemeController {
  constructor(private readonly memeService: MemeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  @UseInterceptors(FileInterceptor('file'))
  async createMeme(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; url?: string; files?: FileList },
    @Req() req: Request
  ): Promise<any> {
    let data: any = { ...body, authorId: req.user['_id'] };
    data.resource = MemeResource.URL;

    if (body.url.length > 0) {
      data.url = body.url;
      delete data.file;
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

    return this.memeService.createMeme(data, {
      author: {
        select: { username: true },
      },
      active: true,
      authorId: true,
      id: true,
      title: true,
      url: true,
      path: false,
      resource: false,
    });
  }

  @Post('posts')
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
          path: false,
          resource: false,
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
          path: false,
          resource: false,
        },
      });
    }
  }

  @Get(':id')
  getMeme(@Param('id') id: string): Promise<Meme | null> {
    return this.memeService.post(
      {
        id: parseInt(id),
      },
      {
        author: {
          select: { username: true },
        },
      }
    );
  }

  @Get('likes/:id')
  getTotalLikes(@Param('id') id: string): Promise<any> {
    return this.memeService.totalLikes({ where: { id: parseInt(id) } });
  }

  @UseGuards(JwtAuthGuard)
  @Get('liked/:id')
  getUserLike(@Param('id') id: string, @Req() req: Request): Promise<any> {
    return this.memeService.likedMeme({
      where: {
        id: parseInt(id),
      },
      user: {
        id: req.user['_id'],
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('like/:id')
  likeMeme(@Param('id') id: string, @Req() req: Request): Promise<any> {
    return this.memeService.likeMeme({
      where: { id: parseInt(id) },
      user: { id: req.user['_id'] },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('like/:id')
  unlikeMeme(@Param('id') id: string, @Req() req: Request): Promise<any> {
    return this.memeService.unlikeMeme({
      where: { id: parseInt(id) },
      user: { id: req.user['_id'] },
    });
  }
}
