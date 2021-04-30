import { User } from 'src/user/entity/user.entity';
import { EntityRepository, Repository, Transaction } from 'typeorm';
import {
  DocumentRO01,
  PREFIX_RO01,
} from '../trasaction/entity/document-ro01.entity';
import { RO01Dto } from './dto/create-ro01.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  MappingDocument,
  PREFIX_MAPPING,
} from './entity/document-mapping.entity';
import {
  PREFIX_TRASACTION,
  TransactionDocument,
} from './entity/trasaction.entity';
import { DocumentType } from './entity/document-type.entity';

@EntityRepository(DocumentRO01)
export class RO01Repository extends Repository<DocumentRO01> {
  async createDocumentRO01(
    ro01Dto: RO01Dto,
    user: User,
    type: DocumentType,
  ): Promise<any> {
    const { title, to_name } = ro01Dto;

    // Document ro01...
    const roDoc = new DocumentRO01();
    roDoc.id = `${PREFIX_RO01} ${uuidv4()}`;
    roDoc.title = title;
    roDoc.to_name = to_name;
    roDoc.createBy = user.id;
    roDoc.create_date = new Date();
    roDoc.update_date = new Date();

    // map document...
    const map = new MappingDocument();
    map.id = `${PREFIX_MAPPING} ${uuidv4()}`;
    map.documentRO01 = roDoc;
    map.create_date = new Date();
    map.update_date = new Date();

    // transaction...
    const trasaction = new TransactionDocument();
    trasaction.id = `${PREFIX_TRASACTION} ${uuidv4()}`;
    trasaction.credit = 0;
    trasaction.type = type;
    trasaction.create_date = new Date();
    trasaction.update_date = new Date();

    // approve...

    return null;
  }
}
