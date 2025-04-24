import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from 'src/messages/entities/message.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message, Follow]), FollowModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
