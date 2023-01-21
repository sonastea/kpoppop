import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/database/prisma.service';
import { MessagePayload } from './websocket.gateway';

const CONVERSATION_TTL = 24 * 60 * 60;
const mapSession = (userID: number) => (userID ? { userID } : undefined);

@Injectable()
export class WebSocketStoreService {
  private readonly prisma: PrismaService = new PrismaService();

  readonly redis = new Redis();

  async saveMessage(message: MessagePayload) {
    const msg = JSON.stringify(message);
    this.redis
      .multi()
      .rpush(`messages:${message.from}`, msg)
      .rpush(`messages:${message.to}`, msg)
      .expire(`messages:${message.from}`, CONVERSATION_TTL)
      .expire(`messages:${message.to}`, CONVERSATION_TTL)
      .exec();

    const conv = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: { some: { id: message.to } },
          },
          {
            participants: { some: { id: message.from } },
          },
        ],
      },
    });

    await this.prisma.conversation.upsert({
      where: { id: conv ? conv.id : 0 },
      create: {
        messages: {
          create: {
            userId: message.from,
            createdAt: message.createdAt,
            content: message.content,
            recipientId: message.to,
          },
        },
        participants: {
          connect: [{ id: message.to }, { id: message.from }],
        },
      },
      update: {
        messages: {
          create: {
            userId: message.from,
            createdAt: message.createdAt,
            content: message.content,
            recipientId: message.to,
          },
        },
      },
    });
  }

  async getMessagesForUser(userID: number) {
    return this.redis.lrange(`messages:${userID}`, 0, -1).then((results) => {
      return results.map((result) => JSON.parse(result));
    });
  }

  saveConversationSession(userID: string) {
    this.redis
      .multi()
      .hset(`convosession:${userID}`, 'userID', userID)
      .expire(`convosession:${userID}`, CONVERSATION_TTL)
      .exec();
  }

  async getAllConversationSessions() {
    const keys = new Set();
    let nextIndex = 0;

    do {
      const [nextIndexAsStr, results] = await this.redis.scan(
        nextIndex,
        'MATCH',
        'convosession:*',
        'COUNT',
        '100'
      );

      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((k) => keys.add(k));
    } while (nextIndex !== 0);
    const commands = [];
    keys.forEach((key) => {
      commands.push(['hmget', key, 'userID']);
    });
    return this.redis
      .multi(commands)
      .exec()
      .then((results: any) => {
        return results
          .map(([err, session]) => (err ? undefined : mapSession(session)))
          .filter((v: { userID: string[] }) => !!v);
      });
  }
}
