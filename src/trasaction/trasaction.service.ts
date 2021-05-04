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
import { Repository } from 'typeorm';
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
import { TransactionDocument } from './entity/trasaction.entity';
import { CommentDto } from './dto/create-comment.dto';
import { Approve } from './entity/approve.entity';
import { addMinutes } from 'src/utils/date';
import { IEmailOption } from 'src/interfaces/IEmailOption';

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

  // TODO: send email
  // create document ro01...
  async createRO01(user: User, ro01Dto: RO01Dto): Promise<any> {
    // get student info...
    const info = await this.userRepository.getUserDetail(user.id);

    // get type document...
    const typeInfo = await this.documentType.findOne({
      type_name: 'RO-01 คำร้องทั่วไป',
    });
    if (!typeInfo) {
      throw new NotFoundException(`RO01 Type Not Found.`);
    }

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
    await this.ro01Repository.createDocumentRO01(
      ro01Dto,
      info,
      typeInfo,
      teachers,
    );
    return { status: true, message: 'success' };
  }

  // TODO: send email
  // create document ro16...
  async createRO16(user: User, ro16Dto: RO16Dto): Promise<any> {
    // get student info...
    const info = await this.userRepository.getUserDetail(user.id);

    // get type document...
    const typeInfo = await this.documentType.findOne({
      type_name: 'RO-16 คำร้องขอลาป่วย ลากิจ',
    });
    if (!typeInfo) {
      throw new NotFoundException(`RO16 Type Not Found.`);
    }

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
    return { status: true, message: 'success' };
  }

  // TODO: send email
  // create document ro26...
  async createRO26(user: User, subject: SubjectDto[]): Promise<any> {
    // get student info...
    const info = await this.userRepository.getUserDetail(user.id);

    // get type document...
    const typeInfo = await this.documentType.findOne({
      type_name: 'RO-26 ใบลงทะเบียนเพิ่ม-ลด-ถอน-เปลี่ยนกลุ่ม-เปลี่ยนรายวิชา',
    });
    if (!typeInfo) {
      throw new NotFoundException(`RO26 Type Not Found.`);
    }

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
    await this.re26Repository.createDocumentRO16(
      subject,
      info,
      typeInfo,
      teachers,
    );

    return { status: true, message: 'success' };
  }

  // get documents...
  async getListDocument(
    user: User,
    paginationDto: PaginationDto,
  ): Promise<PaginationRes> {
    const { limit, filter_type, sort, order, page } = paginationDto;
    let doc = this.trasactionRepository
      .createQueryBuilder('trasaction_document')
      .leftJoinAndSelect('trasaction_document.user', 'user')
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .leftJoinAndSelect('trasaction_document.type', 'type')
      .leftJoin('trasaction_document.approve', 'approve')
      .where('approve.teacher_id = :id', { id: user.id })
      .andWhere('trasaction_document.credit = approve.step');

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
        doc = doc.addOrderBy('trasaction_document.create_date', 'ASC');
      else doc = doc.addOrderBy('trasaction_document.create_date', 'DESC');
    }

    // limit
    limit != 0 ? limit : 10;
    const offset = (page - 1) * limit;

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
  }

  // get document...
  async getDocument(id: string): Promise<any> {
    const doc = await this.trasactionRepository
      .createQueryBuilder('trasaction_document')
      .leftJoinAndSelect('trasaction_document.user', 'user')
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .leftJoinAndSelect('trasaction_document.mapping', 'mapping')
      .leftJoinAndSelect('mapping.documentRO01', 'documentRO01')
      .leftJoinAndSelect('mapping.documentRO16', 'documentRO16')
      .leftJoinAndSelect('mapping.docuemntRO26', 'docuemntRO26')
      .where('trasaction_document.id = :id', {
        id: id,
      })
      .getOne();

    if (!doc) {
      throw new NotFoundException('Document Not Found');
    }

    return { status: true, data: doc };
  }

  // TODO: send email...
  // approve and comment docuement...
  async approveDocument(
    id: string,
    userId: string,
    commentDto: CommentDto,
  ): Promise<any> {
    const { comment } = commentDto;
    const docRes = await this.trasactionRepository
      .createQueryBuilder('trasaction_document')
      .leftJoinAndSelect('trasaction_document.user', 'user')
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .leftJoinAndSelect('trasaction_document.type', 'type')
      .leftJoinAndSelect('trasaction_document.approve', 'approve')
      .where('trasaction_document.id = :id', { id })
      .andWhere(
        'approve.teacher_id = :teacher_id AND approve.status = :status',
        {
          teacher_id: userId,
          status: 'waiting',
        },
      )
      .getOne();

    if (!docRes) throw new NotFoundException(`Document Not Found.`);

    if (docRes.success) throw new BadRequestException();

    if (docRes.credit !== docRes.approve[0].step)
      throw new BadRequestException();

    const teacher = await this.userRepository.getUserDetail(userId);
    if (!teacher) throw new NotFoundException(`Teacher Not Found.`);

    try {
      // update approve...
      await this.approveRepository
        .createQueryBuilder('approve')
        .update(Approve)
        .set({
          comment: comment,
          expire_date: addMinutes(new Date(), 5),
          update_date: new Date(),
        })
        .where('approve.id = :id', { id: docRes.approve[0].id })
        .execute();

      // update trasaction...
      await this.trasactionRepository
        .createQueryBuilder('trasaction_document')
        .update(TransactionDocument)
        .set({
          update_date: new Date(),
        })
        .execute();

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
      console.log(error);
      throw new InternalServerErrorException();
    }

    return { status: true, message: 'success' };
  }

  // TODO: send email
  // confirm approve doucment...
  async confirmApprove(id: string, approveId: string): Promise<any> {
    const docRes = await this.trasactionRepository
      .createQueryBuilder('trasaction_document')
      .leftJoinAndSelect('trasaction_document.user', 'user')
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .leftJoinAndSelect('trasaction_document.type', 'type')
      .leftJoinAndSelect('trasaction_document.approve', 'approve')
      .where('trasaction_document.id = :id AND approve.status = :status', {
        id,
        status: 'waiting',
      })
      .orderBy('approve.step', 'ASC')
      .getOne();

    if (!docRes) throw new NotFoundException('Document Not Found.');

    const index = docRes.approve.findIndex((item) => {
      return item.id === approveId && item.step === docRes.credit;
    });
    if (!docRes.approve[index]) throw new BadRequestException();

    let isSuccess = false;
    let email = '';
    let subject = '';
    let template = '';
    if (docRes.approve.length === 1) {
      isSuccess = true;
      email = docRes.user.email;
      subject = `คำร้องขอ ${docRes.type.type_name} ของนักศึกษาได้รับการตอบร้อบแล้ว`;
      template = `/templates/student`;
    } else {
      // get email teacher...
      const teacher = await this.userRepository.findOne({
        id: docRes.approve[index + 1].teacher_id,
      });
      email = teacher.email;
      subject = `ท่านมีคำร้องขอ ${docRes.type.type_name} ที่รอการตอบรับ`;
      template = `/templates/teachmail`;
    }

    if (new Date() >= docRes.approve[index].expire_date)
      throw new BadRequestException();

    try {
      // update approve...
      await this.approveRepository
        .createQueryBuilder('approve')
        .update(Approve)
        .set({
          status: 'success',
          expire_date: null,
          update_date: new Date(),
        })
        .where('approve.id = :id', { id: docRes.approve[0].id })
        .execute();

      // update trasaction...
      await this.trasactionRepository
        .createQueryBuilder('trasaction_document')
        .update(TransactionDocument)
        .set({
          success: isSuccess,
          credit: () => 'credit + 1',
          update_date: new Date(),
        })
        .execute();

      // send email to teacher
      const option: IEmailOption = {
        to: email,
        subject: subject,
        template: template,
        context: {
          name: docRes.user.name,
          student_id: docRes.user.studentInfo.student_code,
          type_name: docRes.type.type_name,
          file: null,
        },
      };

      await this.sendEmail(option);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    return { status: true, message: 'success' };
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
          file: option.context.file,
          validate_url: option.context.validate_url,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
