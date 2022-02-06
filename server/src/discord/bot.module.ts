import { pgListenerProvider } from 'src/database/pg-listener.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordModule } from '@discord-nestjs/core';
import { MemeModule } from 'src/meme/meme.module';
import { BotGateway } from './bot.gateway';
import { Module } from '@nestjs/common';
import { Intents } from 'discord.js';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('DISCORDBOT_TOKEN'),
        commands: ['**/*.command.ts'],
        allowGuilds: ['933480163709181962'],
        discordClientOptions: {
          intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
          ],
          partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
        },
        webhook: {
          url: configService.get<string>('DISCORDBOT_WEBHOOK'),
        },
      }),
      inject: [ConfigService],
    }),
    MemeModule,
  ],
  providers: [BotGateway, pgListenerProvider],
})
export class BotModule {}
