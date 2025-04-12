import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @MinLength(1)
  deviceId: string;

  @IsString()
  @MinLength(1)
  connectionId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  type: string;
}
