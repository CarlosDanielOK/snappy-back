import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { DeepPartial, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  Message_Receiver,
  statusMessage,
} from './entities/message_Receiver.entity';
import { Group_Members } from 'src/chat-groups/entities/groupMembers.entity';
import { Chat } from 'src/chat-groups/entities/chat.entity';
import { Chat_Groups } from 'src/chat-groups/entities/chat-group.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Message_Receiver)
    private readonly messageReceiverRepository: Repository<Message_Receiver>,
    @InjectRepository(Group_Members)
    private readonly groupMembersRepository: Repository<Group_Members>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Chat_Groups)
    private readonly groupChatRepository: Repository<Chat_Groups>,
  ) {}

  async createGroupMessage(createGroupMessageDto: CreateMessageDto) {
    const { sender_id, groupId, ...messageData } = createGroupMessageDto;

    if (!groupId) {
      throw new BadRequestException('Debe especificar un groupId');
    }

    const userFound = await this.userRepository.findOne({
      where: { id: sender_id },
    });
    if (!userFound) {
      throw new NotFoundException(`El usuario con ID ${sender_id} no existe`);
    }

    if (groupId) {
      const userFoundInsideGroup = await this.groupMembersRepository.findOne({
        where: { user_id: sender_id, group_id: groupId },
      });

      if (!userFoundInsideGroup) {
        throw new NotFoundException(
          `El usuario con ID ${sender_id} no pertenece al grupo con ID ${groupId}`,
        );
      }
    }

    let newMsg;

    if (groupId) {
      const groupFound = await this.groupChatRepository.findOne({
        where: { group_id: groupId },
      });

      newMsg = this.messageRepository.create({
        content: messageData.content,
        type: messageData.type,
        sender_id: userFound,
        is_anonymous: !!messageData.is_anonymous,
        group_chat: groupFound || null,
        username: messageData.username,
      } as DeepPartial<Message>);
    }

    const savedMsg = await this.messageRepository.save(newMsg);

    if (groupId) {
      const groupMembers = await this.groupMembersRepository.find({
        where: { group_id: groupId },
        relations: ['user'],
      });

      if (!groupMembers || groupMembers.length === 0) {
        throw new NotFoundException(
          `No se encontraron miembros para el grupo ${groupId}`,
        );
      }

      const msgReceiversEntities = groupMembers.map((member) => {
        return this.messageReceiverRepository.create({
          message_id: savedMsg as DeepPartial<Message>,
          receiver_id: member.user,
          status: statusMessage.UNREAD,
        });
      });

      await this.messageReceiverRepository.save(msgReceiversEntities);
    }

    const responseObject = {
      message_id: savedMsg.message_id,
      content: savedMsg.content,
      send_date: savedMsg.send_date,
      sender_id: {
        id: savedMsg.sender_id.id,
        username: savedMsg.sender_id.username,
        fullname: savedMsg.sender_id.fullname,
        profile_image: savedMsg.sender_id.profile_image,
        user_type: savedMsg.type,
      },
    };
    return responseObject;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const { sender_id, messageReceivers, chatId, ...messageData } =
      createMessageDto;

    if (!chatId) {
      throw new BadRequestException('Debe especificar un chatId');
    }

    const userFound = await this.userRepository.findOne({
      where: { id: sender_id },
    });
    if (!userFound) {
      throw new NotFoundException(`El usuario con ID ${sender_id} no existe`);
    }

    let newMsg;

    if (chatId) {
      const chatFound = await this.chatRepository.findOne({
        where: { id: chatId },
      });

      newMsg = this.messageRepository.create({
        content: messageData.content,
        type: messageData.type,
        sender_id: userFound,
        is_anonymous: !!messageData.is_anonymous,
        chat: chatFound || null,
      } as DeepPartial<Message>);
    }

    const savedMsg = await this.messageRepository.save(newMsg);

    if (chatId) {
      if (chatId && !messageReceivers) {
        throw new BadRequestException(
          `Debe haber al menos un receptor para un mensaje.`,
        );
      }
      const msgReceiversEntities = await Promise.all(
        messageReceivers.map(async (receiverId) => {
          const receiverUser = await this.userRepository.findOne({
            where: { id: receiverId },
          });

          if (!receiverUser) {
            throw new NotFoundException(
              `El receptor con ID ${receiverId} no existe`,
            );
          }

          return this.messageReceiverRepository.create({
            message_id: savedMsg as DeepPartial<Message>,
            receiver_id: receiverUser,
            status: statusMessage.UNREAD,
          });
        }),
      );

      await this.messageReceiverRepository.save(msgReceiversEntities);
    }

    const responseObject = {
      username: savedMsg.sender_id.username,
      sender_id: savedMsg.sender_id.id,
      user_type: savedMsg.sender_id.user_type,
      profile_image: savedMsg.sender_id.profile_image,
      message_id: savedMsg.message_id,
      content: savedMsg.content,
      send_date: savedMsg.send_date,
      type: savedMsg.type,
      is_anonymous: savedMsg.is_anonymous,
    };

    return responseObject;
  }

  async findAllMessage() {
    const messages = await this.messageRepository.find({
      relations: [
        'sender_id',
        'messageReceivers',
        'messageReceivers.receiver_id',
      ],
    });

    const resultMessage = messages.map((message) => ({
      message: {
        message_id: message.message_id,
        send_date: message.send_date,
        type: message.type,
        content: message.content,
        is_anonymous: message.is_anonymous,
        sender_id: message.sender_id.id,

        receiver: message.messageReceivers.map((receiver) => ({
          receiverId: receiver.receiver_id.id,
          status: receiver.status,
        })),
      },
    }));

    return resultMessage;
  }

  async findOneMessage(idMessage: string) {
    try {
      const getAllMessage = await this.messageRepository.findOne({
        where: { message_id: idMessage },
        relations: [
          'sender_id',
          'messageReceivers',
          'messageReceivers.receiver_id',
        ],
      });

      if (!getAllMessage) {
        throw new NotFoundException(
          `No se encuentra el mensaje con Id ${idMessage}`,
        );
      }

      const resultMessage = {
        message_id: getAllMessage.message_id,
        send_date: getAllMessage.send_date,
        type: getAllMessage.type,
        content: getAllMessage.content,
        is_anonymous: getAllMessage.is_anonymous,
        sender_id: getAllMessage.sender_id.id,

        receiver: getAllMessage.messageReceivers.map((receiver) => ({
          receiverId: receiver.receiver_id.id,
          status: receiver.status,
        })),
      };

      return resultMessage;
    } catch {
      throw new BadRequestException('No se logro traer todos los mensajes.');
    }
  }

  async updateMessage(
    idUpdateMessage: string,
    updateMessageDto: UpdateMessageDto,
  ) {
    try {
      const updateMessage = await this.messageRepository.findOne({
        where: { message_id: idUpdateMessage },
        relations: [
          'sender_id',
          'messageReceivers',
          'messageReceivers.receiver_id',
        ],
      });

      if (!updateMessage) {
        throw new NotFoundException(
          `Mensaje con ID ${idUpdateMessage} no encontrado`,
        );
      }

      Object.assign(updateMessage, {
        ...updateMessageDto,
        send_date: new Date(),
      });

      await this.messageRepository.save(updateMessage);

      const savedMessage = {
        message_id: updateMessage.message_id,
        send_date: updateMessage.send_date,
        type: updateMessage.type,
        content: updateMessage.content,
        is_anonymous: updateMessage.is_anonymous,
        sender_id: updateMessage.sender_id.id,

        receiver: updateMessage.messageReceivers.map((receiver) => ({
          receiverId: receiver.receiver_id.id,
          status: receiver.status,
        })),
      };

      return savedMessage;
    } catch {
      throw new NotFoundException('No pudo actualizar el mensaje');
    }
  }

  async deleteMessage(messageId: string): Promise<{ message: string }> {
    try {
      const deleteMessage = await this.messageRepository.findOne({
        where: { message_id: messageId },
        relations: [
          'sender_id',
          'messageReceivers',
          'messageReceivers.receiver_id',
        ],
      });
      if (!deleteMessage) {
        throw new BadRequestException(
          `Mensaje con ID ${messageId} no encontrado`,
        );
      }

      await this.messageReceiverRepository.delete({
        message_id: deleteMessage,
      });
      await this.messageRepository.delete(messageId);

      return { message: 'Mensaje eliminado exitosamente' };
    } catch {
      throw new BadRequestException('No se pudo eliminar mensaje');
    }
  }

  /*   async getChatMessages(chatID: string) {
    const chatmessages = await this.chatRepository.find({
      where: { id: chatID },
      relations: ['messages'],
    });

    if (!chatmessages) {
      throw new NotFoundException(`El chat con el id ${chatID} no existe.`);
    }

    return chatmessages;
  } */
}
