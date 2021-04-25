import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['student_code', 'phone'])
export class StudentInfo extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  student_code: string;

  @Column()
  semeter: string;

  @Column()
  academic_year: string;

  @Column()
  faculty: string;

  @Column()
  department: string;

  @Column()
  level: string;

  @Column()
  education_level: string;

  @Column()
  course: string;

  @Column()
  status: string;

  @Column({ type: 'float8' })
  gpax: number;

  @Column()
  phone: string;

  @OneToOne(() => User, (user) => user.studentInfo)
  @JoinColumn()
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
