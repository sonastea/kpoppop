import { MailerModule } from '@derech1e/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';

console.log(__dirname + '/templates/');
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_VERIFICATION_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_VERIFICATION_EXPIRATION_TIME')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          // In most cases set this value to true if you are connecting to port 465.
          // For port 587 or 25 keep it false.
          port: 587,
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
