import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi  from 'joi';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService],
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(5000),
      }),
    }),
  ],
})
export class AppModule {}
