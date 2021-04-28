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

@Entity()
export class MappingDocument extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => DocumentRO01, { cascade: true })
  @JoinColumn()
  documentRO01: DocumentRO01;

  @OneToOne(() => DocumentRO16, { cascade: true })
  documentRO16: DocumentRO16;

  @OneToOne(() => DocumentRO26, { cascade: true })
  docuemntRO26: DocumentRO26;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
