import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RO01Repository } from './document-ro01.repository';
import { DocumentorController } from './documentor.controller';
import { DocumentorService } from './documentor.service';

@Module({
  imports: [TypeOrmModule.forFeature([RO01Repository])],
  controllers: [DocumentorController],
  providers: [DocumentorService],
})
export class DocumentorModule {}
