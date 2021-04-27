import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DocumentRO01 extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  to_name: string;

  @Column()
  createBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
