import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "src/users/entities/user.entity";

export enum statusMessage {
    READ = 'read',
    UNREAD = 'unread',
}

@Entity({
    name: 'Message_Receiver'
})
export class Message_Receiver {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Message, (messages) => messages.messageReceivers, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'message_id' })
    message_id: Message;

    @ManyToOne(() => User, (user) => user.userMessageReceivers, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'receiver_id' })
    receiver_id: User;

    @Column({
        type: 'enum',
        enum: statusMessage,
        default: statusMessage.UNREAD
    })
    status: statusMessage;
}