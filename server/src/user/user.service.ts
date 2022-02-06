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
      // User object received contains all fields that
      // we must sanitize before sending back to the user.
      const { updatedAt, email, refreshtoken, password, ...strippedUser } = user;
      return strippedUser;
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

  async findOne(data: Prisma.UserWhereUniqueInput): Promise<Prisma.UserWhereInput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: data.id,
        },
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

  async findOneWithCredentials(data: Prisma.UserWhereUniqueInput): Promise<Prisma.UserWhereInput> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: data.username,
      },
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
}
