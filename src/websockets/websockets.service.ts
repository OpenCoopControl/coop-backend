import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebsocketsGateway } from './websockets.gateway';

@Injectable()
export class WebsocketsService {
  constructor(private readonly websocketsGateway: WebsocketsGateway) {}

  broadcastUpdate(deviceId: string, status: string) {
    const server: Server = this.websocketsGateway.server;
    server.emit('status_update', { deviceId, status });
  }

  sendAction(deviceId: string, action: string) {
    const server: Server = this.websocketsGateway.server;
    server.to(deviceId).emit('action', { action });
  }
}
