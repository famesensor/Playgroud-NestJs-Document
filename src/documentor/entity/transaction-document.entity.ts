import { User } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentType } from './document-type.entity';

@Entity()
export class TransactionDocument extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => DocumentType)
  type: DocumentType;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  success: boolean;

  @Column()
  credit: number;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
