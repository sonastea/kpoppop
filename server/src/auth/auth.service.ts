import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {}

  async validateLoginInfo(username: string, password: string): Promise<Prisma.UserWhereInput> {
    const user = await this.userService.findOneWithCredentials({ username });
    if (!user || !user.password) {
      return null;
    }

    if (bcrypt.compareSync(password, <string>user.password)) {
      const { password, refreshtoken, ...strippedUser } = user;
      return strippedUser;
    }

    return null;
  }

  async isAuthorized(roles: string[], user: { id?: number; discordId?: string }): Promise<boolean> {
    let found: { role: string };
    if (user.id) {
      found = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          role: true,
        },
      });
    } else {
      found = await this.prisma.user.findFirst({
        where: {
          discord: {
            discordId: {
              equals: user.discordId,
            },
          },
        },
        select: {
          role: true,
        },
      });
    }
    return roles.includes(found.role);
  }
}
