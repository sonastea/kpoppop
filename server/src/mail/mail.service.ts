/* import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import * as ejs from 'ejs';

@Injectable()
export class MailService {
  constructor(
    // private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async addToken(token: string) {
    await this.prisma.emailToken.create({
      data: {
        token: token,
      },
    });
  }

  async createToken(email: string) {
    return await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get('JWT_VERIFICATION_SECRET'),
        expiresIn: `${this.configService.get('JWT_VERIFICATION_EXPIRATION_TIME')}s`,
      }
    );
  }

  async deleteToken(token: string) {
    await this.prisma.emailToken.delete({
      where: { token: token },
    });
  }

  async disableToken(token: string) {
    await this.prisma
      .$queryRaw`update "EmailToken" SET active = false WHERE token = ${token} returning "active"`;
  }

  async verifyEmail(email: string) {
    await this.prisma
      .$queryRaw`update "User" SET "emailVerified" = true WHERE email = ${email} returning "emailVerified"`;
  }

  async sendVerificationLink(email: string) {
    // check if email even exists before proceeding at all
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) return null;

    const token = await this.createToken(email);
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}?token=${token}`;
    const text = `Welcome to kpoppop. Confirm your email by clicking here: ${url}`;

    await this.addToken(token);
    await this.mailerService.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Verify your email address',
      html: await ejs.renderFile(process.env.PWD + '/src/mail/verify-email.ejs', { url: url }),
      text,
    });
  }
} */
