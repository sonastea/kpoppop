import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import createPostgresSubscriber from 'pg-listen';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class pgListenerProvider implements OnModuleInit {
  private readonly logger = new Logger(pgListenerProvider.name);
  public readonly subscriber = createPostgresSubscriber({ connectionString: process.env.DATABASE_URL });

  private connect = async () => {
    await this.subscriber.connect();
    await this.subscriber.listenTo('new_meme');
  };

  async onModuleInit() {
    await this.connect().finally(() => {
      this.logger.log('Listener has initiliazed');
      this.logger.log(`Subscribe to ${this.subscriber.getSubscribedChannels()}`);
    });
  }

  async onApplicationBootstrap() {
    this.subscriber.events.on('error', (error) => {
      console.error('Fatal database connection error:', error);
      process.exit(1);
    });
  }

  async onModuleDestroy() {
    this.subscriber.close();
  }
}
