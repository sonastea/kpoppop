import { Controller, Get, HttpCode, Session, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthenticatedFilter } from './filters/authenticated.filter';
import { SessionGuard } from './guards/session.guard';
import { UserService } from 'src/user/user.service';
import { LocalSerializer } from './serializers/local.serializer';

@Controller('auth')
@UseInterceptors(LocalSerializer)
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(SessionGuard)
  @UseFilters(AuthenticatedFilter)
  @HttpCode(200)
  @Get('session')
  async checkUser(@Session() session: Record<string, any>): Promise<object> {
    const { id } = session.passport.user;
    const user = await this.userService.findOne({ id });
    if (user) {
      return user;
    }
  }
}
