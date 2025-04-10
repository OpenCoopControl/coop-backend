import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateDeviceDto } from '../common/dto/create-device.dto';
import { AuthRequest } from '../common/interfaces/auth-request.interface';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async registerDevice(
    @Req() req: AuthRequest,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    return this.devicesService.registerDevice(req.user.userId, createDeviceDto);
  }

  @Get('my-devices')
  @UseGuards(JwtAuthGuard)
  async getUserDevices(@Req() req: AuthRequest) {
    return this.devicesService.getUserDevices(req.user.userId);
  }

  @Post(':deviceId/action')
  @UseGuards(JwtAuthGuard)
  async sendDeviceAction(
    @Req() req: AuthRequest,
    @Param('deviceId') deviceId: string,
    @Body('action') action: string,
  ) {
    return this.devicesService.sendAction(req.user.userId, deviceId, action);
  }
}
