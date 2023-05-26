import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/database/prisma.service';
import { MessagePayload } from './websocket.gateway';

const CONVERSATION_TTL = 7 * 24 * 60 * 60;
const mapSession = (id: number) => (id ? { id } : undefined);

@Injectable()
export class WebSocketStoreService {
  private readonly prisma: PrismaService = new PrismaService();

  readonly redis = new Redis();

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
    this.saveConversationSession(userID.toString());
    conversations.map((session) => {
      session.messages.forEach((m) => {
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
      commands.push(['hmget', key, 'id']);
    });
    return this.redis
      .multi(commands)
      .exec()
      .then((results: any) => {
        return results
          .map(([err, session]) => (err ? undefined : mapSession(session)))
          .filter((v: { id: string[] }) => !!v);
      });
  }
}
