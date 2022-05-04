/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MailerService } from '@derech1e/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ejs = require('ejs');

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async sendVerificationLink(email: string) {
    const token = await this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
        expiresIn: `${this.configService.get('JWT_VERIFICATION_EXPIRATION_TIME')}s`,
      }
    );
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
    const text = `Welcome to kpoppop. Confirm your email by clicking here: ${url}`;

    await this.mailerService.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Verify your email address',
      html: await ejs.renderFile(process.env.PWD + '/src/mail/verify-email.ejs', { url: url }),
      text,
    });
  }
}
