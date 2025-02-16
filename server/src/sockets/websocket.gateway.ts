/* import { Logger, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MyLogger } from 'src/logger/my-logger.service';
import { WebSocketSessionInterceptor } from './websocket.interceptor';
import { WebSocketStoreService } from './websocket.service';

let origin: boolean | string | RegExp | (string | RegExp)[];

if (process.env.NODE_ENV === 'development') {
  origin = true;
} else if (process.env.NODE_ENV === 'production') {
  origin = ['https://kpoppop.com', /\.kpoppop\.com$/];
}

export type MessagePayload = {
  convid: string;
  to: number;
  createdAt: string;
  content: string;
  from: number;
  fromSelf: boolean;
  fromUser?: string;
  fromPhoto?: string;
  read: boolean;
};

@WebSocketGateway({
  cors: {
    origin: origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
})
@UseInterceptors(WebSocketSessionInterceptor)
export class WebSocketServiceGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(WebSocketServer.name);
  private readonly messageStore = new WebSocketStoreService(new MyLogger());

  @WebSocketServer()
  protected server: Server;

  afterInit() {
    this.logger.log(`${WebSocketServer.name} is now online.`);

    this.messageStore.redis.on('error', (err) => {
      this.logger.error(err);
    });

    this.messageStore.redis.on('connect', () => {
      this.logger.log(`${this.messageStore.redis.options.connectionName} connected.`);
    });
  }

  handleConnection(client: any, ..._args: any[]) {
    this.messageStore.saveConversationSession(client.handshake.auth.id);
  }

  handleDisconnect() {}

  @SubscribeMessage('user connected')
  async identity(@ConnectedSocket() socket: Socket) {
    socket.join(socket.handshake.auth.id.toString());

    const conversations = [];
    let [messages, sessions] = await Promise.all([
      this.messageStore.getMessagesForUserCache(socket.handshake.auth.id),
      this.messageStore.getAllConversationSessions(),
    ]);
    const messagesPerUser = new Map();

    if (!Array.isArray(messages) || !messages.length) {
      messages = await this.messageStore.getMessagesForUser(socket.handshake.auth.id);
      sessions = await this.messageStore.getAllConversationSessions();
    }

    messages.forEach((message: MessagePayload) => {
      const { from, to } = message;
      const otherUser = socket.handshake.auth.id === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });

    const sessionsID = [...new Set(messages.map((m) => m.to))];
    for (const id of sessionsID) {
      this.messageStore.saveConversationSession(id);
    }

    await Promise.all(
      sessions.map(async (session) => {
        const recipientID = parseInt(session.id[0], 10);
        if (messagesPerUser.get(recipientID) === undefined) return;

        const convsession = await this.messageStore.getUpdatedConvoSession(
          recipientID,
          socket.handshake.auth.id
        );
        const unread = await this.messageStore.getUnreadCount(convsession.convid, recipientID);

        conversations.push({
          id: recipientID,
          convid: convsession.convid,
          username: convsession.users[0].username,
          displayname: convsession.users[0].displayname,
          photo: convsession.users[0].photo,
          status: convsession.users[0].status,
          messages: messagesPerUser.get(recipientID),
          unread: unread,
        });
      })
    );

    socket.emit('conversations', conversations);
    socket.emit('user connected', {
      id: socket.handshake.auth.id,
    });
  }

  @SubscribeMessage('private message')
  async private_message(@ConnectedSocket() socket: Socket, @MessageBody() data: MessagePayload) {
    const fromSelf = data.to === socket.handshake.auth.id;
    const message: MessagePayload = {
      convid: data.convid ?? undefined,
      to: data.to,
      createdAt: new Date().toISOString(),
      content: data.content,
      from: socket.handshake.auth.id,
      fromSelf: fromSelf,
      fromUser: null,
      fromPhoto: null,
      read: fromSelf,
    };
    this.messageStore.saveConversationSession(socket.handshake.auth.id.toString());
    this.messageStore.saveConversationSession(data.to.toString());
    const conv = await this.messageStore.saveMessage(message);

    if (!message.fromSelf) this.server.to(conv.from.toString()).emit('private message', conv);
    this.server.to(conv.to.toString()).emit('private message', conv);
  }

  @SubscribeMessage('read message')
  async read_message(@ConnectedSocket() socket: Socket, @MessageBody() data: MessagePayload) {
    this.messageStore.updateMessagesRead(data.convid, data.to);
    this.server
      .to(socket.handshake.auth.id.toString())
      .emit('read message', { convid: data.convid, unread: 0, to: data.to, read: true });
  }
} */
