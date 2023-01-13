import { UseInterceptors } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { LocalSerializer } from 'src/auth/serializers/local.serializer';

let origin: boolean | string | RegExp | (string | RegExp)[];

if (process.env.NODE_ENV === 'development') {
  origin = true;
} else if (process.env.NODE_ENV === 'production') {
  origin = ['https://kpoppop.com', /\.kpoppop\.com$/];
}
@UseInterceptors(LocalSerializer)
@WebSocketGateway({
  cors: {
    origin: origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
})
export class WebSocketServiceGateway {
  @WebSocketServer()
  protected server: Server;

  @SubscribeMessage('socket-id')
  async identity(socket: Socket): Promise<string> {
    return socket.id;
  }
}
