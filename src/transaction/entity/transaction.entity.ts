import { User } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Approve } from './approve.entity';
import { MappingDocument } from './document-mapping.entity';
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

  @OneToMany(() => Approve, (approve) => approve.transaction, { cascade: true })
  @JoinColumn()
  approve: Approve[];

  @OneToOne(() => MappingDocument, (mapping) => mapping.transaction, {
    cascade: true,
  })
  mapping: MappingDocument;

  @Column()
  credit: number;

  @Column()
  success: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_date: Date;
}
