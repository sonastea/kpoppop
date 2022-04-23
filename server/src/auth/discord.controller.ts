import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DiscordAuthService } from './discord.service';
import { DiscordGuard } from './guards/discord.guard';
import { SessionGuard } from './guards/session.guard';
import { LocalSerializer } from './serializers/local.serializer';

const DOMAIN =
  process.env.NODE_ENV === 'development' ? 'https://192.168.0.2:3000' : 'https://www.kpoppop.com';

@Controller('auth/discord')
@UseInterceptors(LocalSerializer)
export class DiscordController {
  constructor(private readonly discordService: DiscordAuthService) {}

  @UseGuards(DiscordGuard)
  @Get('login')
  async login() {
    return;
  }

  @UseGuards(DiscordGuard)
  @Get('redirect')
  @HttpCode(302)
  async redirect(@Req() req: Request, @Res() res: Response) {
    // redirect after user logins with social account
    // check for existing local account with discord email
    // if user wants to link both accounts with same email, link them
    // otherwise make new account with choice of us username
    res.redirect(`${DOMAIN}/register/redirect`);
  }

  @UseGuards(SessionGuard)
  @HttpCode(200)
  @Get('link')
  async link(@Req() req: Request, @Res() res: Response) {
    const d = await this.discordService.findOneWithCredentials({
      discordId: req.session.passport.user.discordId,
    });
    const discordUser = await this.discordService.getCurrentUser(d.accessToken as string);
    const linked = await this.discordService.findOneByEmail({ email: discordUser.email });
    if (linked === true) res.json({ linked });
    else res.json({ ...discordUser, SocialType: 'discord', ...linked });
  }

  @Post('register')
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: { email: string; username: string }
  ): Promise<any> {
    const { discordId } = req.session.passport.user;
    const exist = await this.discordService.findOneExisting(data);
    if (exist.errors) {
      res.status(200).json(exist);
    } else {
      const user = await this.discordService.createLocalUserAndConnect(data, { discordId });
      res.status(201).json(user);
    }
  }
}
