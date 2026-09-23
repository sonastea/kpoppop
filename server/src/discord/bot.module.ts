import { pgListenerProvider } from 'src/database/pg-listener.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NecordModule } from 'necord';
import { MemeModule } from 'src/meme/meme.module';
import { BotGateway } from './bot.gateway';
import { Module } from '@nestjs/common';
import { GatewayIntentBits, Partials } from 'discord.js';

@Module({
  imports: [
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('DISCORDBOT_TOKEN'),
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildPresences,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessageReactions,
        ],
        partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
      }),
      inject: [ConfigService],
    }),
    MemeModule,
  ],
  providers: [BotGateway, pgListenerProvider],
})
export class BotModule {}
