import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    // Roles authorized by @Roles decorator are retrieved here.
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // Retrieve user's session data from the http request.
    const req = context.switchToHttp().getRequest();

    // Check if user is authorized for the route.
    const allowed = await this.authService.isAuthorized(roles, req.session.passport.user);
    if (!allowed)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You do not have the required privileges to complete this request.',
        },
        HttpStatus.FORBIDDEN
      );
    return allowed;
  }
}
