import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/shared/enums/role.enum';
import { UserRepository } from 'src/user/user.repository';
import { StudentDto } from './dto/create-student.dto';
import { TeacherDto } from './dto/create-teacher.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';
import { JwtPayload } from './strategies/jwt.payload';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(
      signInCredentialsDto,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    let role = user.role;
    if (role != Role.Student) role = 'teacher';

    const payload: JwtPayload = {
      user_id: user.id,
      username: user.username,
      role: role,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async signUpTeacher(teacherDto: TeacherDto) {
    return this.userRepository.signInTecher(teacherDto);
  }

  async signUpStudent(studentDto: StudentDto) {
    return this.userRepository.signInStudent(studentDto);
  }
}
