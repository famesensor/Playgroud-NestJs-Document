import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export const PREFIX_RO16 = `document_ro16_`;
@Entity()
export class DocumentRO16 extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  to_name: string;

  @Column()
  attach_one: string;

  @Column()
  attach_two: string;

  @Column()
  wish: string;

  @Column()
  reason: string;

  @Column({ type: 'float8' })
  time_period: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  createBy: string;

  @CreateDateColumn({ type: 'timestamptz' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  update_date: Date;
}
