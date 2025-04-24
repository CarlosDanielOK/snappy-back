import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MessageType } from '../dto/create-message.dto';
import { User } from 'src/users/entities/user.entity';
import { Message_Receiver } from './message_Receiver.entity';
import { Chat } from 'src/chat-groups/entities/chat.entity';
import { Chat_Groups } from 'src/chat-groups/entities/chat-group.entity';

@Entity({
  name: 'Messages',
})
export class Message {
  @PrimaryGeneratedColumn('uuid')
  message_id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  content: string;

  @CreateDateColumn()
  send_date: Date;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
    nullable: false,
  })
  type: MessageType;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_Id' })
  sender_id: User;

  @Column({ type: 'boolean' })
  is_anonymous: boolean;

  @OneToMany(
    () => Message_Receiver,
    (messageReceiver) => messageReceiver.message_id,
  )
  messageReceivers: Message_Receiver[];

  @ManyToOne(() => Chat, (chat) => chat.messages, {
    cascade: true,
  })
  chat: Chat;

  @ManyToOne(() => Chat_Groups, (chatGroup) => chatGroup.messages, {
    onDelete: 'CASCADE',
  })
  group_chat: Chat_Groups;
}
