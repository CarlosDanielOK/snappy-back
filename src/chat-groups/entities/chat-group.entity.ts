import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Group_Members } from './groupMembers.entity';
import { Message } from 'src/messages/entities/message.entity';

@Entity({ name: 'Chat_Groups' })
export class Chat_Groups {
  @PrimaryGeneratedColumn('uuid')
  group_id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  description: string;

  @CreateDateColumn()
  creation_date: Date;

  @Column({
    type: 'enum',
    enum: ['PUBLIC', 'PRIVATE'],
    default: 'PUBLIC',
  })
  privacy: 'PUBLIC' | 'PRIVATE';

  @ManyToOne(() => User, (user) => user.createdGroups, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => Group_Members, (groupMember) => groupMember.group, {
    cascade: true,
  })
  groupMembers: Group_Members[];

  @OneToMany(() => Message, (message) => message.group_chat, {
    cascade: true,
  })
  messages: Message[];
}
