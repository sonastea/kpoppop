import { Body, Controller, Get, HttpCode, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';
import { MailService } from './mail.service';

@Controller('email')
@UseGuards(ThrottlerGuard)
export class MailController {
  constructor(private readonly jwtService: JwtService, private readonly mailService: MailService) {}

  @Get('verify?')
  @SkipThrottle()
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    let invalid: boolean;
    // Check email jwt verification token
    await this.jwtService.verifyAsync(token).catch(async (err) => {
      // invalid token due to format or some sort, invalid is used as a check for valid tokens
      // because it still send headers after being set
      if (err.name) invalid = true;
      if (err.name === 'JsonWebTokenError') {
        res.status(401).end();
      }
      // expired token, disable token
      if (err.name === 'TokenExpiredError') {
        await this.mailService.disableToken(token);
        res.status(401).end();
      }
    });
    if (!invalid) {
      // Valid token, decode token to get email to verify the email and disable the token
      const decoded = this.jwtService.decode(token);
      await this.mailService.verifyEmail(decoded['email']);
      await this.mailService.disableToken(token);
      res.status(200).end();
    }
  }

  @Post('resend-link')
  @Throttle(60, 3)
  @HttpCode(201)
  async resend(@Res() res: Response, @Body() data: { email: string }) {
    await this.mailService.sendVerificationLink(data.email).then((data) => {
      if (data === null)
        res.status(400).json({ message: 'An account with this email does not exist' });
    });
    res.end();
  }
}
