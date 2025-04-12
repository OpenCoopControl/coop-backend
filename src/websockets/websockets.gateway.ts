import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, forwardRef } from '@nestjs/common';
import { DevicesService } from '../devices/devices.service';
import { UsersService } from '../users/users.service';
import { WebsocketsService } from './websockets.service';

@WebSocketGateway()
export class WebsocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private deviceConnections = new Map<string, Socket>();

  constructor(
    private websocketsService: WebsocketsService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => DevicesService))
    private readonly devicesService: DevicesService,
  ) {}

  afterInit() {
    this.websocketsService.setServer(this.server);
  }

  async handleConnection(client: Socket): Promise<void> {
    const deviceId = client.handshake.query.deviceId as string;
    const connectionId = client.handshake.query.connectionId as string;

    if (!deviceId || !connectionId) {
      client.disconnect();
      return;
    }

    const user = await this.usersService.findByConnectionId(connectionId);
    if (!user) {
      client.disconnect();
      return;
    }

    client.join(deviceId);
    this.deviceConnections.set(deviceId, client);

    await this.devicesService.updateDeviceStatus(deviceId, 'online');
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const deviceId = client.handshake.query.deviceId as string;

    if (deviceId) {
      this.deviceConnections.delete(deviceId);
      await this.devicesService.updateDeviceStatus(deviceId, 'offline');
    }
  }

  @SubscribeMessage('device_status')
  async handleDeviceStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { status: string },
  ): Promise<void> {
    const deviceId = client.handshake.query.deviceId as string;
    if (deviceId) {
      await this.devicesService.updateDeviceStatus(deviceId, data.status);
    }
  }

  @SubscribeMessage('device_action')
  handleDeviceAction(
    @MessageBody() data: { deviceId: string; action: string },
  ): void {
    this.server.to(data.deviceId).emit('action', { action: data.action });
  }
}
