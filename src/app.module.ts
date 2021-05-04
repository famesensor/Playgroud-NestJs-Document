import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { TrasactionModule } from './trasaction/trasaction.module';
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
        root: __dirname + '/trasaction/templates',
        engine: 'ejs',
      },
    }),
  ],
})
export class AppModule {}
