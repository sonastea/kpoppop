import { Logger, UseInterceptors } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { WebSocketSessionInterceptor } from './websocket.interceptor';
import { WebSocketStoreService } from './websocket.service';

let origin: boolean | string | RegExp | (string | RegExp)[];

if (process.env.NODE_ENV === 'development') {
  origin = true;
} else if (process.env.NODE_ENV === 'production') {
  origin = ['https://kpoppop.com', /\.kpoppop\.com$/];
}

export type MessagePayload = {
  to: number;
  createdAt: string;
  content: string;
  from: number;
  fromSelf: boolean;
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
  private readonly messageStore = new WebSocketStoreService();

  @WebSocketServer()
  protected server: Server;

  afterInit() {
    this.logger.log(`${WebSocketServer.name} is now online.`);
  }

  handleConnection(_client: any, ..._args: any[]) {}

  handleDisconnect(_client: any) {
    // handle this when user disconnects, remove them from map sockets
  }

  @SubscribeMessage('user connected')
  async identity(@ConnectedSocket() socket: Socket) {
    socket.join(socket.handshake.auth.id.toString());

    const conversations = [];
    const [messages, sessions] = await Promise.all([
      this.messageStore.getMessagesForUser(socket.handshake.auth.id),
      this.messageStore.getAllConversationSessions(),
    ]);
    const messagesPerUser = new Map();

    /* console.log(messages); */
    messages.forEach((message: MessagePayload) => {
      const { from, to } = message;
      const otherUser = socket.handshake.auth.id === from ? to : from;
      if (messagesPerUser.has(otherUser)) {
        messagesPerUser.get(otherUser).push(message);
      } else {
        messagesPerUser.set(otherUser, [message]);
      }
    });

    sessions.forEach((session: { userID: string }) => {
      const userID = parseInt(session.userID[0], 10);
      conversations.push({
        userID: userID,
        messages: messagesPerUser.get(userID) || [],
      });
    });
    socket.emit('conversations', conversations);

    socket.emit('user connected', {
      test: 'test',
      userID: socket.handshake.auth.id,
    });
  }

  @SubscribeMessage('private message')
  async private_message(@ConnectedSocket() socket: Socket, @MessageBody() data: MessagePayload) {
    const message: MessagePayload = {
      to: data.to,
      createdAt: new Date().toISOString(),
      content: data.content,
      from: socket.handshake.auth.id,
    };
    this.server.to(data.to.toString()).emit('private message', message);
    this.messageStore.saveConversationSession(socket.handshake.auth.id.toString());
    this.messageStore.saveMessage(message);
  }
}
