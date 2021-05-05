import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { TrasactionModule } from './transaction/transaction.module';
import { PDFModule } from '@t00nday/nestjs-pdf';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthenticationModule,
    UserModule,
    TrasactionModule,
    PDFModule.register({
      isGlobal: true,
      view: {
        root: __dirname + '/transaction/templates',
        engine: 'ejs',
      },
    }),
  ],
})
export class AppModule {}
