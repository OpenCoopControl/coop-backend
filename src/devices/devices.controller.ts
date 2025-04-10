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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new device' })
  @ApiBody({ type: CreateDeviceDto })
  @ApiResponse({ status: 201, description: 'Device successfully registered' })
  @ApiResponse({ status: 409, description: 'Device ID already registered' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async registerDevice(
    @Req() req: AuthRequest,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    return this.devicesService.registerDevice(req.user.userId, createDeviceDto);
  }

  @Get('my-devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all devices for current user' })
  @ApiResponse({ status: 200, description: 'Returns the list of user devices' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserDevices(@Req() req: AuthRequest) {
    return this.devicesService.getUserDevices(req.user.userId);
  }

  @Post(':deviceId/action')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send action to a device' })
  @ApiParam({ name: 'deviceId', description: 'Device ID' })
  @ApiBody({ schema: { properties: { action: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Action sent successfully' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  @ApiResponse({ status: 403, description: 'You do not own this device' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendDeviceAction(
    @Req() req: AuthRequest,
    @Param('deviceId') deviceId: string,
    @Body('action') action: string,
  ) {
    return this.devicesService.sendAction(req.user.userId, deviceId, action);
  }
}
