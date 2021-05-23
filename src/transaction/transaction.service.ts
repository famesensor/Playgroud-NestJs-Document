import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/shared/enums/role.enum';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { getConnection, Repository } from 'typeorm';
import { RO01Repository } from './document-ro01.repository';
import { RO16Repository } from './document-ro16.repository';
import { RO26Repository } from './document-ro26.repository';
import { RO01Dto } from './dto/create-ro01.dto';
import { RO16Dto } from './dto/create-ro16.dto';
import { SubjectDto } from './dto/create-ro26.dto';
import { DocumentType } from './entity/document-type.entity';
import { MailerService } from '@nestjs-modules/mailer';
import {
  PaginationDto,
  PaginationRes,
} from 'src/shared/dto/pagination/pagination.dto';
import { TransactionDocument } from './entity/transaction.entity';
import { CommentDto } from './dto/create-comment.dto';
import { Approve } from './entity/approve.entity';
import { addMinutes } from 'src/utils/date';
import { IEmailOption } from 'src/interfaces/IEmailOption';
import { IPdfOption } from 'src/interfaces/IPdfOption';
import { CourseStatus, TypeDocument } from './enum/transaction.enum';
import { compile } from 'ejs';
import { create } from 'html-pdf';
import { readFileSync } from 'fs';
import logger from 'src/config/logger.config';

