import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  async serializeUser(user: Prisma.UserWhereInput, done: CallableFunction) {
    done(null, { id: user.id, role: user.role });
  }

  async deserializeUser(id: number, done: CallableFunction) {
    const user = this.userService.findOne({ id });
    done(null, user);
  }
}
