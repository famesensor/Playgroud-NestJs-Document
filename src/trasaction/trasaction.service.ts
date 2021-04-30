import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';
import { RO01Repository } from './document-ro01.repository';
import { RO01Dto } from './dto/create-ro01.dto';
import { DocumentType } from './entity/document-type.entity';

@Injectable()
export class TrasactionService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(DocumentType)
    private documentType: Repository<DocumentType>,
    @InjectRepository(RO01Repository) private ro01Repository: RO01Repository,
  ) {}

  async createRO01(user: User, ro01Dto: RO01Dto): Promise<any> {
    const info = await this.userRepository.getUserDetail(user.id);

    if (!info) {
      throw new NotFoundException();
    }

    const typeInfo = await this.documentType.findOne({
      type_name: 'RO-01 คำร้องทั่วไป',
    });

    if (!typeInfo) {
      throw new InternalServerErrorException();
    }

    return this.ro01Repository.createDocumentRO01(ro01Dto, info, typeInfo);
  }
}
