import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { readFileSync } from 'fs';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'documentor',
  ssl: {
    ca: readFileSync('./config/ca-certificate.crt'),
  },
  entities: [__dirname + '/../**/entity/*.entity.{js,ts}'],
  synchronize: true,
};
