import { User } from 'src/user/entity/user.entity';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import {
  DocumentRO01,
  PREFIX_RO01,
} from '../transaction/entity/document-ro01.entity';
import { RO01Dto } from './dto/create-ro01.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  MappingDocument,
  PREFIX_MAPPING,
} from './entity/document-mapping.entity';
import {
  PREFIX_TRASACTION,
  TransactionDocument,
} from './entity/transaction.entity';
import { DocumentType } from './entity/document-type.entity';
import { Approve, PREFIX_APPROVE } from './entity/approve.entity';
import { InternalServerErrorException } from '@nestjs/common';

// TODO: add trasaction for insert data
@EntityRepository(DocumentRO01)
export class RO01Repository extends Repository<DocumentRO01> {
  async createDocumentRO01(
    ro01Dto: RO01Dto,
    user: User,
    typeDoc: DocumentType,
    teachers: Array<User>,
  ): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    const { title, to_name, reason } = ro01Dto;

    // Document ro01...
    const roDoc = new DocumentRO01();
    roDoc.id = `${PREFIX_RO01}${uuidv4()}`;
    roDoc.title = title;
    roDoc.to_name = to_name;
    roDoc.reason = reason;
    roDoc.createBy = user.id;
    roDoc.create_date = new Date();
    roDoc.update_date = new Date();

    // transaction...
    const trasaction = new TransactionDocument();
    trasaction.id = `${PREFIX_TRASACTION}${uuidv4()}`;
    trasaction.credit = 1;
    trasaction.type = typeDoc;
    trasaction.user = user;
    trasaction.success = false;
    trasaction.create_date = new Date();
    trasaction.update_date = new Date();

    // map document..
    const map = new MappingDocument();
    map.id = `${PREFIX_MAPPING}${uuidv4()}`;
    map.documentRO01 = roDoc;
    map.create_date = new Date();
    map.update_date = new Date();

    // // approve...
    const approvies: Array<Approve> = [];
    let index = 1;
    for (const teacher of teachers) {
      const approve = new Approve();
      approve.id = `${PREFIX_APPROVE}${uuidv4()}`;
      approve.status = `waiting`;
      approve.comment = '';
      approve.step = index;
      approve.teacher = teacher;
      approve.transaction = trasaction;
      // approve.exprieDate = new Date();
      approve.create_date = new Date();
      approve.update_date = new Date();
      approvies.push(approve);
      index += 1;
    }

    trasaction.mapping = map;
    trasaction.approve = approvies;

    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(trasaction);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return null;
  }
}
