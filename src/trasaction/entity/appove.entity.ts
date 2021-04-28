import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Approve extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  teacher_id: string;

  @Column()
  status: string;

  @Column()
  comment: string;

  @Column()
  step: number;

  @Column()
  exprieDate: number;

  //   @ManyToOne(() => )

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
