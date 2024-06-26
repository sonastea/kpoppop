import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Meme, Prisma } from '@prisma/client';

@Injectable()
export class MemeService {
  constructor(private prisma: PrismaService) {}

  async post(params: {
    where: Prisma.MemeWhereInput;
    select: Prisma.MemeSelect;
  }): Promise<any | null> {
    const { where, select } = params;
    return this.prisma.meme.findFirst({
      where,
      select,
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MemeWhereUniqueInput;
    where?: Prisma.MemeWhereInput;
    orderBy?: Prisma.MemeOrderByWithRelationInput | Prisma.MemeOrderByWithRelationInput[];
    select?: Prisma.MemeSelect;
  }): Promise<Prisma.MemeScalarWhereInput[]> {
    const { skip, take, cursor, where, orderBy, select } = params;
    return this.prisma.meme.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select,
    });
  }

  async totalLikes(params: { where: Prisma.MemeWhereUniqueInput }) {
    const { id } = params.where;
    const likes = await this.prisma.userMemeLike.count({
      where: {
        memeId: id,
      },
    });

    return likes;
  }

  async likedMeme(params: { where: Prisma.UserMemeLikeWhereUniqueInput }) {
    const { where } = params;
    const meme = await this.prisma.userMemeLike.findUnique({
      where,
    });

    if (meme.id) {
      return true;
    } else {
      return false;
    }
  }

  async likeMeme(params: {
    where: Prisma.MemeWhereUniqueInput;
    user: Prisma.UserWhereUniqueInput;
  }) {
    const { where, user } = params;
    const liked = await this.prisma.meme.update({
      where,
      data: {
        likes: {
          create: {
            userId: user.id,
          },
        },
      },
      include: {
        likes: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (liked.likes.length >= 1) {
      return { LikeMeme: true };
    } else if (liked.likes.length === 0) {
      return { LikeMeme: false };
    } else {
      return { LikeMeme: { error: 'There was an error liking this.' } };
    }
  }

  async unlikeMeme(params: {
    where: Prisma.MemeWhereUniqueInput;
    user: Prisma.UserWhereUniqueInput;
  }) {
    const { where, user } = params;
    try {
      const liked = await this.prisma.userMemeLike.delete({
        where: {
          userId_memeId: {
            memeId: where.id,
            userId: user.id,
          },
        },
        select: {
          id: true,
        },
      });

      if (liked.id) {
        return { UnlikeMeme: true };
      } else {
        return { UnlikeMeme: false };
      }
    } catch (e) {
      return { Unlikememe: { error: 'There was an error unliking this.' } };
    }
  }

  async createMeme(data: Prisma.MemeCreateInput, select?: Prisma.MemeSelect) {
    return this.prisma.meme.create({
      data,
      select,
    });
  }

  async updateMeme(params: {
    where: Prisma.MemeWhereUniqueInput;
    data: Prisma.MemeUpdateInput;
  }): Promise<Meme> {
    const { data, where } = params;
    return this.prisma.meme.update({
      data,
      where,
    });
  }

  async totalComments(params: { where: Prisma.MemeWhereUniqueInput }): Promise<any> {
    const { where } = params;
    const likes = await this.prisma.meme.findUnique({
      where,
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });
    return likes._count.comments;
  }

  async comments(params: {
    where: Prisma.MemeWhereUniqueInput;
    select: Prisma.MemeSelect;
  }): Promise<any> {
    const { where, select } = params;
    const meme = await this.prisma.meme.findUnique({
      where,
      select,
    });
    return meme;
  }

  async commentMeme(params: {
    data: Prisma.CommentCreateInput;
    select: Prisma.CommentSelect;
  }): Promise<any> {
    const { data, select } = params;
    const comment = await this.prisma.comment.create({
      data,
      select,
    });
    return comment;
  }

  async toggleComment(memeId: number): Promise<any> {
    const meme = await this.prisma
      .$queryRaw`update "Comment" SET "active" = not "active" WHERE "id" = ${memeId} returning "id", "active"`; // eslint-disable-line max-len
    return meme[0];
  }

  async deleteComment(params: {
    where: Prisma.UserWhereUniqueInput;
    select: Prisma.UserSelect;
    data: Prisma.UserUpdateInput;
  }): Promise<any> {
    const { where, select, data } = params;
    const comment = await this.prisma.user.update({
      where,
      select,
      data,
    });
    return comment;
  }

  async editComment(params: {
    where: Prisma.UserWhereUniqueInput;
    select: Prisma.UserSelect;
    data: Prisma.UserUpdateInput;
  }): Promise<any> {
    const { where, select, data } = params;
    const comment = await this.prisma.user.update({
      where,
      select,
      data,
    });
    return comment['comments'][0];
  }

  async removeMeme(memeId: number, user: { id?: number; discordId?: string }): Promise<any> {
    const { id, discordId } = user;
    const meme = await this.prisma.meme.update({
      where: {
        id: memeId,
        OR: [{ authorId: id }, { author: { discord: { discordId: discordId } } }],
      },
      data: {
        id: memeId,
        active: false,
      },
      select: {
        id: true,
        active: true,
      },
    });
    if (meme.id) return { memeId: meme.id, success: true };
    return { memeId: meme.id, success: false };
  }

  async reportMeme(params: { data: Prisma.ReportMemeCreateInput }): Promise<any> {
    const { data } = params;
    const reported = await this.prisma.reportMeme.create({ data });
    return reported;
  }

  async toggleMeme(memeId: number): Promise<any> {
    const meme = await this.prisma
      .$queryRaw`update "Meme" SET "active" = not "active" WHERE "id" = ${memeId} returning "id", "active"`; // eslint-disable-line max-len
    return meme[0];
  }
}
