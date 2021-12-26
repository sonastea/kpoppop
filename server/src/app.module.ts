import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import * as Joi from 'joi';
import { MemeController } from './meme/meme.controller';
import { MemeService } from './meme/meme.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development')
          .required(),
        PORT: Joi.number().default(5000),
      }),
    }),
    AuthModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
        dest: './files',
      }),
    }),
  ],
  controllers: [AuthController, MemeController, UserController],
  providers: [PrismaService, MemeService, UserService],
})
export class AppModule {}
