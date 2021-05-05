import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { StudentDto } from './dto/create-student.dto';
import { TeacherDto } from './dto/create-teacher.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Post('/signin')
  signIn(@Body() signInCredentialsDto: SignInCredentialsDto): Promise<any> {
    return this.authService.signIn(signInCredentialsDto);
  }

  // this func for mock user
  @Post('/signup-teacher')
  signUpTeacher(@Body() teacherDto: TeacherDto): Promise<any> {
    return this.authService.signUpTeacher(teacherDto);
  }

  // this func for mock user
  @Post('/signup-student')
  signUpStudent(@Body() studentDto: StudentDto): Promise<any> {
    return this.authService.signUpStudent(studentDto);
  }
}
