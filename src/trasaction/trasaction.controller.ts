import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role/role.guard';
import { Roles } from 'src/shared/guards/role/roles.decorator';
import { User } from 'src/user/entity/user.entity';
import { RO01Dto } from './dto/create-ro01.dto';
import { RO16Dto } from './dto/create-ro16.dto';
import { TrasactionService } from './trasaction.service';

@Controller('trasaction')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.Student)
export class TrasactionController {
  constructor(private trasactionService: TrasactionService) {}

  @Post('/create-ro01')
  createRO01(@Body() ro01Dto: RO01Dto, @GetUser() user: User) {
    return this.trasactionService.createRO01(user, ro01Dto);
  }

  @Post('/create-ro16')
  createRO16(@Body() ro16Dto: RO16Dto, @GetUser() user: User) {
    return this.trasactionService.createRO16(user, ro16Dto);
  }
}
