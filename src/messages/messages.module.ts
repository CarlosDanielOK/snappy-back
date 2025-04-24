import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

import { Message } from './entities/message.entity';
import { Message_Receiver } from './entities/message_Receiver.entity';
import { Group_Members } from 'src/chat-groups/entities/groupMembers.entity';
import { Chat } from 'src/chat-groups/entities/chat.entity';
import { Chat_Groups } from 'src/chat-groups/entities/chat-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Message,
      User,
      Message_Receiver,
      Group_Members,
      Chat,
      Chat_Groups,
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
