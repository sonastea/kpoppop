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
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { LocalSerializer } from './auth/serializers/local.serializer';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('production'),
        STORAGE_BUCKET: Joi.string()
          .valid('images.kpoppop.com', 'test.kpoppop.com')
          .default('images.kpoppop.com')
          .required(),
        PORT: Joi.number().default(5000),
      }),
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
        dest: './files',
      }),
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController, MemeController, UserController],
  providers: [PrismaService, MemeService, UserService, LocalStrategy, LocalSerializer],
})
export class AppModule {}
