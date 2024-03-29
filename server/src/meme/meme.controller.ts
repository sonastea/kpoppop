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
import { seconds, SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaService } from 'src/database/prisma.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserProfileData } from 'src/user/user.service';

const photoBaseUrl = 'https://ik.imagekit.io/qxhlbjhesx/';

@Controller('meme')
@UseGuards(ThrottlerGuard)
export class MemeController {
  constructor(
    private readonly memeService: MemeService,
    private readonly prisma: PrismaService
  ) {}

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
      const url = photoBaseUrl + fileName;

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

  @UseGuards(SessionGuard)
  @Throttle({ default: { limit: 15, ttl: seconds(60) } })
  @Put('remove/:id')
  async removeMeme(@Param('id') memeId: string, @Session() session: Record<string, any>) {
    if (session.passport.user.id) {
      return await this.memeService.removeMeme(parseInt(memeId), { id: session.passport.user.id });
    }

    if (session.passport.user.discordId) {
      return await this.memeService.removeMeme(parseInt(memeId), {
        discordId: session.passport.user.discordId,
      });
    }
  }

  @Post('posts')
  @SkipThrottle()
  async getMemes(
    @Body() body: { cursor: number },
    @Session() session?: Record<string, any>
  ): Promise<any> {
    if (body.cursor === 0) {
      return await this.memeService.posts({
        take: 15,
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
          createdAt: true,
          likes: {
            where: {
              OR: [
                { user: { discord: { discordId: session.passport?.user?.discordId } } },
                { id: session.passport?.user?.id },
              ],
            },
            select: { id: true },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
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
          createdAt: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
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
  async getMeme(
    @Param('id') id: string,
    @Session() session?: Record<string, any>
  ): Promise<Meme | object> {
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
        createdAt: true,
        likes: {
          where: {
            user: {
              OR: [
                { discord: { discordId: session.passport?.user?.discordId } },
                { id: session.passport?.user?.id },
              ],
            },
          },
          select: { id: true },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
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
  async getUserLike(@Param('id') id: string, @Session() session: Record<string, any>) {
    if (session.passport.user.id) {
      return this.memeService.likedMeme({
        where: {
          userId_memeId: {
            memeId: parseInt(id),
            userId: session.passport.user.id,
          },
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
          userId: user.id,
        },
      });
    }
  }

  @UseGuards(SessionGuard)
  @Throttle({ default: { limit: 15, ttl: seconds(60) } })
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
  @Throttle({ default: { limit: 15, ttl: seconds(60) } })
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

  @Throttle({ default: { limit: 15, ttl: seconds(60) } })
  // @SkipThrottle()
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
    let user: any;
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
    let where: any;
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
    let where: any;
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

  @UseGuards(SessionGuard)
  @Post('report')
  async reportComment(
    @Res() res: Response,
    @Body() body: { id: number; description: string },
    @Session() session: Record<string, any>
  ): Promise<any> {
    const { id: memeId, description } = body;

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

    const reported = await this.memeService.reportMeme({
      data: {
        description: description,
        meme: {
          connect: {
            id: memeId,
          },
        },
        reporter: {
          connect: reporter,
        },
      },
    });

    if (reported.id) {
      res.json({ message: `You successfully reported the meme.` });
    } else {
      res.status(400).json({ message: 'Error processing your report' });
    }
  }

  @UseGuards(SessionGuard, RolesGuard)
  @Roles('ADMIN', 'MODERATOR')
  @SkipThrottle()
  @Put('toggle/:id')
  async toggleMeme(@Param('id') memeId: string): Promise<any> {
    return await this.memeService.toggleMeme(parseInt(memeId));
  }
}
