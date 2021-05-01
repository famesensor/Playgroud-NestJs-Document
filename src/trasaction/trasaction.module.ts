import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { RO01Repository } from './document-ro01.repository';
import { RO16Repository } from './document-ro16.repository';
import { DocumentType } from './entity/document-type.entity';
import { TrasactionController } from './trasaction.controller';
import { TrasactionService } from './trasaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RO01Repository,
      RO16Repository,
      DocumentType,
      UserRepository,
    ]),
    AuthenticationModule,
  ],
  providers: [TrasactionService, UserService],
  controllers: [TrasactionController],
})
export class TrasactionModule {}
