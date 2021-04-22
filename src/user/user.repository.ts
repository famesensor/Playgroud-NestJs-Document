import { EntityRepository, Repository } from 'typeorm';
import { StudentInfo } from './model/student.entity';
import { User } from './model/user.entity';

@EntityRepository(User)
@EntityRepository(StudentInfo)
export class UserRepository extends Repository<User | StudentInfo> {
  // async signIn()
}
