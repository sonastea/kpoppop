/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  public example(): void {
    this.mailerService
      .sendMail({
        to: 'sonastea@gmail.com',
        from: 'noreply@nestjs.com',
        subject: 'Testing Nest Mailermodule with html ✔',
        template: './verify-email.html',
      })
      .then(() => {})
      .catch(() => {});
  }

  async sendVerificationLink(email: string) {
    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
        expiresIn: `${this.configService.get('JWT_VERIFICATION_EXPIRATION_TIME')}s`,
      }
    );
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
    console.log(url);
    const text = `Welcome to kpoppop. Confirm your email by clicking here: ${url}`;

    await this.mailerService.sendMail({
      from: this.configService.get('MAIL_FROm'),
      to: email,
      subject: 'Verify your email address',
      text,
    });
  }
}