@Injectable()
export class TrasactionService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(DocumentType)
    private documentType: Repository<DocumentType>,
    @InjectRepository(RO01Repository) private ro01Repository: RO01Repository,
    @InjectRepository(RO16Repository) private re16Repository: RO16Repository,
    @InjectRepository(RO26Repository) private re26Repository: RO26Repository,
    @InjectRepository(TransactionDocument)
    private trasactionRepository: Repository<TransactionDocument>,
    @InjectRepository(Approve) private approveRepository: Repository<Approve>,
    private mailerService: MailerService,
  ) {}

  // create document ro01...
  async createRO01(user: User, ro01Dto: RO01Dto): Promise<any> {
    try {
      // get student info...
      const info = await this.userRepository.getUserDetail(user.id);

      // get type document...
      const typeInfo = await this.getTypeDocument(TypeDocument.RO01);

      // get teacher list...
      const teachers: User[] = [];
      const leader = await this.userRepository.findOne({ role: Role.Leader });
      if (!leader) {
        throw new NotFoundException(`Head of Department Not Found.`);
      }
      teachers.push(info.advisee.advicer, leader);

      await this.ro01Repository.createDocumentRO01(
        ro01Dto,
        info,
        typeInfo,
        teachers,
      );

      // sned email...
      const option: IEmailOption = {
        to: info.advisee.advicer.email,
        subject: `ท่านมีคำร้องขอ ${typeInfo.type_name} ที่รอการตอบรับ`,
        template: `/templates/teachmail`,
        context: {
          name: info.name,
          student_id: info.studentInfo.student_code,
          type_name: typeInfo.type_name,
        },
      };
      await this.sendEmail(option);
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }

    return { status: true, message: 'success' };
  }

  // create document ro16...
  async createRO16(user: User, ro16Dto: RO16Dto): Promise<any> {
    try {
      // get student info...
      const info = await this.userRepository.getUserDetail(user.id);

      // get type document...
      const typeInfo = await this.getTypeDocument(TypeDocument.RO16);

      // get teacher list...
      const teachers: User[] = [];
      const boss = await this.userRepository.findOne({ role: Role.Boss });
      if (!boss) {
        throw new NotFoundException(`Dean’s Not Found.`);
      }

      const leader = await this.userRepository.findOne({ role: Role.Leader });
      if (!leader) {
        throw new NotFoundException(`Head of Department Not Found.`);
      }
      teachers.push(info.advisee.advicer, leader, boss);

      await this.re16Repository.createDocumentRO16(
        ro16Dto,
        user,
        typeInfo,
        teachers,
      );

      // sned email...
      const option: IEmailOption = {
        to: info.advisee.advicer.email,
        subject: `ท่านมีคำร้องขอ ${typeInfo.type_name} ที่รอการตอบรับ`,
        template: `/templates/teachmail`,
        context: {
          name: info.name,
          student_id: info.studentInfo.student_code,
          type_name: typeInfo.type_name,
        },
      };
      await this.sendEmail(option);
    } catch (error) {
      logger.log(error);
      throw new InternalServerErrorException();
    }

    return { status: true, message: 'success' };
  }

  // create document ro26...
  async createRO26(user: User, subject: SubjectDto[]): Promise<any> {
    try {
      // get student info...
      const info = await this.userRepository.getUserDetail(user.id);

      // get type document...
      const typeInfo = await this.getTypeDocument(TypeDocument.RO26);

      // get teacher list...
      const teachers: User[] = [];
      const leader = await this.userRepository.findOne({ role: Role.Leader });
      if (!leader) {
        throw new NotFoundException(`Head of Department Not Found.`);
      }
      teachers.push(info.advisee.advicer, leader);

      await this.re26Repository.createDocumentRO16(
        subject,
        info,
        typeInfo,
        teachers,
      );

      // sned email...
      const option: IEmailOption = {
        to: info.advisee.advicer.email,
        subject: `ท่านมีคำร้องขอ ${typeInfo.type_name} ที่รอการตอบรับ`,
        template: `/templates/teachmail`,
        context: {
          name: info.name,
          student_id: info.studentInfo.student_code,
          type_name: typeInfo.type_name,
        },
      };
      await this.sendEmail(option);
    } catch (error) {
      logger.log(error);
      throw new InternalServerErrorException();
    }
    return { status: true, message: 'success' };
  }

  // get documents...
  async getListDocument(
    user: User,
    paginationDto: PaginationDto,
  ): Promise<PaginationRes> {
    const { limit, filter_type, sort, order, page } = paginationDto;
    let doc = this.trasactionRepository
      .createQueryBuilder('transaction_document')
      .leftJoinAndSelect('transaction_document.user', 'user')
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .leftJoinAndSelect('transaction_document.type', 'type')
      .leftJoin('transaction_document.approve', 'approve')
      .where('approve.teacher = :id', { id: user.id })
      .andWhere('transaction_document.credit = approve.step');

    // filter type document...
    if (filter_type) {
      doc = doc.andWhere('type.type_name = :typename', {
        typename: filter_type,
      });
    }

    // sort by column...
    let column = '';
    switch (sort) {
      case 'name': {
        column = `user.name`;
        break;
      }
      case 'std_id': {
        column = `studentInfo.student_code`;
        break;
      }
    }

    // order by ...
    if (column) {
      if (order == 'acs') doc = doc.addOrderBy(column, 'ASC');
      else doc = doc.addOrderBy(column, 'DESC');
    } else {
      if (order == 'acs')
        doc = doc.addOrderBy('transaction_document.create_date', 'ASC');
      else doc = doc.addOrderBy('transaction_document.create_date', 'DESC');
    }

    // limit
    limit != 0 ? limit : 10;
    const offset = (page - 1) * limit;

    try {
      const [res, resCount] = await Promise.all([
        doc.offset(offset).limit(limit).getMany(),
        doc.getCount(),
      ]);

      return {
        status: true,
        data: res,
        page: page,
        total: resCount < limit ? 1 : Math.floor(resCount / limit),
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // get document...
  async getDocument(id: string): Promise<any> {
    try {
      const doc = await this.trasactionRepository
        .createQueryBuilder('transaction_document')
        .leftJoinAndSelect('transaction_document.user', 'user')
        .leftJoinAndSelect('user.studentInfo', 'studentInfo')
        .leftJoinAndSelect('transaction_document.type', 'type')
        .leftJoinAndSelect('transaction_document.mapping', 'mapping')
        .leftJoinAndSelect('mapping.documentRO01', 'documentRO01')
        .leftJoinAndSelect('mapping.documentRO16', 'documentRO16')
        .leftJoinAndSelect('mapping.docuemntRO26', 'docuemntRO26')
        .where('transaction_document.id = :id', {
          id: id,
        })
        .getOne();
      if (!doc) {
        throw new NotFoundException('Document Not Found');
      }

      return { status: true, data: doc };
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // approve and comment docuement...
  async approveDocument(
    id: string,
    userId: string,
    commentDto: CommentDto,
  ): Promise<any> {
    const { comment } = commentDto;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const docRes = await this.trasactionRepository
        .createQueryBuilder('transaction_document')
        .leftJoinAndSelect('transaction_document.user', 'user')
        .leftJoinAndSelect('user.studentInfo', 'studentInfo')
        .leftJoinAndSelect('transaction_document.type', 'type')
        .leftJoinAndSelect('transaction_document.approve', 'approve')
        .where('transaction_document.id = :id', { id })
        .andWhere(
          'approve.teacherId = :teacher_id AND approve.status = :status',
          {
            teacher_id: userId,
            status: 'waiting',
          },
        )
        .getOne();

      if (!docRes) throw new NotFoundException(`Document Not Found.`);

      if (docRes.success) throw new BadRequestException();

      if (docRes.credit !== docRes.approve[0].step)
        throw new ForbiddenException();

      const teacher = await this.userRepository.getUserDetail(userId);
      if (!teacher) throw new NotFoundException(`Teacher Not Found.`);

      await queryRunner.startTransaction();

      // update approve...
      await queryRunner.manager.update(
        Approve,
        { id: docRes.approve[0].id },
        {
          comment: comment,
          expire_date: addMinutes(new Date(), 5),
          update_date: new Date(),
        },
      );

      // update trasaction...
      await queryRunner.manager.update(
        TransactionDocument,
        { id: id },
        {
          update_date: new Date(),
        },
      );

      await queryRunner.commitTransaction();

      // send email to teacher
      const option: IEmailOption = {
        to: teacher.email,
        subject: `ท่านได้ทำการตอบรับคำร้องขอ ${docRes.type.type_name}`,
        template: '/templates/mail',
        context: {
          name: docRes.user.name,
          student_id: docRes.user.studentInfo.student_code,
          type_name: docRes.type.type_name,
          validate_url: `http://localhost:3000/api/trasaction/${id}/approve/${docRes.approve[0].id}`,
        },
      };

      await this.sendEmail(option);
    } catch (error) {
      logger.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }

    return { status: true, message: 'success' };
  }

  // confirm approve doucment...
  async confirmApprove(id: string, approveId: string): Promise<any> {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const docRes = await this.trasactionRepository
        .createQueryBuilder('transaction_document')
        .leftJoinAndSelect('transaction_document.user', 'user')
        .leftJoinAndSelect('user.studentInfo', 'studentInfo')
        .leftJoinAndSelect('transaction_document.type', 'type')
        .leftJoinAndSelect('transaction_document.approve', 'approve')
        .leftJoinAndSelect('approve.teacher', 'teacher')
        .where('transaction_document.id = :id AND approve.status = :status', {
          id,
          status: 'waiting',
        })
        .orderBy('approve.step', 'ASC')
        .getOne();

      if (!docRes) throw new NotFoundException('Document Not Found.');

      const index = docRes.approve.findIndex((item) => {
        return item.id === approveId && item.step === docRes.credit;
      });
      if (!docRes.approve[index]) throw new ForbiddenException();

      let isSuccess = true;
      let email = docRes.user.email;
      let subject = `คำร้องขอ ${docRes.type.type_name} ของนักศึกษาได้รับการตอบร้อบแล้ว`;
      let template = `/templates/student`;
      const pdfLink = `http://localhost:3000/api/trasaction/${id}/download-document`;
      if (docRes.approve.length !== 1) {
        const teacher = docRes.approve[index + 1].teacher;
        isSuccess = false;
        email = teacher.email;
        subject = `ท่านมีคำร้องขอ ${docRes.type.type_name} ที่รอการตอบรับ`;
        template = `/templates/teachmail`;
      }

      if (new Date() >= docRes.approve[index].expire_date)
        throw new BadRequestException();

      await queryRunner.startTransaction();

      // update approve...
      await queryRunner.manager.update(
        Approve,
        { id: docRes.approve[0].id },
        { status: 'success', expire_date: null, update_date: new Date() },
      );

      // update trasaction...
      await queryRunner.manager.update(
        TransactionDocument,
        { id: id },
        {
          success: isSuccess,
          credit: () => 'credit + 1',
          update_date: new Date(),
        },
      );
      await queryRunner.commitTransaction();

      // send email to teacher
      const option: IEmailOption = {
        to: email,
        subject: subject,
        template: template,
        context: {
          name: docRes.user.name,
          student_id: docRes.user.studentInfo.student_code,
          type_name: docRes.type.type_name,
          pdf_link: pdfLink,
        },
      };
      await this.sendEmail(option);
    } catch (error) {
      logger.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
    // return;
    return { status: true, message: 'success' };
  }

  async downloadDocument(id: string): Promise<Buffer> {
    try {
      const info = await this.trasactionRepository
        .createQueryBuilder('transaction_document')
        .leftJoinAndSelect('transaction_document.user', 'user')
        .leftJoinAndSelect('user.studentInfo', 'studentInfo')
        .leftJoinAndSelect('transaction_document.type', 'type')
        .leftJoinAndSelect('transaction_document.approve', 'approve')
        .leftJoinAndSelect('transaction_document.mapping', 'mapping')
        .leftJoinAndSelect('mapping.documentRO01', 'documentRO01')
        .leftJoinAndSelect('mapping.documentRO16', 'documentRO16')
        .leftJoinAndSelect('mapping.docuemntRO26', 'docuemntRO26')
        .leftJoinAndSelect('docuemntRO26.ro26course', 'ro26course')
        .leftJoinAndSelect('approve.teacher', 'teacher')
        .where('transaction_document.id = :id ', { id: id })
        .orderBy('approve.step', 'ASC')
        .getOne();

      if (!info) throw new NotFoundException('Document Not Found');

      let doc: any;
      let path: string;
      switch (info.type.type_name) {
        case TypeDocument.RO01: {
          path = '/RO01';
          doc = info.mapping.documentRO01;
          break;
        }
        case TypeDocument.RO16: {
          path = '/RO16';
          doc = info.mapping.documentRO16;
          break;
        }
        case TypeDocument.RO26: {
          path = '/RO26';
          doc = {
            ADDSUBJECT: info.mapping.docuemntRO26.ro26course.filter(
              (i) => i.type === CourseStatus.ADD_SUBJECT,
            ),
            WITHDRAWAL: info.mapping.docuemntRO26.ro26course.filter(
              (i) => i.type === CourseStatus.ADD_SUBJECT,
            ),
            CHANGESECTION: info.mapping.docuemntRO26.ro26course.filter(
              (i) => i.type === CourseStatus.ADD_SUBJECT,
            ),
          };
          break;
        }
      }
      const infoPdf: IPdfOption = {
        template: path,
        student: info.user,
        data: doc,
        approves: info.approve,
      };

      const buffer = await this.generatePDF(infoPdf);
      return buffer;
    } catch (error) {
      logger.log(error);
      throw new InternalServerErrorException();
    }
  }

  // get type document...
  async getTypeDocument(typeName: string): Promise<DocumentType> {
    const typeInfo = await this.documentType.findOne({
      type_name: typeName,
    });

    if (!typeInfo) {
      throw new NotFoundException(`RO01 Type Not Found.`);
    }

    return typeInfo;
  }

  // send email to ...
  private async sendEmail(option: IEmailOption): Promise<any> {
    try {
      return await this.mailerService.sendMail({
        to: option.to,
        subject: option.subject,
        template: __dirname + option.template,
        context: {
          name: option.context.name,
          student_id: option.context.student_id,
          type_name: option.context.type_name,
          validate_url: option.context.validate_url,
          pdf_link: option.context.pdf_link,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // generate pdf...
  private async generatePDF(option: IPdfOption): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const complieFile = compile(
        readFileSync(
          __dirname + `/templates/${option.template}/html.ejs`,
          'utf-8',
        ),
      );

      const complieContent = complieFile({
        student: option.student,
        data: option.data,
        approves: option.approves,
      });

      create(complieContent, {
        format: 'A4',
      }).toBuffer((err, res) => {
        if (err) {
          reject(reject);
        } else {
          resolve(res);
        }
      });
    });
  }
}
