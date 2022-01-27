import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwtRefresh') {
  constructor(private readonly userService: UserService) {
    super({
      secretOrKey: process.env.JWT_REFRESH_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token;
        },
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<object | HttpException> {
    const user = await this.userService.getUserIfRefreshTokenMatch(req.cookies.refresh_token, payload.username);
    if (user) {
      return { sub: user.id, username: user.username, role: user.role, isLoggedIn: true };
    } else {
      return { sub: null, username: null, role: null, isLoggedIn: false };
    }
  }
}
