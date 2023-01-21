import { Module } from '@nestjs/common';
import { DiscordAuthModule } from 'src/auth/discord.module';
import { UserModule } from 'src/user/user.module';
import { WebSocketServiceGateway } from './websocket.gateway';

@Module({
  imports: [DiscordAuthModule, UserModule],
  providers: [WebSocketServiceGateway],
})
export class WebSocketModule {}
