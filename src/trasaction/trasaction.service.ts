import {
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
    private trasactionRepositoy: Repository<TransactionDocument>,
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

  // create document ro26...
  async createRO26(user: User, subject: SubjectDto[]): Promise<any> {
    // get student info...
    const info = await this.userRepository.getUserDetail(user.id);

    // get type document...
    const typeInfo = await this.documentType.findOne({
      type_name: 'RO-16 คำร้องขอลาป่วย ลากิจ',
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

  async getListDocument(
    user: User,
    paginationDto: PaginationDto,
  ): Promise<PaginationRes> {
    const { id, limit, filter_type, sort, order } = paginationDto;
    let doc = this.trasactionRepositoy
      .createQueryBuilder('trasaction_document')
      .leftJoinAndSelect('trasaction_document.user', 'user')
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .leftJoinAndSelect('trasaction_document.type', 'type');

    // filter type document...
    if (filter_type) {
      doc = doc.where('type.type_name = :typename', { typename: filter_type });
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

    if (id) {
      doc = doc.where('trasaction.id > :id', { id: id });
    }

    // limit
    doc = doc.limit(limit != 0 ? limit : 10);

    console.log(doc.getSql());

    const res = await doc.getMany();

    return {
      status: true,
      data: res,
    };
  }

  // send email to ...
  private async sendEmail(): Promise<any> {
    try {
      return await this.mailerService.sendMail({
        to: '',
        subject: '',
        template: '',
        context: {},
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
