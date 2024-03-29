import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';
import { RegisterUserData } from './user.controller';

export const UserProfileData: Prisma.UserSelect = {
  id: true,
  username: true,
  createdAt: true,
  displayname: true,
  role: true,
  banner: true,
  photo: true,
  status: true,
};

const SocialMediaLinkData: Prisma.SocialMediaSelect = {
  uuid: true,
  title: true,
  url: true,
};

const ReportUserData: Prisma.ReportUserSelect = {
  id: true,
  userId: true,
  username: true,
  description: true,
};

type UserIdentifier = {
  id?: number;
  discordId?: string;
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User | RegisterUserData> {
    data.password = bcrypt.hashSync(data.password, 10);

    try {
      const user = await this.prisma.user.create({
        data,
      });
      // User object received contains all fields that
      // we must sanitize before sending back to the user.
      const { updatedAt, emailVerified, refreshtoken, password, banner, photo, ...strippedUser } =
        user;
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
  async findOne(data: Prisma.UserWhereUniqueInput): Promise<Prisma.UserScalarWhereInput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: data,
        select: {
          ...UserProfileData,
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

  // Find any live sessions with given sid - Sesssions cleanup every 2 hours
  async findOneSid(where: Prisma.SessionWhereUniqueInput): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where,
    });
    if (session) return true;
    else return false;
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

  async getUserProfile(where: UserIdentifier): Promise<any> {
    if (where.id) {
      return await this.prisma.user.findUnique({
        where: { id: where.id },
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
        where: { discordId: where.discordId },
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

  async updateProfile(where: UserIdentifier, data: Prisma.UserUpdateInput): Promise<any> {
    if (where.id) {
      return await this.prisma.user.update({
        where: { id: where.id },
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
        where: { discordId: where.discordId },
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

  async reportComment(data: Prisma.ReportCommentCreateInput): Promise<any> {
    const reported = await this.prisma.reportComment.create({
      data,
      select: {
        id: true,
        comment: {
          select: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    return reported;
  }

  async reportUser(data: Prisma.ReportUserCreateInput): Promise<any> {
    const reported = await this.prisma.reportUser.create({
      data,
      select: { ...ReportUserData },
    });
    return reported;
  }

  async modUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    select: Prisma.UserSelect
  ): Promise<any> {
    const moddedUser = await this.prisma.user.update({
      where,
      data,
      select,
    });
    return moddedUser;
  }

  async unmodUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    select: Prisma.UserSelect
  ): Promise<any> {
    const unmoddedUser = await this.prisma.user.update({
      where,
      data,
      select,
    });
    return unmoddedUser;
  }

  async banUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    select: Prisma.UserSelect
  ): Promise<any> {
    const bannedUser = await this.prisma.user.update({
      where,
      data,
      select,
    });
    return bannedUser;
  }

  async unbanUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    select: Prisma.UserSelect
  ): Promise<any> {
    const unbannedUser = await this.prisma.user.update({
      where,
      data,
      select,
    });
    return unbannedUser;
  }
}
