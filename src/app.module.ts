import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/cpp',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    DevicesModule,
    WebsocketsModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
