import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Meme, Prisma } from '@prisma/client';

@Injectable()
export class MemeService {
  constructor(private prisma: PrismaService) {}

  async createMeme(data: Prisma.MemeCreateInput): Promise<Meme> {
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
