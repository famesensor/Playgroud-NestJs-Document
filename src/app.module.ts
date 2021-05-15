import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { TrasactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './commom/middlewares/logger.middleware';
import { AuthenticationController } from './authentication/authentication.controller';
import { UserController } from './user/user.controller';
import { TrasactionController } from './transaction/transaction.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthenticationModule,
    UserModule,
    TrasactionModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        AuthenticationController,
        UserController,
        TrasactionController,
      );
  }
}
