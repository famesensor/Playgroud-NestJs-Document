import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Student extends BaseEntity {
  @PrimaryGeneratedColumn()
  student_id: number;

  @Column()
  teacher_id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column()
  student_code: string;

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

  @Column()
  email: string;

  @Column()
  signature: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
