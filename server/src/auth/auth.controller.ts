import {
  Controller,
  Get,
  HttpCode,
  Session,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { DiscordAuthService } from './discord.service';
import { AuthenticatedFilter } from './filters/authenticated.filter';
import { SessionGuard } from './guards/session.guard';
import { LocalSerializer } from './serializers/local.serializer';

@Controller('auth')
@UseInterceptors(LocalSerializer)
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly discordService: DiscordAuthService
  ) {}

  @UseGuards(SessionGuard)
  @UseFilters(AuthenticatedFilter)
  @HttpCode(200)
  @Get('session')
  async checkUser(@Session() session: Record<string, any>): Promise<object> {
    const { id, discordId } = session.passport.user;
    if (id) return await this.userService.findOne({ id });
    if (discordId) return await this.discordService.findOne({ discordId });
  }
}
