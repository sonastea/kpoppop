import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

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
      const { password, refreshtoken, ...data } = user;
      return data;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, username: user.username, role: user.role, isLoggedIn: true };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.getRefreshToken(payload);

    await this.userService.setRefreshToken(refresh_token, user['username']);

    return {
      access_token: access_token,
      refresh_token: refresh_token
    };
  }

  async getAccessToken(user: any): Promise<string> {
    return this.jwtService.sign(user);
  }

  async getRefreshToken(user: any): Promise<string> {
    const refreshToken = this.jwtService.sign(user, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: '7d',
    });
    return refreshToken;
  }
}
