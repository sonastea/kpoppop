import {
  CanActivate,
  ExecutionContext,
  UnprocessableEntityException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private readonly httpService: HttpService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const { body } = ctx.switchToHttp().getRequest();
    const url = `https://www.google.com/recaptcha/api/siteverify?response=${body.recaptcha}\
      &secret=${process.env.RECAPTCHA_SECRET}`;

    const data = await lastValueFrom(
      this.httpService.post(url).pipe(map((response) => response.data))
    );

    if (!data.success) {
      throw new UnprocessableEntityException();
    }

    return true;
  }
}
