import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { StudentDto } from './dto/create-student.dto';
import { TeacherDto } from './dto/create-teacher.dto';
import { SignCredentialsDto } from './dto/sign-credentials.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
  ) {}

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signCredentialsDto: SignCredentialsDto,
  ): Promise<any> {
    return this.authService.signIn(signCredentialsDto);
  }

  @Post('/signup-teacher')
  signUpTeacher(@Body() teacherDto: TeacherDto): Promise<any> {
    return this.userService.signUpTeacher(teacherDto);
  }

  @Post('/signup-student')
  signUpStudent(@Body() studentDto: StudentDto): Promise<any> {
    return this.userService.signUpStudent(studentDto);
  }

  @Get('/:id')
  getUser(@Param('id') id: string): Promise<any> {
    return this.userService.getStudentProfile(id);
  }
}
