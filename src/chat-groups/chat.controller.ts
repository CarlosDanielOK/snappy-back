import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create Chat' })
  @ApiCreatedResponse({
    description: 'Created Chat',
    schema: {
      example: {
        id: '00b262ae-e5c1-4a7b-8093-1dfc87db0053',
        key: '1f0aae07-270c-4ad7-9062-a15a866dccd1-29e11391-6ab0-4ef7-a055-3f3e2024f198',
        participants: [
          {
            id: '29e11391-6ab0-4ef7-a055-3f3e2024f198',
          },
          {
            id: '1f0aae07-270c-4ad7-9062-a15a866dccd1',
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User Not Found ',
    schema: {
      example: {
        message: 'Algunos usuarios no fueron encontrados.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Some parameter is not correct',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async createChat(@Body() createChatDto: CreateChatDto) {
    const { userIds } = createChatDto;

    if (!userIds || userIds.length < 2) {
      throw new Error('Debe haber al menos dos usuarios para crear un chat.');
    }

    const newChat = await this.chatService.createChat(userIds);

    return {
      id: newChat.id,
      key: newChat.key,
      participants: newChat.participants.map((userIds) => ({
        id: userIds.id,
      })),
    };
  }

  @Get('filteredUsers/:userId')
  async getFilteredUsers(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.chatService.getFilteredUsers(userId);
  }

  @Get('user-chats/:userId')
  async getUserChats(@Param('userId') userId: string) {
    const chats = await this.chatService.getChatsByUserId(userId);
    return chats; // Devolvemos los chats
  }

  @Get('chat/:id')
  @ApiOperation({ summary: 'Get all Messages by Chat ID' })
  findAllMessageByChatId(@Param('id') id: string) {
    return this.chatService.findAllMessageByChatId(id);
  }

  @Get(':sender_id/:receiver_id')
  findAllChatsByUserId(
    @Param('sender_id') sender_id: string,
    @Param('receiver_id') receiver_id: string,
  ) {
    return this.chatService.findAllChatsByUserId(sender_id, receiver_id);
  }
}
