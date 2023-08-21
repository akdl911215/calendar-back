import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './_common/exceptions/http.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalReturnResponseInterceptor } from './_common/interceptors/global.return.response.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new GlobalReturnResponseInterceptor());

  const configService = app.get(ConfigService);
  const PORT: number = configService.get<number>('PORT');
  const HOST: string = configService.get<string>('HOST');

  const config = new DocumentBuilder()
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh_token',
    )
    .setTitle('CALENDAR-SERVER')
    .setDescription('The CALENDAR-SERVER API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => console.log(`http://${HOST}:${PORT}/docs`));
}
bootstrap().then(() => console.log('bootstrap start'));
