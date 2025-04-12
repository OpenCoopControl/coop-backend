import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Device } from './schemas/device.schema';
import { CreateDeviceDto } from '../common/dto/create-device.dto';
import { WebsocketsService } from '../websockets/websockets.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

type DeviceDocument = Device & Document;

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @Inject(forwardRef(() => WebsocketsService))
    private readonly websocketsService: WebsocketsService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async registerDevice(
    userId: string,
    createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    const { deviceId, connectionId, name, type } = createDeviceDto;

    const user = await this.usersService.findById(userId);
    if (!user || user.connectionId !== connectionId) {
      throw new ForbiddenException('Invalid connection ID');
    }

    const existingDevice: DeviceDocument | null = await this.deviceModel
      .findOne({ deviceId })
      .exec();
    if (existingDevice) {
      if (existingDevice.userId !== userId) {
        throw new ConflictException(
          'Device ID already registered to another user',
        );
      }
      existingDevice.name = name || existingDevice.name;
      existingDevice.type = type || existingDevice.type;
      return existingDevice.save();
    }

    const newDevice: DeviceDocument = new this.deviceModel({
      deviceId,
      userId,
      status: 'offline',
      lastSeen: null,
      name: name || `Device ${deviceId.substring(0, 5)}`,
      type: type || 'unknown',
    });

    const savedDevice = await newDevice.save();

    await this.emailService.sendDeviceRegisteredEmail(user.email, deviceId);

    return savedDevice;
  }

  async getUserDevices(userId: string): Promise<Device[]> {
    return this.deviceModel.find({ userId }).exec();
  }

  async sendAction(
    userId: string,
    deviceId: string,
    action: string,
  ): Promise<void> {
    const device: DeviceDocument | null = await this.deviceModel
      .findOne({ deviceId })
      .exec();
    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.userId !== userId) {
      throw new ForbiddenException('You do not own this device');
    }

    device.lastSeen = new Date();
    await device.save();

    this.websocketsService.sendAction(deviceId, action);
  }

  async updateDeviceStatus(deviceId: string, status: string): Promise<void> {
    const device = await this.deviceModel.findOne({ deviceId }).exec();
    if (device) {
      device.status = status;
      device.lastSeen = new Date();
      await device.save();

      this.websocketsService.broadcastUpdate(deviceId, status);
    }
  }
}
