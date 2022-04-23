import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from '@oauth-everything/passport-discord';
import { DiscordAuthService } from '../discord.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly discordService: DiscordAuthService) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_URL,
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
