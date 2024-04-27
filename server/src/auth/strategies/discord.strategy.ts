import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord-auth';
import { DiscordAuthService } from '../discord.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private readonly discordService: DiscordAuthService) {
    super({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackUrl: process.env.DISCORD_CALLBACK_URL,
      scope: ['email', 'identify', 'guilds'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const data = {
      discordId: profile.id,
      accessToken,
      refreshToken,
    };
    return await this.discordService.validateUser(data);
  }
}
