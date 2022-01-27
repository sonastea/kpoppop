import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User | object> {
    data.password = bcrypt.hashSync(data.password, 10);
    try {
      const user = await this.prisma.user.create({ data });
      delete user.password;
      delete user.refreshtoken;
      return user;
    } catch (err) {
      if (err.code === 'P2002') {
        console.log('This username or email is already taken');
        return {
          errors: {
            UserOrEmail: 'This username or email is already taken',
          },
        };
      }
    }
  }

  async findOne(data: Prisma.UserWhereUniqueInput): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    return user;
  }

  async setRefreshToken(refreshToken: string, username: string): Promise<void> {
    if (username !== undefined || null) {
      try {
        const hash = bcrypt.hashSync(refreshToken, 10);
        await this.prisma.user.update({
          where: { username: username },
          data: { refreshtoken: hash },
        });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async removeRefreshToken(username: string): Promise<void> {
    await this.prisma.user.update({
      where: { username: username },
      data: { refreshtoken: '' },
    });
  }

  async getUserIfRefreshTokenMatch(refreshToken: string, username: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      const match = bcrypt.compareSync(refreshToken, user.refreshtoken);
      if (match) {
        return user;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
