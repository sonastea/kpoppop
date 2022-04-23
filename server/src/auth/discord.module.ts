import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { DiscordAuthService } from './discord.service';
import { DiscordStrategy } from './strategies/discord.strategy';

@Module({
  imports: [UserModule],
  providers: [DiscordAuthService, DiscordStrategy, PrismaService, UserService],
  exports: [DiscordAuthService],
})
export class DiscordAuthModule {}
