import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class AppModule {}
