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

  @Column()
  teacher_id: string;

  @Column()
  status: string;

  @Column()
  comment: string;

  @Column()
  step: number;

  @Column({ type: 'timestamptz', nullable: true })
  exprieDate: Date;

  @ManyToOne(() => TransactionDocument, (trasaction) => trasaction.approve)
  @JoinColumn()
  transaction: TransactionDocument;

  @CreateDateColumn({ type: 'timestamptz' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_date: Date;
}
