import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }


  @Post()
  @ApiOperation({ summary: 'Create Messages' })
  @ApiCreatedResponse({
    description: 'Created Messages',
    schema: {
      example: {
        content: 'Hi, how are you?',
        type: 'text',
        is_anonymous: true,
        sender_id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User Not Found ',
    schema: {
      example: {
        message:
          'El usuario con ID 1f452184-8889-4caa-989a-494e5b7a1e20 no existe',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
    schema: {
      example: {
        message: [
          'type must be one of the following values: text, image, video, anonymous',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(createMessageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Messages.' })
  @ApiOkResponse({
    description: 'Messages list',
    schema: {
      example: {
        message: {
          message_id: '0883cdc3-a945-474e-bdb9-f07969a42c31',
          send_date: '2024-12-23T16:19:12.026Z',
          type: 'text',
          content: 'Hi, how are you?',
          is_anonymous: true,
          sender_id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
          receiver: [],
        },
      },
    },
  })
  findAllMessage() {
    return this.messagesService.findAllMessage();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Search for Message by ID' })
  @ApiOkResponse({
    description: 'Message search by ID successfully',
    schema: {
      example: {
        message_id: '0883cdc3-a945-474e-bdb9-f07969a42c31',
        send_date: '2024-12-23T16:19:12.026Z',
        type: 'text',
        content: 'Hi, how are you?',
        is_anonymous: true,
        sender_id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
        receiver: [],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        message: 'No se logro traer todos los mensajes.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Message Not Found',
    schema: {
      example: {
        message: 'No se encuentra el mensaje con Id ${idMessage}',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findOneMessage(@Param('id') id: string) {
    return this.messagesService.findOneMessage(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify Message' })
  @ApiOkResponse({
    description: 'modified Message.',
    schema: {
      example: {
        message_id: '0883cdc3-a945-474e-bdb9-f07969a42c31',
        send_date: '2024-12-23T16:39:36.982Z',
        type: 'text',
        content: 'cambio de texto',
        is_anonymous: true,
        sender_id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
        receiver: [],
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        message: 'No pudo actualizar el mensaje',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  updateMessage(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.updateMessage(id, updateMessageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Message' })
  @ApiOkResponse({
    description: 'Message deleted successfully.',
    schema: { example: 'Mensaje eliminado exitosamente' },
  })
  @ApiBadRequestResponse({
    description: 'Some input value is not found. (uuid is expected)',
    schema: {
      example: {
        message: 'No se pudo eliminar mensaje',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  deleteMessage(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.messagesService.deleteMessage(id);
  }

  /*   @Get('chat/:id')
  getChatMessages(@Param('id', ParseUUIDPipe) id: string) {
    return this.messagesService.getChatMessages(id);
  } */
}
