import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { MemeService } from './meme.service';

@Module({
  providers: [PrismaService, MemeService],
  exports: [MemeService],
})
export class MemeModule {}
