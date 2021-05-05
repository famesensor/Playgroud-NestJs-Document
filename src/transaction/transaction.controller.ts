import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/shared/guards/role/role.guard';
import { Roles } from 'src/shared/guards/role/roles.decorator';
import { User } from 'src/user/entity/user.entity';
import { RO01Dto } from './dto/create-ro01.dto';
import { RO16Dto } from './dto/create-ro16.dto';
import { RO26Dto } from './dto/create-ro26.dto';
import { TrasactionService } from './transaction.service';
import { CourseTypeValidationPipe } from './pipe/course-status-validation.pipe';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { CommentDto } from './dto/create-comment.dto';

@Controller('trasaction')
export class TrasactionController {
  constructor(private trasactionService: TrasactionService) {}

  @Roles(Role.Student)
  @UseGuards(AuthGuard(), RolesGuard)
  @Post('/create-ro01')
  createRO01(@Body() ro01Dto: RO01Dto, @GetUser() user: User) {
    return this.trasactionService.createRO01(user, ro01Dto);
  }

  @Roles(Role.Student)
  @UseGuards(AuthGuard(), RolesGuard)
  @Post('/create-ro16')
  createRO16(@Body() ro16Dto: RO16Dto, @GetUser() user: User) {
    return this.trasactionService.createRO16(user, ro16Dto);
  }

  @Roles(Role.Student)
  @UseGuards(AuthGuard(), RolesGuard)
  @Post('/create-ro26')
  createRO26(
    @Body(CourseTypeValidationPipe) ro26Dto: RO26Dto,
    @GetUser() user: User,
  ) {
    return this.trasactionService.createRO26(user, ro26Dto.subject);
  }

  @Roles(Role.Teacher)
  @UseGuards(AuthGuard(), RolesGuard)
  @Get()
  getListDocuemnt(
    @GetUser() user: User,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.trasactionService.getListDocument(user, paginationDto);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Get('/:id')
  getDocument(@Param('id') id: string) {
    return this.trasactionService.getDocument(id);
  }

  @Roles(Role.Teacher)
  @UseGuards(AuthGuard(), RolesGuard)
  @Patch('/:id')
  approveDocument(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() commentDto: CommentDto,
  ) {
    return this.trasactionService.approveDocument(id, user.id, commentDto);
  }

  @Roles(Role.Teacher)
  @Get('/:id/approve/:approve_id')
  confirmApprove(
    @Param('id') id: string,
    @Param('approve_id') approveId: string,
  ) {
    return this.trasactionService.confirmApprove(id, approveId);
  }
}
