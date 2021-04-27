import { EntityRepository, Repository } from 'typeorm';
import { DocumentRO01 } from './entity/document-ro01.entity';

@EntityRepository(DocumentRO01)
export class RO01Repository extends Repository<DocumentRO01> {}
