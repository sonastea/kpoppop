import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as cookie from 'cookie';
import { Observable } from 'rxjs';
import { prismaSessionStore } from 'src/store/prisma-session-store';
import cookieParser = require('cookie-parser');

@Injectable()
export class WebSocketSessionInterceptor implements NestInterceptor {
  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cookies = context.switchToHttp().getRequest().handshake.headers.cookie;
    const u_sid = cookie.parse(cookies);
    const sid = cookieParser.signedCookie(u_sid['connect.sid'], process.env.SESSION_SECRET_KEY);

    const session = await prismaSessionStore.get(typeof sid === 'string' && sid);
    if (session) {
      context.switchToWs().getClient().sessionID = sid;
      context.switchToWs().getClient().user = session.passport.user;
    }

    return next.handle();
  }
}
