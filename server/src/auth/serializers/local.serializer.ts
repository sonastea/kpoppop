import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { DiscordAuthService } from '../discord.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly userService: UserService,
    private readonly discordService: DiscordAuthService
  ) {
    super();
  }

  async serializeUser(user: Auth.SessionType, done: CallableFunction) {
    if (user.id) done(null, { id: user.id });
    if (user.discordId) done(null, { discordId: user.discordId });
  }

  async deserializeUser(user: Auth.SessionType, done: CallableFunction) {
    const { id, discordId } = user;
    let result;
    if (id) {
      result = this.userService.findOne({ id });
    } else if (discordId) {
      result = this.discordService.findOne({ discordId });
    }
    return result ? done(null, result) : done(null, null);
  }
}
