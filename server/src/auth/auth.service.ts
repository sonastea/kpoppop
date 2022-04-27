import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
}
