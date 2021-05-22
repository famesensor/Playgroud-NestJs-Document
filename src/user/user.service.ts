import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import logger from 'src/config/logger.config';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async getStudentProfile(id: string): Promise<any> {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .where(`user.id = :id`, { id: id })
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .leftJoinAndSelect('user.advisee', 'advisee')
      .leftJoinAndSelect('advisee.advicer', 'advicer')
      .getOne();
    if (!data) {
      logger.error(`User not found`);
      throw new NotFoundException();
    }

    return { status: true, data };
  }
}
