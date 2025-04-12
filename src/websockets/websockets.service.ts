import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WebsocketsService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  broadcastUpdate(deviceId: string, status: string) {
    if (this.server) {
      this.server.emit('status_update', { deviceId, status });
    }
  }

  sendAction(deviceId: string, action: string) {
    if (this.server) {
      this.server.to(deviceId).emit('action', { action });
    }
  }
}
