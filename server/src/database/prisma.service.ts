import {
  INestApplication,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { createPrismaRedisCache } from 'prisma-redis-middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationBootstrap {
  private readonly logger = new Logger(PrismaService.name);
  private readonly redis = new Redis(process.env.PRISMA_REDIS_URL);
  private readonly cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    storage: {
      type: 'redis',
      options: { client: this.redis, invalidation: { referencesTTL: 86400 } },
    },
    cacheTime: 86400,
    excludeModels: [
      'User',
      'DiscordUser',
      'Session',
      'Meme',
      'Comment',
      'SocialMedia',
      'EmailToken',
      'ReportComment',
      'ReportMeme',
      'ReportUser',
      'Message'
    ],
    excludeMethods: ['count', 'groupBy'],
    onHit: (key) => {
      this.logger.log('*HIT* ' + key);
    },
    onMiss: (key) => {
      this.logger.log('*MISS* ' + key);
    },
    onError: (key) => {
      this.logger.error('*ERROR* ' + key);
    },
  });

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onApplicationBootstrap(): Promise<void> {
    this.$use(this.cacheMiddleware);
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
