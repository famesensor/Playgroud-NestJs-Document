import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentRO16 } from './document-ro16.entity';
import { DocumentRO26 } from './document-ro26.entity';
import { DocumentRO01 } from './document-ro01.entity';
import { TransactionDocument } from './transaction.entity';

export const PREFIX_MAPPING = `mapping_document_`;
@Entity()
export class MappingDocument extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => DocumentRO01, { cascade: true })
  @JoinColumn()
  documentRO01: DocumentRO01;

  @OneToOne(() => DocumentRO16, { cascade: true })
  @JoinColumn()
  documentRO16: DocumentRO16;

  @OneToOne(() => DocumentRO26, { cascade: true })
  @JoinColumn()
  docuemntRO26: DocumentRO26;

  @OneToOne(() => TransactionDocument, (trasaction) => trasaction.mapping)
  @JoinColumn()
  transaction: TransactionDocument;

  @CreateDateColumn({ type: 'timestamptz' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_date: Date;
}
