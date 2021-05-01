import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/shared/enums/role.enum';
import { SignCredentialsDto } from 'src/user/dto/sign-credentials.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtPayload } from './strategies/jwt.payload';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(
    signCredentialsDto: SignCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(
      signCredentialsDto,
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
}
