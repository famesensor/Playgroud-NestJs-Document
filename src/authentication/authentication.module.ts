import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { AuthenticationService } from './authentication.service';
import {
  JWTExportationModules,
  model_importation,
} from './strategies/jwt.strategy';

@Module({
  imports: [...model_importation, TypeOrmModule.forFeature([UserRepository])],
  providers: [AuthenticationService, JwtModule],
  exports: [...JWTExportationModules],
})
export class AuthenticationModule {}
