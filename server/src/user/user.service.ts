import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User | object> {
    data.password = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.prisma.user.create({ data });
      delete user.password;
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
}
