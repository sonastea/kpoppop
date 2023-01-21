import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { memoryStorage } from 'multer';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { DiscordController } from './auth/discord.controller';
import { DiscordAuthModule } from './auth/discord.module';
import { BotModule } from './discord/bot.module';
import { LocalSerializer } from './auth/serializers/local.serializer';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { PrismaService } from './database/prisma.service';
// import { MailController } from './mail/mail.controller';
// import { MailModule } from './mail/mail.module';
import { MemeController } from './meme/meme.controller';
import { MemeService } from './meme/meme.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { WebSocketModule } from './sockets/websocket.module';

@Module({
  imports: [
    AuthModule,
    BotModule,
    DiscordAuthModule,
    HttpModule,
    // MailModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
      validationSchema: Joi.object({
        DISCORDBOT_TOKEN: Joi.string().required(),
        DISCORDBOT_WEBHOOK: Joi.string().required(),
        JWT_VERIFICATION_SECRET: Joi.string().required(),
        JWT_VERIFICATION_EXPIRATION_TIME: Joi.string().required(),
        EMAIL_CONFIRMATION_URL: Joi.string().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
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
    WebSocketModule,
  ],
  controllers: [
    AuthController,
    DiscordController,
    //MailController,
    MemeController,
    UserController,
  ],
  providers: [PrismaService, MemeService, UserService, LocalStrategy, LocalSerializer],
})
export class AppModule {}
