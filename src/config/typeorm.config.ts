import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { fstat, readFileSync } from 'fs';

const dbConfig = config.get('db');
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  ssl: {
    ca: readFileSync('./config/ca-certificate.crt'),
  },
  entities: [__dirname + '/../**/entity/*.entity.{js,ts}'],
  synchronize: dbConfig.synchronize,
};
