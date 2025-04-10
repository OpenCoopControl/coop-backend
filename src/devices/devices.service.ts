import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { Device } from './schemas/device.schema';
import { CreateDeviceDto } from '../common/dto/create-device.dto';
import { WebsocketsService } from '../websockets/websockets.service';

type DeviceDocument = Device & Document;

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    private readonly websocketsService: WebsocketsService,
  ) {}

  async registerDevice(
    userId: string,
    createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    const { deviceId }: { deviceId: string } = createDeviceDto;

    const existingDevice: DeviceDocument | null = await this.deviceModel
      .findOne({ deviceId })
      .exec();
    if (existingDevice) {
      throw new ConflictException('Device ID already registered');
    }

    const newDevice: DeviceDocument = new this.deviceModel({
      deviceId,
      userId,
      status: 'offline',
      lastSeen: null,
    });
    return newDevice.save();
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
}
