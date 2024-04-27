import { Injectable } from '@nestjs/common';
import { DiscordUser as User } from 'passport-discord-auth';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DiscordAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(data: Prisma.DiscordUserWhereUniqueInput): Promise<Prisma.DiscordUserWhereInput> {
    try {
      const user = await this.prisma.discordUser.findUnique({
        where: data,
        select: {
          discordId: true,
          user: {
            select: {
              id: true,
              username: true,
              displayname: true,
              role: true,
              photo: true,
            },
          },
        },
      });
      if (!user) return null;
      const sanitized = { discordId: user.discordId, ...user.user };
      return sanitized;
    } catch (err) {
      console.log(err);
    }
  }

  async findOneWithCredentials(
    data: Prisma.DiscordUserWhereUniqueInput
  ): Promise<Prisma.DiscordUserWhereInput> {
    try {
      const user = await this.prisma.discordUser.findUnique({
        where: data,
        select: {
          discordId: true,
          accessToken: true,
          user: true,
        },
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async validateUser(data: Prisma.DiscordUserCreateInput): Promise<any> {
    const { discordId } = data;
    const user = await this.findOne({ discordId });
    if (user) {
      return await this.prisma.discordUser.update({
        where: { discordId },
        data: data,
      });
    }
    /*
     * create user if no user with the discordId exists
     * redirect to make a local account and link them
     */
    return await this.createUser(data);
  }

  async createUser(data: Prisma.DiscordUserCreateInput) {
    try {
      const user = await this.prisma.discordUser.create({
        data,
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async createLocalUserAndConnect(
    data: Prisma.UserUncheckedCreateInput,
    where: Prisma.DiscordUserWhereUniqueInput
  ) {
    try {
      const user = await this.prisma.discordUser.update({
        where,
        data: {
          user: {
            create: data,
          },
        },
        select: {
          discordId: true,
          userId: true,
        },
      });
      console.log(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async linkUserToDiscord(props: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = props;
    try {
      const user = await this.prisma.user.update({
        where,
        data,
        include: { discord: true },
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  async findOneByEmail(where: Prisma.UserWhereUniqueInput): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where,
      });
      if (user) {
        const linked = await this.prisma.discordUser.findFirst({
          where: {
            userId: user.id,
          },
        });
        if (linked !== null && linked) return true;
      }
      if (user !== null && user.username) return { existing: user.username };
      else return null;
    } catch (err) {
      console.log(err);
    }
  }

  async findOneExisting(where: Prisma.UserWhereInput): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ username: where.username }, { email: where.email }],
        },
        select: { username: true, email: true },
      });
      if (user) {
        return {
          errors: {
            User: 'The username and/or email is already taken.',
          },
        };
      } else return false;
    } catch (err) {
      console.log(err);
    }
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    return await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const {
          avatar,
          avatar_decoration,
          public_flags,
          flags,
          banner,
          banner_color,
          accent_color,
          locale,
          mfa_enabled,
          ...sanitized
        } = data;
        return sanitized;
      });
  }

  async isInGuild(accessToken: string): Promise<boolean> {
    return await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.some((guild: { id: string }) => guild.id === '933480163709181962')) return true;
        else return false;
      });
  }
}
