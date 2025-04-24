import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BadRequestException, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages/messages.service';
import { GroupMembersService } from './chat-groups/group-members/group-members.service';
import { CreateMessageDto } from './messages/dto/create-message.dto';
import { UsersOnlineService, UsersService } from './users/users.service';
import {
  NotificationType,
  // NotificationStatus,
} from './notifications/entities/notification.entity';
import { NotificationsService } from './notifications/notifications.service';

dotenv.config({ path: './.env' });

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: `${process.env.DOMAIN_FRONT}`,
    credentials: true,
  },
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private jwtService: JwtService,
    private groupMemberService: GroupMembersService,
    private messageService: MessagesService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private usersOnlineService: UsersOnlineService,
  ) {}

  afterInit() {
    this.logger.log('🚀 Socket Server Initialized');
  }

  async handleConnection(client: Socket) {
    console.log('🟢 Cliente conectado:', client.id);

    const token = client.handshake.query.token;

    if (!token) {
      this.logger.warn('Cookie "auth_token" no proporcionada');
      client.emit('error', 'Cookie "auth_token" no proporcionada');
      client.disconnect();
      return;
    }

    try {
      const decoded = this.jwtService.verify(token as string);

      client.join(decoded.id);
      this.usersOnlineService.addUser(client.id, decoded);

      const userGroups = await this.groupMemberService.findGroupsByUserId(
        decoded.id,
      );
      if (userGroups && userGroups.length > 0) {
        userGroups.forEach((group) => {
          client.join(group.id);
        });
      }

      const user = await this.usersService.getUserById(decoded.sub);
      if (!user) {
        client.emit('error', 'Usuario no encontrado');
        client.disconnect();
        return;
      }

      const onlineUsers = this.usersOnlineService.getAllUsers();

      this.server.emit('onlineUsers', onlineUsers);
      this.logger.log(`User connected: ${client.id}`);
    } catch (error) {
      this.logger.error('Token inválido o expirado', error.message);
      client.emit('error', 'Token inválido o expirado');
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    /* const token = client.handshake.query.token;
    const decoded = this.jwtService.verify(token as string); */

    console.log('🔴 Cliente desconectado:', client.id);
    this.usersOnlineService.removeUser(client.id);
    const onlineUsers = this.usersOnlineService.getAllUsers();
    this.server.emit('onlineUsers', onlineUsers);
    /* this.usersService.updateUser(decoded.id, {
      last_login_date: new Date(),
    }); */
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatId);
  }

  @SubscribeMessage('join_group_chat')
  handleJoinGroupChat(
    @MessageBody() groupId: any,
    @ConnectedSocket() client: Socket,
  ) {
    if (!groupId.group_id || typeof groupId.group_id !== 'string') {
      return;
    }

    client.join(groupId.group_id);
  }

  @SubscribeMessage('message')
  async handleNewMessage(
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!payload.chatId) {
        throw new BadRequestException('Debe especificar un chatId o groupId');
      }

      const message = await this.messageService.createMessage(payload);

      if (payload.chatId) {
        console.log(
          `Emitiendo mensaje privado a los receptores: ${payload.messageReceivers}`,
        );

        payload.messageReceivers.forEach((receiverId) => {
          this.server.to(receiverId).emit('receivePrivateMessage', message);

          this.notificationsService
            .create({
              content: 'te ha enviado un mensaje privado',
              type: NotificationType.MESSAGE,
              user_id: receiverId,
              sender_user: payload.sender_id,
            })
            .then((notification) => {
              this.server.to(receiverId).emit('messageNotification', {
                notification,
                message,
              });
            });
        });
      }
    } catch (error) {
      console.error('Error al manejar el mensaje:', error.message);
      client.emit('error', error.message);
    }
  }
  @SubscribeMessage('groupMessage')
  async handleNewGroupMessage(
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      if (!payload.chatId && !payload.groupId) {
        throw new BadRequestException('Debe especificar un chatId o groupId');
      }

      const message = await this.messageService.createGroupMessage(payload);

      if (payload.groupId) {
        this.server.to(payload.groupId).emit('receiveGroupMessage', message);
      }
    } catch (error) {
      console.error('Error al manejar el mensaje:', error.message);
      client.emit('error', error.message);
    }
  }

  // @SubscribeMessage('notification')
  // async handleNotification(
  //   @MessageBody()
  //   payload: {
  //     type: NotificationType;
  //     content: string;
  //     userId: string;
  //     friendRequestId?: string;
  //     messageId?: string;
  //     postId?: string;
  //     commentId?: string;
  //     groupId?: string;
  //     purchaseId?: string;
  //   },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   console.log('📨 Notificación recibida:', payload);

  //   try {
  //     const notification = {
  //       content: payload.content,
  //       type: payload.type,
  //       user_id: payload.userId,
  //       status: NotificationStatus.UNREAD,
  //     };

  //     const savedNotification =
  //       await this.notificationsService.create(notification);

  //     switch (payload.type) {
  //       case NotificationType.FRIEND_REQUEST:
  //         this.server.to(payload.userId).emit('friendRequestNotification', {
  //           ...savedNotification,
  //           friendRequestId: payload.friendRequestId,
  //         });
  //         break;

  //       case NotificationType.MESSAGE:
  //         this.server.to(payload.userId).emit('messageNotification', {
  //           ...savedNotification,
  //           messageId: payload.messageId,
  //         });
  //         break;

  //       case NotificationType.POST_REACTION:
  //         this.server.to(payload.userId).emit('postReactionNotification', {
  //           ...savedNotification,
  //           postId: payload.postId,
  //         });
  //         break;

  //       case NotificationType.COMMENT:
  //         this.server.to(payload.userId).emit('commentNotification', {
  //           ...savedNotification,
  //           commentId: payload.commentId,
  //         });
  //         break;

  //       case NotificationType.GROUP_INVITATION:
  //         this.server.to(payload.userId).emit('groupInvitationNotification', {
  //           ...savedNotification,
  //           groupId: payload.groupId,
  //         });
  //         break;

  //       case NotificationType.PURCHASE:
  //         this.server.to(payload.userId).emit('purchaseNotification', {
  //           ...savedNotification,
  //           purchaseId: payload.purchaseId,
  //         });
  //         break;

  //       case NotificationType.SYSTEM:
  //         this.server
  //           .to(payload.userId)
  //           .emit('systemNotification', savedNotification);
  //         break;
  //     }
  //   } catch (error) {
  //     console.error('Error al manejar la notificación:', error.message);
  //     client.emit('error', error.message);
  //   }
  // }

  @SubscribeMessage('getConnectedUsers')
  handleGetConnectedUsers(@ConnectedSocket() client: Socket) {
    const onlineUsers = this.usersOnlineService.getAllUsers();

    client.emit('onlineUsers', onlineUsers);

    this.server.emit('onlineUsers', onlineUsers);

    return onlineUsers;
  }

  private getCookieValue(cookies: string | undefined, cookieName: string) {
    if (!cookies) {
      return null;
    }
    const match = cookies.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
    if (!match) {
      console.log(`Cookie ${cookieName} no encontrada`);
    }
    return match ? match[2] : null;
  }
}
