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
import { DocumentRO26 } from './document-ro26.entity';

export const PREFIX_COURSE = `ro26_course_`;
@Entity()
export class RO26Course extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  course_code: string;

  @Column()
  group_number: number;

  @ManyToOne(() => DocumentRO26, (documentR026) => documentR026.ro26course)
  @JoinColumn()
  documentRO26: DocumentRO26;

  @Column()
  credit: number;

  @Column()
  type: string;

  @Column()
  createBy: string;

  @CreateDateColumn({ type: 'timestamptz' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_date: Date;
}
