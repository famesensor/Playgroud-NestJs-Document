import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { HttpExceptionFilter } from './commom/filters/exceptions.filter';

async function bootstrap() {
  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
}
bootstrap();
