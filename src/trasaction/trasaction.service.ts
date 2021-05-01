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
import { RO26Dto, SubjectDto } from './dto/create-ro26.dto';
import { DocumentType } from './entity/document-type.entity';

@Injectable()
export class TrasactionService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(DocumentType)
    private documentType: Repository<DocumentType>,
    @InjectRepository(RO01Repository) private ro01Repository: RO01Repository,
    @InjectRepository(RO16Repository) private re16Repository: RO16Repository,
    @InjectRepository(RO26Repository) private re26Repository: RO26Repository,
  ) {}
  // TODO: send email
  async createRO01(user: User, ro01Dto: RO01Dto): Promise<any> {
    // get student info...
    const info = await this.userRepository.getUserDetail(user.id);

    // get type document...
    const typeInfo = await this.documentType.findOne({
      type_name: 'RO-01 คำร้องทั่วไป',
    });

    if (!typeInfo) {
      throw new InternalServerErrorException();
    }

    // get teacher list...
    const teachers: User[] = [];
    const boss = await this.userRepository.findOne({ role: Role.Boss });
    if (!boss) {
      throw new NotFoundException();
    }

    const leader = await this.userRepository.findOne({ role: Role.Leader });
    if (!leader) {
      throw new NotFoundException();
    }
    teachers.push(info.advisee.advicer, leader, boss);

    return this.ro01Repository.createDocumentRO01(
      ro01Dto,
      info,
      typeInfo,
      teachers,
    );
  }

  async createRO16(user: User, ro16Dto: RO16Dto): Promise<any> {
    // get student info...
    const info = await this.userRepository.getUserDetail(user.id);

    // get type document...
    const typeInfo = await this.documentType.findOne({
      type_name: 'RO-16 คำร้องขอลาป่วย ลากิจ',
    });

    if (!typeInfo) {
      throw new InternalServerErrorException();
    }

    // get teacher list...
    const teachers: User[] = [];
    const boss = await this.userRepository.findOne({ role: Role.Boss });
    if (!boss) {
      throw new NotFoundException();
    }

    const leader = await this.userRepository.findOne({ role: Role.Leader });
    if (!leader) {
      throw new NotFoundException();
    }
    teachers.push(info.advisee.advicer, leader, boss);

    return this.re16Repository.createDocumentRO16(
      ro16Dto,
      user,
      typeInfo,
      teachers,
    );
  }

  async createRO26(user: User, subject: SubjectDto[]): Promise<any> {
    // get student info...
    const info = await this.userRepository.getUserDetail(user.id);

    // get type document...
    const typeInfo = await this.documentType.findOne({
      type_name: 'RO-16 คำร้องขอลาป่วย ลากิจ',
    });

    if (!typeInfo) {
      throw new InternalServerErrorException();
    }

    // get teacher list...
    const teachers: User[] = [];
    const boss = await this.userRepository.findOne({ role: Role.Boss });
    if (!boss) {
      throw new NotFoundException();
    }

    const leader = await this.userRepository.findOne({ role: Role.Leader });
    if (!leader) {
      throw new NotFoundException();
    }
    teachers.push(info.advisee.advicer, leader, boss);

    return this.re26Repository.createDocumentRO16(
      subject,
      info,
      typeInfo,
      teachers,
    );
  }
}
