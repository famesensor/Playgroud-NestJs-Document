import { User } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionDocument } from './trasaction.entity';

export const PREFIX_APPROVE = `approve_`;
@Entity()
export class Approve extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.approve)
  @JoinColumn()
  teacher: User;

  @Column()
  status: string;

  @Column()
  comment: string;

  @Column()
  step: number;

  @Column({ type: 'timestamptz', nullable: true })
  expire_date: Date;

  @ManyToOne(() => TransactionDocument, (trasaction) => trasaction.approve)
  @JoinColumn()
  transaction: TransactionDocument;

  @CreateDateColumn({ type: 'timestamptz' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_date: Date;
}
