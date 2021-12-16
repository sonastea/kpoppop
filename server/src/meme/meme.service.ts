import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Meme, Prisma } from '@prisma/client';

@Injectable()
export class MemeService {
  constructor(private prisma: PrismaService) {}

  async createMeme(data: Prisma.MemeCreateInput): Promise<Meme> {
    return this.prisma.meme.create({
      data,
    });
  }
}
