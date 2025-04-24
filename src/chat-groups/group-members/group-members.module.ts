import { Module } from '@nestjs/common';
import { GroupMembersService } from '../group-members/group-members.service';
import { GroupMembersController } from './group-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group_Members } from '../entities/groupMembers.entity';
import { Chat_Groups } from '../entities/chat-group.entity';
import { GroupJoinRequest } from '../entities/group-join-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group_Members, Chat_Groups, GroupJoinRequest]),
  ],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
  exports: [GroupMembersService],
})
export class GroupMembersModule {}
