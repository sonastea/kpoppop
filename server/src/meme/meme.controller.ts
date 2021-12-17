import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { MemeService } from './meme.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MemeResource } from '@prisma/client';
import * as firebase from 'firebase-admin';
import { randomUUID } from 'crypto';

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
    const uuid = randomUUID();
    firebase
      .storage()
      .bucket()
      .file(uuid)
      .save(file.buffer, {
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuid,
            contentType: file.mimetype,
          },
        },
      });
    let data: any = { ...body, authorId: req.user['_id'] };
    data.resource = MemeResource.URL;
    if (body.url.length > 0) {
      delete data.file;
    }
    if (file) {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/kpopop-6c8e3.appspot.com/o/' +
        uuid +
        '?alt=media&token=' +
        uuid;
      data.url = url;
    }

    return this.memeService.createMeme(data, {
      id: true,
      title: true,
      url: true,
      path: false,
      resource: false,
      author: {
        select: { username: true },
      },
      authorId: true,
      active: true,
    });
  }
}
