import { Module } from '@nestjs/common';
import typeorm from './config/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ReactionsModule } from './reactions/reactions.module';
import { CommentsModule } from './comments/comments.module';
import { ReportsModule } from './reports/reports.module';
import { MessagesModule } from './messages/messages.module';
import { InterestsModule } from './interests/interests.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { StoriesModule } from './stories/stories.module';
import { PurchasesModule } from './purchases/purchases.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatGroupsModule } from './chat-groups/chat-groups.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { FilesModule } from './files/files.module';
import { GroupMembersModule } from './chat-groups/group-members/group-members.module';
import { ChatModule } from './chat-groups/chat.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';
import { ChatGatewayModule } from './chat.gateway.module';
import { FollowModule } from './follow/follow.module';
import { LogsModule } from './logsAdmin/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [typeorm] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configTypeORM: ConfigService) =>
        configTypeORM.get('typeorm'),
    }),
    AuthModule,
    UsersModule,
    InterestsModule,
    PostsModule,
    CommentsModule,
    ReactionsModule,
    StoriesModule,
    ChatModule,
    MessagesModule,
    GroupMembersModule,
    ChatGroupsModule,
    NotificationsModule,
    FollowModule,
    ReportsModule,
    PurchasesModule,
    FilesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, /* 
      signOptions: { expiresIn: '12h' }, */
    }),
    NodemailerModule,
    ChatGatewayModule,
    LogsModule,
  ],
  controllers: [],
  providers: [AuthGuard],
})
export class AppModule {}
