import * as dotenv from 'dotenv';
const pathEnv =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: pathEnv });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commom/filters/exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
