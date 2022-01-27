import { Module } from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from './user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class UserModule {}
