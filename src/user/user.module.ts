import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), AuthenticationModule],
  controllers: [UserController],
  providers: [UserService, AuthenticationService],
})
export class UserModule {}
