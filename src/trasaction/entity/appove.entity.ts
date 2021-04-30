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

  @Column()
  exprieDate: number;

  @ManyToOne(() => TransactionDocument)
  @JoinColumn()
  transaction: TransactionDocument;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
