import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { UserService } from 'src/user/user.service';
import cookieParser = require('cookie-parser');

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly userService: UserService;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.userService = this.app.get(UserService);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://localhost:6379` });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    options.allowRequest = async (request, allowFunction) => {
      const unparsed_sid = request.headers['cookie']?.split('=')[1];
      if (unparsed_sid) {
        const sid = cookieParser.signedCookie(
          decodeURIComponent(unparsed_sid),
          process.env.SESSION_SECRET_KEY
        );

        if (typeof sid === 'string') {
          const exists = await this.userService.findOneSid({ sid });

          if (exists) return allowFunction(null, true);
        }
      }

      return allowFunction('FORBIDDEN', false);
    };

    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
