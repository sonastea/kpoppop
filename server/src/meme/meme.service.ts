import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Meme, Prisma } from '@prisma/client';

@Injectable()
export class MemeService {
  constructor(private prisma: PrismaService) {}

  async post(
    where: Prisma.MemeWhereInput,
    include?: Prisma.MemeInclude
  ): Promise<Meme | null> {
    return this.prisma.meme.findFirst({
      where,
      include,
    });
  }

  async posts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MemeWhereUniqueInput;
    where?: Prisma.MemeWhereInput;
    orderBy?: Prisma.MemeOrderByWithRelationInput;
    select?: Prisma.MemeSelect;
  }): Promise<Prisma.MemeArgs[]> {
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

  async totalLikes(params: { where: Prisma.MemeWhereUniqueInput }): Promise<any> {
    const { where } = params;
    const likes = await this.prisma.meme.findUnique({
      where,
      include: {
        likedBy: true,
      },
    });
    return likes.likedBy.length;
  }

  async likedMeme(params: {
    where: Prisma.MemeWhereUniqueInput;
    user: Prisma.UserWhereUniqueInput;
  }): Promise<any> {
    const { where, user } = params;
    const meme = await this.prisma.meme.findUnique({
      where,
      include: {
        likedBy: {
          where: {
            id: user.id,
          },
        },
      },
    });

    if (meme.likedBy.length >= 1) {
      return true;
    } else {
      return false;
    }
  }

  async likeMeme(params: {
    where: Prisma.MemeWhereUniqueInput;
    user: Prisma.UserWhereUniqueInput;
  }): Promise<any> {
    const { where, user } = params;
    const liked = await this.prisma.meme.update({
      where,
      data: {
        likedBy: {
          connect: {
            id: user as number,
          },
        },
      },
      include: {
        likedBy: {
          where: {
            id: user as number,
          },
          select: {
            id: true,
          },
        },
      },
    });
    if (liked.likedBy.length >= 1) {
      return true;
    } else if (liked.likedBy.length === 0) {
      return false;
    }
  }

  async unlikeMeme(params: {
    where: Prisma.MemeWhereUniqueInput;
    user: Prisma.UserWhereUniqueInput;
  }): Promise<any> {
    const { where, user } = params;
    const liked = await this.prisma.meme.update({
      where,
      data: {
        likedBy: {
          disconnect: {
            id: user as number,
          },
        },
      },
      include: {
        likedBy: {
          where: {
            id: user as number,
          },
          select: {
            id: true,
          },
        },
      },
    });
    if (liked.likedBy.length >= 1) {
      return true;
    } else if (liked.likedBy.length === 0) {
      return false;
    }
  }

  async createMeme(
    data: Prisma.MemeCreateInput,
    select?: Prisma.MemeSelect
  ): Promise<Prisma.MemeArgs> {
    return this.prisma.meme.create({
      data,
      select,
    });
  }
}
