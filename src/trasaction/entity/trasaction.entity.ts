import { User } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Approve } from './appove.entity';
import { DocumentType } from './document-type.entity';

export const PREFIX_TRASACTION = `trasaction_document_`;
@Entity()
export class TransactionDocument extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.transaction)
  @JoinColumn()
  user: User;

  @ManyToOne(() => DocumentType, (docType) => docType.transaction)
  @JoinColumn()
  type: DocumentType;

  @OneToMany(() => Approve, (approve) => approve.transaction)
  approve: Approve[];

  @Column()
  credit: number;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
