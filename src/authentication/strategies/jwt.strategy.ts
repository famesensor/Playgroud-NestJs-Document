import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport';
import { UserRepository } from 'src/user/user.repository';
import * as config from 'config';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { User } from 'src/user/model/user.entity';

const jwtConfig = config.get('jwt');

export const JWTExportationModules = [PassportModule, JwtModule];
export const model_importation = [
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: jwtConfig.secret,
    signOptions: {
      expiresIn: jwtConfig.expiresIn,
    },
  }),
];

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = (await this.userRepository.findOne({ username })) as User;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
