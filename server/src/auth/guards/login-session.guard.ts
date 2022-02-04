import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginSessionGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check the username and password
    const result = (await super.canActivate(context)) as boolean;

    // Initialize the session
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    // If no exceptions were thrown, allow the access to the route
    return result;
  }
}
