import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { MemeController } from './meme/meme.controller';
import { MemeService } from './meme/meme.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { BotModule } from './discord/bot.module';
import { LocalSerializer } from './auth/serializers/local.serializer';
import { ThrottlerModule } from '@nestjs/throttler';
import { DiscordAuthModule } from './auth/discord.module';
import { DiscordController } from './auth/discord.controller';

@Module({
  imports: [
    AuthModule,
    BotModule,
    DiscordAuthModule,
    HttpModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DISCORDBOT_TOKEN: Joi.string().required(),
        DISCORDBOT_WEBHOOK: Joi.string().required(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('production'),
        SESSION_SECRET_KEY: Joi.string().required(),
        STORAGE_BUCKET: Joi.string()
          .valid('images.kpoppop.com', 'test.kpoppop.com')
          .default('images.kpoppop.com')
          .required(),
        THROTTLE_TTL: Joi.number().required(),
        THROTTLE_LIMIT: Joi.number().required(),
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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
    }),
  ],
  controllers: [AuthController, DiscordController, MemeController, UserController],
  providers: [PrismaService, MemeService, UserService, LocalStrategy, LocalSerializer],
})
export class AppModule {}
