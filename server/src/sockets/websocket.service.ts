import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/database/prisma.service';
import { MyLogger } from 'src/logger/my-logger.service';
import { MessagePayload } from './websocket.gateway';

const CONVERSATION_TTL = 7 * 24 * 60 * 60;
const mapSession = (id: number) => (id ? { id } : undefined);

type Key = string;
type RedisScanResult = [string, Key[]];
type RedisMultiResult = [Error | null, number];

@Injectable()
export class WebSocketStoreService {
  private readonly prisma: PrismaService = new PrismaService();

  constructor(private logger: MyLogger) {
    this.logger.setContext(WebSocketStoreService.name);
  }

  readonly redis = new Redis(process.env.REDIS_URL, {
    connectionName: 'ws-redis',
  }).on('error', (err) => {
    this.logger.error(err);
  });

  async getUnreadCount(convid: string, from: number) {
    return await this.prisma.message.count({
      where: {
        AND: [{ convId: convid }, { userId: from }, { read: false }],
      },
    });
  }

  async saveMessage(message: MessagePayload): Promise<any> {
    if (message.convid === undefined && message.fromSelf) {
      const conv = await this.prisma.conversation.create({
        data: {
          messages: {
            create: {
              userId: message.from,
              createdAt: message.createdAt,
              content: message.content,
              recipientId: message.to,
              fromSelf: message.fromSelf,
              read: true,
            },
          },
          users: {
            connect: [{ id: message.to }, { id: message.from }],
          },
        },
        include: { messages: { take: -1 } },
      });
      const convidMsg = {
        ...message,
        convid: conv.convid,
      };
      this.saveMessageToCache(convidMsg);
      return convidMsg;
    } else if (message.convid === undefined && !message.fromSelf) {
      const conv = await this.prisma.conversation.create({
        data: {
          messages: {
            create: {
              userId: message.from,
              createdAt: message.createdAt,
              content: message.content,
              recipientId: message.to,
              fromSelf: message.fromSelf,
              read: message.read,
            },
          },
          users: {
            connect: [{ id: message.to }, { id: message.from }],
          },
        },
        include: {
          messages: { take: -1 },
          users: { where: { id: message.from }, select: { username: true } },
        },
      });
      const convidMsg = {
        ...message,
        convid: conv.convid,
        fromUser: conv.users[0].username,
      };
      this.saveMessageToCache(convidMsg);
      return convidMsg;
    } else {
      const conv = await this.prisma.conversation.update({
        where: { convid: message.convid },
        data: {
          messages: {
            create: {
              userId: message.from,
              createdAt: message.createdAt,
              content: message.content,
              recipientId: message.to,
              fromSelf: message.fromSelf,
              read: message.read,
            },
          },
        },
        include: { messages: { take: -1 } },
      });
      const convidMsg = {
        ...message,
        convid: conv.convid,
      };
      this.saveMessageToCache(convidMsg);
      return convidMsg;
    }
  }

  saveMessageToCache(message: MessagePayload) {
    const msg = JSON.stringify(message);
    if (message.to === message.from) {
      this.redis
        .multi()
        .rpush(`messages:${message.to}`, msg)
        .expire(`messages:${message.to}`, CONVERSATION_TTL)
        .exec();
    } else {
      this.redis
        .multi()
        .rpush(`messages:${message.from}`, msg)
        .rpush(`messages:${message.to}`, msg)
        .expire(`messages:${message.from}`, CONVERSATION_TTL)
        .expire(`messages:${message.to}`, CONVERSATION_TTL)
        .exec();
    }
  }

  async getMessagesForUserCache(userID: number) {
    return this.redis.lrange(`messages:${userID}`, 0, -1).then((results) => {
      return results.map((result) => JSON.parse(result));
    });
  }

  async getMessagesForUser(userID: number) {
    const conversations = await this.prisma.conversation.findMany({
      select: {
        id: true,
        messages: {
          take: 100,
        },
      },
      where: {
        users: {
          some: {
            id: {
              equals: userID,
            },
          },
        },
      },
    });
    conversations.map((session) => {
      session.messages.forEach((m, index) => {
        if (index === 0) this.saveConversationSession(m.recipientId.toString());
        this.saveMessageToCache({
          convid: m.convId,
          to: m.recipientId,
          from: m.userId,
          content: m.content,
          createdAt: m.createdAt.toISOString(),
          fromSelf: m.fromSelf,
          read: m.read,
        });
      });
    });
    return await this.getMessagesForUserCache(userID);
  }

  async getUpdatedConvoSession(recipientID: number, userID: number) {
    return await this.prisma.conversation.findFirst({
      where: {
        AND: [
          {
            users: {
              some: { id: recipientID },
            },
          },
          {
            users: {
              some: { id: userID },
            },
          },
        ],
      },
      select: {
        convid: true,
        users: {
          where: { id: recipientID },
          select: {
            username: true,
            displayname: true,
            photo: true,
            status: true,
          },
        },
      },
    });
  }

  saveConversationSession(userID: string) {
    this.redis.multi().hset(`convosession:${userID}`, 'id', userID).exec();
  }

  async updateMessagesRead(convid: string, recipientID: number) {
    await this.prisma.message.updateMany({
      where: {
        AND: [{ convId: convid }, { userId: recipientID }, { read: false }],
      },
      data: { read: true },
    });
  }

  async getAllConversationSessions() {
    const keys = new Set<Key>();
    let cursor = '0';

    do {
      const [nextCursor, results]: RedisScanResult = await this.redis.scan(
        cursor,
        'MATCH',
        'convosession:*',
        'COUNT',
        '100'
      );

      cursor = nextCursor;
      results.forEach((k) => keys.add(k));
    } while (cursor !== '0');

    const commands = Array.from(keys).map((key) => ['hmget', key, 'id']);

    const results = await this.redis.multi(commands).exec();

    return results
      .map(([err, session]: RedisMultiResult) => (err ? undefined : mapSession(session)))
      .filter((v) => !!v) as { id: number }[];
  }
}
