import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDto } from './dto/create-student.dto';
import { TeacherDto } from './dto/create-teacher.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUpTeacher(teacherDto: TeacherDto) {
    return this.userRepository.signInTecher(teacherDto);
  }

  async signUpStudent(studentDto: StudentDto) {
    return this.userRepository.signInStudent(studentDto);
  }

  async getStudentProfile(id: string) {
    const data = await this.userRepository
      .createQueryBuilder('user')
      .where(`user.id = :id`, { id: id })
      .leftJoinAndSelect('user.studentInfo', 'studentInfo')
      .getMany();

    return data;
  }
}
