import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh'
) {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {
    super({
      secretOrKey: process.env.JWT_REFRESH_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies['refreshToken'];
        },
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<object | HttpException> {
    const user = await this.userService.getUserIfRefreshTokenMatch(
      req.cookies.refreshToken,
      payload.username
    );
    if (user) {
      const newRefreshToken = await this.authService.getRefreshToken({
        username: user.username,
      });
      await this.userService.setRefreshToken(newRefreshToken, user.username);
      req.res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      return { userId: user.id, username: user.username, role: user.role };
    } else {
      req.res.clearCookie('accessToken');
      req.res.clearCookie('refreshToken');
      return { path: '/login' };
    }
  }
}
