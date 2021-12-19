import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Meme, Prisma } from '@prisma/client';

@Injectable()
export class MemeService {
  constructor(private prisma: PrismaService) {}

  async post(
    where: Prisma.MemeWhereUniqueInput,
    include?: Prisma.MemeInclude
  ): Promise<Meme | null> {
    return this.prisma.meme.findUnique({
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
