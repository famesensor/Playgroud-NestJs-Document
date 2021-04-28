import { EntityRepository, Repository } from 'typeorm';
import { DocumentRO26 } from './entity/document-ro26.entity';

@EntityRepository(DocumentRO26)
export class RO26Repository extends Repository<DocumentRO26> {}
