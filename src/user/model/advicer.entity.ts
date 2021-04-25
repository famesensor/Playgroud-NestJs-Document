import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AdvicerAdvisee extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  advicer_id: string;

  @Column()
  advisee_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_date: Date;
}
