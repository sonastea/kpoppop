import { pgListenerProvider } from 'src/database/pg-listener.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordModule } from '@discord-nestjs/core';
import { MemeModule } from 'src/meme/meme.module';
import { BotGateway } from './bot.gateway';
import { Module } from '@nestjs/common';
import { GatewayIntentBits, Partials } from 'discord.js';

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
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
          ],
          partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
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
