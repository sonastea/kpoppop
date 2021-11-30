import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

interface User {
  username: string
}

interface tokens {
  accessToken: string,
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateLoginInfo(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ username });
    const hash = bcrypt.hashSync(password, 10);
    if (user && bcrypt.compare(user.password.toString(), hash)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getAccessToken(user: User): Promise<string> {
    return this.jwtService.sign(user);
  }

  async getRefreshToken(user: User): Promise<string> {
    const refreshToken = this.jwtService.sign(user, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: '7d',
    });
    return refreshToken;
  }

  async getTokens(user: any): Promise<tokens> {
    const payload = { username: user.username };
    const refreshToken = await this.getRefreshToken(payload);
    await this.userService.setRefreshToken(refreshToken, user.username);

    return {
      accessToken: await this.getAccessToken(payload),
      refreshToken: refreshToken,
    };
  }

}
