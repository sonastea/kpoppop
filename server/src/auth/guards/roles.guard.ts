import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Roles authorized by @Roles decorator are retrieved here.
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // Retrieve user's session data from the http request.
    const req = context.switchToHttp().getRequest();

    // Check if user is authorized for the route.
    return this.authService.isAuthorized(roles, req.session.passport.user);
  }
}
