import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ type: 'float8' })
  time_period: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  createBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
