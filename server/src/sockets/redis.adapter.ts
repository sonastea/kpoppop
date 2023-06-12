import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { createAdapter } from '@socket.io/redis-adapter';
import * as cookieParser from 'cookie-parser';
import { SessionData } from 'express-session';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { prismaSessionStore } from 'src/store/prisma-session-store';
import { UserService } from 'src/user/user.service';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly pss: PrismaSessionStore;
  private readonly userService: UserService;
  private readonly logger: Logger;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.pss = prismaSessionStore;
    this.userService = this.app.get(UserService);
    this.logger = new Logger(RedisIoAdapter.name);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    options.allowRequest = async (request, allowFunction) => {
      if (!request.headers.cookie) return;
      const unparsed_sid = request.headers.cookie.match('(^| )connect.sid=([^;]+)')[2];
      if (unparsed_sid) {
        const sid = cookieParser.signedCookie(
          decodeURIComponent(unparsed_sid),
          process.env.SESSION_SECRET_KEY
        );

        if (typeof sid === 'string') {
          const exists = await this.userService.findOneSid({ sid });

          if (exists) {
            await this.pss
              .get(sid)
              .then((session: SessionData) =>
                this.logger.log(`${JSON.stringify(session.passport.user)} connected to websocket.`)
              );

            return allowFunction(null, true);
          }
        }
      }

      return allowFunction('INVALID COOKIE SESSION', false);
    };

    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
