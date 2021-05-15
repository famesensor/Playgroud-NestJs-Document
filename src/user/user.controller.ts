import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role/role.guard';
import { Roles } from 'src/shared/guards/role/roles.decorator';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // this func is check UseGuards
  @Get('/me')
  @Roles(Role.Student)
  @UseGuards(AuthGuard(), RolesGuard)
  getUser(@GetUser() user: User): Promise<any> {
    return this.userService.getStudentProfile(user.id);
  }
}
