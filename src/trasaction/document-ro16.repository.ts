import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { UUIDGen } from 'src/utils/uuid';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { RO16Dto } from './dto/create-ro16.dto';
import { Approve, PREFIX_APPROVE } from './entity/approve.entity';
import {
  MappingDocument,
  PREFIX_MAPPING,
} from './entity/document-mapping.entity';
import { DocumentRO16, PREFIX_RO16 } from './entity/document-ro16.entity';
import { DocumentType } from './entity/document-type.entity';
import {
  PREFIX_TRASACTION,
  TransactionDocument,
} from './entity/trasaction.entity';

@EntityRepository(DocumentRO16)
export class RO16Repository extends Repository<DocumentRO16> {
  async createDocumentRO16(
    ro16Dto: RO16Dto,
    user: User,
    typeDoc: DocumentType,
    teachers: Array<User>,
  ): Promise<any> {
    const {
      to_name,
      attach_one,
      attach_two,
      wish,
      time_period,
      start_date,
      end_date,
    } = ro16Dto;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // document...
    const roDoc = new DocumentRO16();
    roDoc.id = UUIDGen(PREFIX_RO16);
    roDoc.attach_one = attach_one;
    roDoc.attach_two = attach_two;
    roDoc.to_name = to_name;
    roDoc.wish = wish;
    roDoc.time_period = time_period;
    roDoc.startDate = new Date(start_date);
    roDoc.endDate = new Date(end_date);
    roDoc.createBy = user.id;
    roDoc.create_date = new Date();
    roDoc.update_date = new Date();

    // mapping...
    const map = new MappingDocument();
    map.id = UUIDGen(PREFIX_MAPPING);
    map.documentRO16 = roDoc;
    map.create_date = new Date();
    map.update_date = new Date();

    // transaction...
    const trasaction = new TransactionDocument();
    trasaction.id = UUIDGen(PREFIX_TRASACTION);
    trasaction.credit = 1;
    trasaction.type = typeDoc;
    trasaction.user = user;
    trasaction.success = false;
    trasaction.create_date = new Date();
    trasaction.update_date = new Date();

    const approvies: Array<Approve> = [];
    let index = 1;
    for (const teacher of teachers) {
      const approve = new Approve();
      approve.id = UUIDGen(PREFIX_APPROVE);
      approve.status = `waiting`;
      approve.comment = '';
      approve.step = index;
      approve.teacher_id = teacher.id;
      approve.transaction = trasaction;
      // approve.exprieDate = null;
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
