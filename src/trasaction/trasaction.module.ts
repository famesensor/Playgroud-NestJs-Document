import { Module } from '@nestjs/common';
import { TrasactionService } from './trasaction.service';
import { TrasactionController } from './trasaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RO01Repository } from './document-ro01.repository';
import { RO16Repository } from './document-ro16.repository';
import { RO26Repository } from './document-ro26.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RO01Repository, RO16Repository, RO26Repository]),
  ],
  providers: [TrasactionService],
  controllers: [TrasactionController],
})
export class TrasactionModule {}
