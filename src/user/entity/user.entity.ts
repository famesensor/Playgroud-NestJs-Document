import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { StudentInfo } from './student.entity';
import { AdvicerAdvisee } from './advicer.entity';
import { TransactionDocument } from 'src/trasaction/entity/trasaction.entity';
import { Approve } from 'src/trasaction/entity/approve.entity';

@Entity()
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column()
  email: string;

  @Column()
  signature_url: string;

  @Column()
  salt: string;

  @OneToOne(() => StudentInfo, (studentInfo) => studentInfo.user, {
    cascade: true,
  })
  studentInfo: StudentInfo;

  @OneToMany(() => AdvicerAdvisee, (advicerAdvisee) => advicerAdvisee.advicer)
  advicer: AdvicerAdvisee[];

  @OneToOne(() => AdvicerAdvisee, (advicerAdvisee) => advicerAdvisee.advisee)
  advisee: AdvicerAdvisee;

  @OneToMany(() => TransactionDocument, (trasactionDoc) => trasactionDoc.user)
  transaction: TransactionDocument[];

  @OneToMany(() => Approve, (approve) => approve.teacher)
  approve: Approve[];

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
