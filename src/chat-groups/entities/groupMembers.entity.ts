import {
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Chat_Groups } from './chat-group.entity';

export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity({ name: 'Group_Members' })
export class Group_Members {
  @PrimaryColumn('uuid')
  group_id: string;

  @PrimaryColumn('uuid')
  user_id: string;

  @ManyToOne(() => Chat_Groups, (chatGroup) => chatGroup.groupMembers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: Chat_Groups;

  @ManyToOne(() => User, (user) => user.groupMembers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

  @CreateDateColumn()
  join_date: Date;
}
