import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaClient) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const data = req?.cookies['accessToken'];
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
    });
  }

  // This is where we can return add more information about the user and return it
  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: payload.username,
      },
    });
    return { _id: user.id, username: user.username, role: user.role, isLoggedIn: true };
  }
}
