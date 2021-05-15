import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { RO01Repository } from './document-ro01.repository';
import { RO16Repository } from './document-ro16.repository';
import { RO26Repository } from './document-ro26.repository';
import { DocumentType } from './entity/document-type.entity';
import { TrasactionController } from './transaction.controller';
import { TrasactionService } from './transaction.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from 'src/config/mailer.config';
import { TransactionDocument } from './entity/transaction.entity';
import { Approve } from './entity/approve.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RO01Repository,
      RO16Repository,
      RO26Repository,
      DocumentType,
      TransactionDocument,
      Approve,
      UserRepository,
    ]),
    AuthenticationModule,
    MailerModule.forRoot(mailConfig),
  ],
  providers: [TrasactionService, UserService],
  controllers: [TrasactionController],
})
export class TrasactionModule {}
