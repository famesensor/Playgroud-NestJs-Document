import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class StudentInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  info_id: number;

  @Column()
  user_id: number;

  @Column()
  name: string;

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

  @Column()
  gpax: number;

  @Column()
  phone: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
