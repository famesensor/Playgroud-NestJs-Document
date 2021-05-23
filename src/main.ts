import * as dotenv from 'dotenv';
const pathEnv =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: pathEnv });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commom/filters/exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import * as moment from 'moment';
import logger from './config/logger.config';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  morgan.token('date', (req, res, tz) => {
    return moment().format();
  });
  morgan.format(
    'myformat',
    '[:date[Asia/Taipei]] ":method :url" :status :res[content-length] - :req[user-agent] :response-time ms',
  );
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.warn(message),
      },
    }),
  );
  await app.listen(port);
}
bootstrap();
