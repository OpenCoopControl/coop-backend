import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Device, DeviceSchema } from './schemas/device.schema';
import { WebsocketsModule } from '../websockets/websockets.module';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    forwardRef(() => WebsocketsModule),
    UsersModule,
    EmailModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
