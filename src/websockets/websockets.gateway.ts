import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('device_connect')
  handleDeviceConnect(@MessageBody() data: { deviceId: string }) {
    console.log(`Device connected: ${data.deviceId}`);
    this.server.emit('status_update', {
      deviceId: data.deviceId,
      status: 'online',
    });
  }

  @SubscribeMessage('device_action')
  handleDeviceAction(
    @MessageBody() data: { deviceId: string; action: string },
  ) {
    console.log(`Action received for ${data.deviceId}: ${data.action}`);
    this.server.to(data.deviceId).emit('action', { action: data.action });
  }
}
