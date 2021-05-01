import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RO26Course } from './ro26-course.entity';

export const PREFIX_RO26 = `document_ro26_`;
@Entity()
export class DocumentRO26 extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToMany(() => RO26Course, (ro26course) => ro26course.documentRO26, {
    cascade: true,
  })
  ro26course: RO26Course[];

  @Column()
  createBy: string;

  @CreateDateColumn({ type: 'timestamptz' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_date: Date;
}
