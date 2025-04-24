import { Module } from '@nestjs/common';
import { ChatGroupsService } from './chat-groups.service';
import { ChatGroupsController } from './chat-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat_Groups } from './entities/chat-group.entity';
import { User } from 'src/users/entities/user.entity';
import { GroupMembersModule } from '../chat-groups/group-members/group-members.module';
import { Group_Members } from './entities/groupMembers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat_Groups, User, Group_Members]),
    GroupMembersModule,
  ],
  controllers: [ChatGroupsController],
  providers: [ChatGroupsService],
})
export class ChatGroupsModule {}
