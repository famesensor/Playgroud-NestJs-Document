import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionDocument } from './trasaction.entity';

@Entity()
export class DocumentType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type_name: string;

  @OneToMany(() => TransactionDocument, (transaction) => transaction.type)
  transaction: TransactionDocument;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
