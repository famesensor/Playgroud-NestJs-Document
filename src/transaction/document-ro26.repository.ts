import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { UUIDGen } from 'src/utils/uuid';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { SubjectDto } from './dto/create-ro26.dto';
import { Approve, PREFIX_APPROVE } from './entity/approve.entity';
import {
  MappingDocument,
  PREFIX_MAPPING,
} from './entity/document-mapping.entity';
import { DocumentRO26, PREFIX_RO26 } from './entity/document-ro26.entity';
import { DocumentType } from './entity/document-type.entity';
import { PREFIX_COURSE, RO26Course } from './entity/ro26-course.entity';
import {
  PREFIX_TRASACTION,
  TransactionDocument,
} from './entity/transaction.entity';

@EntityRepository(DocumentRO26)
export class RO26Repository extends Repository<DocumentRO26> {
  async createDocumentRO16(
    subject: SubjectDto[],
    user: User,
    typeDoc: DocumentType,
    teachers: Array<User>,
  ): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    // document...
    const roDoc = new DocumentRO26();
    roDoc.id = UUIDGen(PREFIX_RO26);
    roDoc.createBy = user.id;
    roDoc.create_date = new Date();
    roDoc.update_date = new Date();

    // course...
    const courseDoc: Array<RO26Course> = [];
    subject.forEach((item) => {
      const doc = new RO26Course();
      doc.id = UUIDGen(PREFIX_COURSE);
      doc.course_code = item.course_code;
      doc.group_number = item.group_number;
      doc.credit = item.credit;
      doc.type = item.type;
      doc.createBy = user.id;
      doc.create_date = new Date();
      doc.update_date = new Date();

      courseDoc.push(doc);
    });

    roDoc.ro26course = courseDoc;

    // mapping...
    const map = new MappingDocument();
    map.id = UUIDGen(PREFIX_MAPPING);
    map.docuemntRO26 = roDoc;
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
      approve.teacher = teacher;
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
