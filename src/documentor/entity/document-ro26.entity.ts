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

@Entity()
export class DocumentRO26 extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @OneToMany(() => RO26Course, (ro26course) => ro26course.documentRO26, {
    cascade: true,
    eager: true,
  })
  ro26course: RO26Course[];

  @Column()
  createBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
