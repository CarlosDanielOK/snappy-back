import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { GroupMembersModule } from './chat-groups/group-members/group-members.module';

import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    GroupMembersModule,
    MessagesModule,
    UsersModule,
    NotificationsModule,
  ],
  providers: [ChatGateway],
})
export class ChatGatewayModule {}
