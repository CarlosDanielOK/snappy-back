import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @ManyToMany(() => User, (user) => user.chats)
  participants: User[];

  @OneToMany(() => Message, (message) => message.chat)
  @JoinColumn({ name: 'messages_id' })
  messages: Message[];
}
