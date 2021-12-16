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
    if (body.url.length > 0) {
      data.resource = MemeResource.URL;
      delete data.file;
    }
    if (file) {
      data.resource = MemeResource.PATH;
      delete data.url;
      const path =
        'https://firebasestorage.googleapis.com/v0/b/kpopop-6c8e3.appspot.com/o/' +
        uuid +
        '?alt=media&token=' +
        uuid;
      data.path = path;
    }

    return this.memeService.createMeme(data);
  }
}
