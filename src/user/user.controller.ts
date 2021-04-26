import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role/role.guard';
import { Roles } from 'src/shared/guards/role/roles.decorator';
import { StudentDto } from './dto/create-student.dto';
import { TeacherDto } from './dto/create-teacher.dto';
import { SignCredentialsDto } from './dto/sign-credentials.dto';
import { User } from './model/user.entity';
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

  // this func for mock user
  @Post('/signup-teacher')
  signUpTeacher(@Body() teacherDto: TeacherDto): Promise<any> {
    return this.userService.signUpTeacher(teacherDto);
  }

  // this func for mock user
  @Post('/signup-student')
  signUpStudent(@Body() studentDto: StudentDto): Promise<any> {
    return this.userService.signUpStudent(studentDto);
  }

  // this func is check UseGuards
  @Get('/me')
  @Roles(Role.Student)
  @UseGuards(AuthGuard(), RolesGuard)
  getUser(@GetUser() user: User): Promise<any> {
    return this.userService.getStudentProfile(user.id);
  }
}
