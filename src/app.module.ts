import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/somethingsomewhere',
    ),
    AuthModule,
    UsersModule,
    DevicesModule,
    WebsocketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
