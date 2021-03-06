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
import { Comment, Meme, MemeResource } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaService } from 'src/database/prisma.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserProfileData } from 'src/user/user.service';

let baseUrl: string = null;

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://images.kpoppop.com/';
} else {
  baseUrl = 'https://test.kpoppop.com/';
}

@Controller('meme')
@UseGuards(ThrottlerGuard)
export class MemeController {
  constructor(private readonly memeService: MemeService, private readonly prisma: PrismaService) {}

  @UseGuards(SessionGuard)
  // @Throttle(300, 10)
  @SkipThrottle()
  @UseInterceptors(FileInterceptor('file'))
  @Post('submit')
  async createMeme(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; url?: string; files?: FileList; flagged: boolean },
    @Session() session: Record<string, any>,
    @Res() res: Response
  ): Promise<any> {
    let data: any;
    if (session.passport.user.id) {
      data = { ...body, authorId: session.passport.user.id };
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          discord: {
            discordId: session.passport.user.discordId,
          },
        },
        select: {
          id: true,
        },
      });
      data = { ...body, authorId: user.id };
    }
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
  async getMeme(@Param('id') id: string): Promise<Meme | object> {
    const meme = await this.memeService.post({
      where: {
        id: parseInt(id),
        active: { equals: true },
        flagged: { equals: false },
      },
      select: {
        author: {
          select: { id: true, username: true },
        },
        id: true,
        title: true,
        url: true,
      },
    });
    if (meme === null) return {};
    return meme;
  }

  @Get('likes/:id')
  @SkipThrottle()
  getTotalLikes(@Param('id') id: string): Promise<any> {
    return this.memeService.totalLikes({ where: { id: parseInt(id) } });
  }

  @Get('liked/:id')
  @SkipThrottle()
  async getUserLike(
    @Param('id') id: string,
    @Session() session: Record<string, any>
  ): Promise<any> {
    if (session.passport.user.id) {
      return this.memeService.likedMeme({
        where: {
          id: parseInt(id),
        },
        user: {
          id: session.passport.user.id,
        },
      });
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          discord: {
            discordId: session.passport.user.discordId,
          },
        },
      });
      return this.memeService.likedMeme({
        where: {
          id: parseInt(id),
        },
        user: {
          id: user.id,
        },
      });
    }
  }

  @UseGuards(SessionGuard)
  // @Throttle(60, 15)
  @SkipThrottle()
  @Put('like/:id')
  async likeMeme(@Param('id') id: string, @Session() session: Record<string, any>): Promise<any> {
    if (session.passport.user.id) {
      return await this.memeService.likeMeme({
        where: { id: parseInt(id) },
        user: { id: session.passport.user.id },
      });
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          discord: {
            discordId: session.passport.user.discordId,
          },
        },
        select: {
          id: true,
        },
      });
      return await this.memeService.likeMeme({
        where: { id: parseInt(id) },
        user: { id: user.id },
      });
    }
  }

  @UseGuards(SessionGuard)
  // @Throttle(60, 15)
  @SkipThrottle()
  @Delete('like/:id')
  async unlikeMeme(@Param('id') id: string, @Session() session: Record<string, any>): Promise<any> {
    if (session.passport.user.id) {
      return await this.memeService.unlikeMeme({
        where: { id: parseInt(id) },
        user: { id: session.passport.user.id },
      });
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          discord: {
            discordId: session.passport.user.discordId,
          },
        },
        select: {
          id: true,
        },
      });
      return await this.memeService.unlikeMeme({
        where: { id: parseInt(id) },
        user: { id: user.id },
      });
    }
  }

  // @Throttle(60, 15)
  @SkipThrottle()
  @Get('comment/:id')
  async getMemeComments(@Param('id') memeId: string): Promise<Comment[]> {
    return await this.memeService.comments({
      where: { id: parseInt(memeId) },
      select: {
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            text: true,
            createdAt: true,
            updatedAt: true,
            edited: true,
            user: {
              select: {
                ...UserProfileData,
              },
            },
          },
          where: {
            active: { equals: true },
          },
        },
      },
    });
  }

  @Get('comments/:id')
  @SkipThrottle()
  getTotalComments(@Param('id') id: string): Promise<any> {
    return this.memeService.totalComments({ where: { id: parseInt(id) } });
  }

  @UseGuards(SessionGuard)
  @SkipThrottle()
  @Post('comment/:id')
  async commentMeme(
    @Param('id') memeId: string,
    @Body() body: { comment: string },
    @Session() session: Record<string, any>
  ): Promise<any> {
    let user;
    if (session.passport.user.id) {
      user = {
        connect: { id: session.passport.user.id },
      };
    } else {
      const u = await this.prisma.user.findFirst({
        where: {
          discord: {
            discordId: session.passport.user.discordId,
          },
        },
        select: {
          id: true,
        },
      });
      user = {
        connect: { id: u.id },
      };
    }

    return await this.memeService.commentMeme({
      data: {
        text: body.comment,
        meme: {
          connect: { id: parseInt(memeId) },
        },
        user,
      },
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            ...UserProfileData,
          },
        },
      },
    });
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @SkipThrottle()
  @Put('delete/:id')
  async toggleComment(@Param('id') memeId: string): Promise<any> {
    return await this.memeService.toggleComment(parseInt(memeId));
  }

  @UseGuards(SessionGuard)
  @Delete('delete/:id')
  async deleteComment(
    @Param('id') commentId: string,
    @Session() session: Record<string, any>
  ): Promise<any> {
    let where;
    if (session.passport.user.id) {
      where = {
        id: session.passport.user.id,
      };
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          discord: {
            discordId: session.passport.user.discordId,
          },
        },
        select: {
          id: true,
        },
      });
      where = {
        id: user.id,
      };
    }

    return await this.memeService.deleteComment({
      where,
      select: {
        id: true,
      },
      data: {
        comments: {
          delete: {
            id: parseInt(commentId),
          },
        },
      },
    });
  }

  @UseGuards(SessionGuard)
  @Put('edit/:id')
  async editComment(
    @Body() body: { comment: string },
    @Param('id') commentId: string,
    @Session() session: Record<string, any>
  ): Promise<any> {
    let where;
    if (session.passport.user.id) {
      where = {
        id: session.passport.user.id,
      };
    } else {
      const user = await this.prisma.user.findFirst({
        where: {
          discord: {
            discordId: session.passport.user.discordId,
          },
        },
        select: {
          id: true,
        },
      });
      where = {
        id: user.id,
      };
    }
    return await this.memeService.editComment({
      where,
      select: {
        id: true,
        comments: {
          where: {
            id: parseInt(commentId),
          },
          select: {
            id: true,
            text: true,
            updatedAt: true,
            edited: true,
          },
        },
      },
      data: {
        comments: {
          update: {
            where: {
              id: parseInt(commentId),
            },
            data: {
              text: body.comment,
              edited: true,
            },
          },
        },
      },
    });
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @SkipThrottle()
  @Put('hide_meme')
  async hideMeme(@Res() res: Response, @Body() data: { memeId: string }): Promise<any> {
    const meme = await this.memeService.updateMeme({
      where: { id: parseInt(data.memeId) },
      data: {
        active: false,
        flagged: true,
      },
    });
    res.json(meme);
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @SkipThrottle()
  @Put('show_meme')
  async showMeme(@Res() res: Response, @Body() data: { memeId: string }): Promise<any> {
    const meme = await this.memeService.updateMeme({
      where: { id: parseInt(data.memeId) },
      data: {
        active: true,
        flagged: false,
      },
    });
    res.json(meme);
  }
}
