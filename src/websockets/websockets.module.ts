import { Module, forwardRef } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';
import { WebsocketsService } from './websockets.service';
import { DevicesModule } from '../devices/devices.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => DevicesModule), UsersModule],
  providers: [WebsocketsGateway, WebsocketsService],
  exports: [WebsocketsService],
})
export class WebsocketsModule {}
