import { EntityRepository, Repository } from 'typeorm';
import { DocumentRO16 } from './entity/document-ro16.entity';

@EntityRepository(DocumentRO16)
export class RO16Repository extends Repository<DocumentRO16> {}
