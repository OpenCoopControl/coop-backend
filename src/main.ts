import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.enableCors();

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config: DocumentBuilder = new DocumentBuilder() as DocumentBuilder;
  const builtConfig = config
    .setTitle('OpenCoopControl API')
    .setDescription('API documentation for the OpenCoopControl project')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('devices', 'Device management endpoints')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(
    app,
    builtConfig,
  );

  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('API_PORT', 3000);
  const nodeEnv = process.env.NODE_ENV || 'development';

  await app.listen(port);

  const baseUrl = await app.getUrl();

  const divider = '═'.repeat(60);

  logger.log(divider);
  logger.log(
    `${'║'.padEnd(18)} OPENCOOPCONTROL API SERVER ${'║'.padStart(18)}`,
  );
  logger.log(divider);
  logger.log('');
  logger.log(`🚀 Environment    : ${nodeEnv.toUpperCase()}`);
  logger.log(`🚪 Port           : ${port}`);
  logger.log(`🔗 Server URL     : ${baseUrl}`);
  logger.log(`📚 API Docs URL   : ${baseUrl}/api-docs`);
  logger.log(`🌐 API Base Path  : ${baseUrl}/api/v1`);
  logger.log('');
  logger.log(divider);

  if (nodeEnv === 'development') {
    logger.debug('Debug logging is enabled in development mode');
  }
}

bootstrap();
