import { EntityRepository, Repository } from 'typeorm';
import { StudentDto, StudentUUID, UserUUID } from './dto/create-student.dto';
import { SignCredentialsDto } from './dto/sign-credentials.dto';
import { StudentInfo } from './entity/student.entity';
import { User } from './entity/user.entity';
import { TeacherDto } from './dto/create-teacher.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AdvicerAdvisee } from './entity/advicer.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signInStudent(studentDto: StudentDto): Promise<any> {
    const {
      username,
      password,
      email,
      name,
      title,
      studentcode,
      semeter,
      academicyear,
      faculty,
      department,
      level,
      educationlevel,
      course,
      gpax,
      phone,
    } = studentDto;

    const user = new User();
    const studentInfo = new StudentInfo();
    const advier = new AdvicerAdvisee();

    user.id = UserUUID + uuidv4();
    user.username = username;
    user.email = email;
    user.title = title;
    user.name = name;
    user.role = 'student';
    user.signature_url =
      'https://upload.wikimedia.org/wikipedia/commons/b/bf/Signature_of_Seohyun.svg';
    user.salt = await bcrypt.genSalt();
    user.create_date = new Date();
    user.password = await this.hashPassword(password, user.salt);

    studentInfo.id = StudentUUID + uuidv4();
    studentInfo.student_code = studentcode;
    studentInfo.semeter = semeter;
    studentInfo.academic_year = academicyear;
    studentInfo.faculty = faculty;
    studentInfo.department = department;
    studentInfo.level = level;
    studentInfo.education_level = educationlevel;
    studentInfo.course = course;
    studentInfo.status = 'active';
    studentInfo.gpax = gpax;
    studentInfo.phone = phone;
    studentInfo.create_date = new Date();

    user.studentInfo = studentInfo;

    const advicer = await this.findOne({ username: 'teacher_test1' });

    advier.advisee = user;
    advier.advicer = advicer;

    try {
      await user.save();
      await advier.save();
      return { success: true };
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Email already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async signInTecher(teacherDto: TeacherDto): Promise<any> {
    const { username, password, email, name, title } = teacherDto;
    const user = new User();
    user.id = UserUUID + uuidv4();
    user.username = username;
    user.email = email;
    user.title = title;
    user.name = name;
    user.role = 'teacher';
    user.signature_url =
      'https://upload.wikimedia.org/wikipedia/commons/b/bf/Signature_of_Seohyun.svg';
    user.salt = await bcrypt.genSalt();
    user.create_date = new Date();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
      return { success: true };
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    signCredentialsDto: SignCredentialsDto,
  ): Promise<User> {
    const { username, password } = signCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
