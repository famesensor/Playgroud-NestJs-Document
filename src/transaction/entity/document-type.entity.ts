import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionDocument } from './transaction.entity';

@Entity()
export class DocumentType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type_name: string;

  @OneToMany(() => TransactionDocument, (transaction) => transaction.type)
  transaction: TransactionDocument;

  @CreateDateColumn({ type: 'timestamptz' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_date: Date;
}
