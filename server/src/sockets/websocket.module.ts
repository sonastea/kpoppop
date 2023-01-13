import { Module } from '@nestjs/common';
import { WebSocketServiceGateway } from './websocket.gateway';

@Module({
  providers: [WebSocketServiceGateway],
})
export class WebSocketModule {}
