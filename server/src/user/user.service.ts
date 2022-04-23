import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const UserProfileData: Prisma.UserSelect = {
  id: true,
  username: true,
  displayname: true,
  role: true,
  banner: true,
  photo: true,
};

const SocialMediaLinkData: Prisma.SocialMediaSelect = {
  uuid: true,
  title: true,
  url: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User | object> {
    data.password = bcrypt.hashSync(data.password, 10);
    data.banner = '';
    data.photo = '';
    data.displayname = '';

    try {
      const user = await this.prisma.user.create({
        data,
      });
      // User object received contains all fields that
      // we must sanitize before sending back to the user.
      const { updatedAt, email, refreshtoken, password, banner, photo, ...strippedUser } = user;
      return strippedUser;
    } catch (err) {
      if (err.code === 'P2002') {
        console.log('The username or email is already taken.');
        return {
          errors: {
            User: 'The username or email is already taken.',
          },
        };
      }
    }
  }

  // Used for local serializer login
  async findOne(data: Prisma.UserWhereUniqueInput): Promise<Prisma.UserWhereInput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: data,
        select: {
          id: true,
          username: true,
          displayname: true,
          role: true,
        },
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  // Used for logging in to check password hash
  async findOneWithCredentials(data: Prisma.UserWhereUniqueInput): Promise<Prisma.UserWhereInput> {
    const user = await this.prisma.user.findUnique({
      where: data,
      select: {
        id: true,
        username: true,
        password: true,
        displayname: true,
        role: true,
      },
    });
    return user;
  }

  // Required information for profile display
  async getUser(data: Prisma.UserWhereUniqueInput): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: data,
        select: {
          ...UserProfileData,

          memes: {
            orderBy: {
              id: 'desc',
            },
            select: {
              id: true,
              title: true,
              url: true,
            },
            where: {
              flagged: false,
            },
          },

          socialMedias: {
            select: {
              uuid: true,
              title: true,
              url: true,
            },
          },

          _count: {
            select: {
              memes: true,
              likedMemes: true,
            },
          },
        },
      });

      if (user === null) {
        return {
          errors: {
            User: 'User does not exist.',
          },
        };
      }
      return user;
    } catch (e) {
      console.log(e.code);
    }
  }

  async getUserProfile(
    where: Prisma.UserWhereUniqueInput | Prisma.DiscordUserWhereUniqueInput
  ): Promise<any> {
    if (where.id) {
      return await this.prisma.user.findUnique({
        where,
        select: {
          ...UserProfileData,

          socialMedias: {
            select: {
              ...SocialMediaLinkData,
            },
          },
        },
      });
    } else {
      const discordUser = await this.prisma.discordUser.findUnique({
        where,
        select: {
          user: {
            select: {
              ...UserProfileData,

              socialMedias: {
                select: {
                  ...SocialMediaLinkData,
                },
              },
            },
          },
        },
      });
      return discordUser.user;
    }
  }

  async updateProfile(
    where: Prisma.UserWhereUniqueInput | Prisma.DiscordUserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ): Promise<any> {
    if (where.id) {
      return await this.prisma.user.update({
        where,
        data,
        select: {
          ...UserProfileData,

          socialMedias: {
            select: {
              ...SocialMediaLinkData,
            },
          },
        },
      });
    } else {
      const user = await this.prisma.discordUser.update({
        where,
        data: {
          user: {
            update: data,
          },
        },
        select: {
          user: {
            select: {
              ...UserProfileData,

              socialMedias: {
                select: {
                  ...SocialMediaLinkData,
                },
              },
            },
          },
        },
      });
      return user;
    }
  }

  async addSocialMediaLink(data: Prisma.SocialMediaCreateInput): Promise<any> {
    const socialLink = await this.prisma.socialMedia.create({
      data,
      select: { ...SocialMediaLinkData },
    });
    return socialLink;
  }

  async deleteSocialMediaLink(where: Prisma.SocialMediaWhereUniqueInput): Promise<any> {
    const status = await this.prisma.socialMedia.delete({
      where,
    });
    return status;
  }
}
