import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async getStudentProfile(id: string) {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .where(`user.id = :id`, { id: id })
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .leftJoinAndSelect('user.advisee', 'advisee')
      .leftJoinAndSelect('advisee.advicer', 'advicer')
      .getOne();

    return { status: true, data };
  }
}
