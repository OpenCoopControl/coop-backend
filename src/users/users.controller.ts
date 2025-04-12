import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRequest } from '../common/interfaces/auth-request.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/common/dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify user email' })
  @ApiParam({ name: 'token', description: 'Email verification token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({
    status: 404,
    description: 'Invalid or expired verification token',
  })
  async verifyEmail(@Param('token') token: string) {
    await this.usersService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user information',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserInfo(@Req() req: AuthRequest) {
    return this.usersService.findById(req.user.userId);
  }
}
