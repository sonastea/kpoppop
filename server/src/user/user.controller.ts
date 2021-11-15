import { User } from '@prisma/client';
import { UserService } from './user.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async signupUser(
    @Body() data: { username: string; password: string; email: string; },
  ): Promise<User | object> {
    return await this.userService.createUser(data);
  }
}
