import { EntityRepository, Repository } from 'typeorm';
import { SignCredentialsDto } from './dto/sign-credentials.dto';
import { StudentInfo } from './model/student.entity';
import { User } from './model/user.entity';

@EntityRepository(User)
@EntityRepository(StudentInfo)
export class UserRepository extends Repository<User | StudentInfo> {
  async validateUserPassword(
    signCredentialsDto: SignCredentialsDto,
  ): Promise<User> {
    const { username, password } = signCredentialsDto;
    const user = (await this.findOne({ username })) as User;

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }
}
