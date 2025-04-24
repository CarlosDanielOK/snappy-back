import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  report_id: string;

  @ManyToOne(() => User, (user) => user.reportedReports)
  reported_user: User;

  @ManyToOne(() => User, (user) => user.reportingReports)
  reporting_user: User;

  @Column({ length: 120 })
  description: string;

  @CreateDateColumn()
  report_date: Date;
}
