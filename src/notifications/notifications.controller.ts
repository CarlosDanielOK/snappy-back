import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  Post
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Notification' })
  @ApiCreatedResponse({
    description: 'Created Notification.',
    schema: {
      example: {
        notification_id: 'f4b94b88-3f6d-4e5d-94c4-e6a32cce8623',
        content: 'you have received a message',
        type: 'message',
        status: 'unread',
        user: {
          id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
        },
        creation_date: '2024-12-23T18:31:46.582Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User Not Found.',
    schema: {
      example: {
        message:
          'El usuario con el id 1f452184-8889-4caa-989a-494e5b7a1e3c no fue encontrado.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request.',
    schema: {
      example: {
        message: [
          'type must be one of the following values: friend_request, message, post_reaction, comment, group_invitation, system, purchase',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Notifications' })
  @ApiOkResponse({
    description: 'Notifications list.',
    schema: {
      example: {
        notification_id: 'f4b94b88-3f6d-4e5d-94c4-e6a32cce8623',
        content: 'you have received a message',
        type: 'message',
        status: 'unread',
        creation_date: '2024-12-23T18:31:46.582Z',
        user: {
          id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
        },
      },
    },
  })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search for Notification by ID' })
  @ApiOkResponse({
    description: 'Notification search by ID successfully',
    schema: {
      example: {
        notification_id: 'f4b94b88-3f6d-4e5d-94c4-e6a32cce8623',
        content: 'you have received a message',
        type: 'message',
        status: 'unread',
        creation_date: '2024-12-23T18:31:46.582Z',
        user: {
          id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error: Internal Server Error',
    schema: {
      example: {
        message: 'Error inesperado al procesar la notificación.',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Get('/user/:id')
  findByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.findByUser(id);
  }

  @Post('/readAll/:id')
  markAllAsRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.markAllAsRead(id);
  }

  @Put(':id/mark-as-read')
  @ApiOperation({ summary: 'Modify Notification mark-as-read' })
  @ApiOkResponse({
    description: 'modified Notification.',
    schema: {
      example: {
        notification_id: 'f4b94b88-3f6d-4e5d-94c4-e6a32cce8623',
        content: 'you have received a message',
        type: 'message',
        status: 'read',
        creation_date: '2024-12-23T18:31:46.582Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Notification Not Found',
    schema: {
      example: {
        message: 'Notificación no encontrada',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify Notification for ID' })
  @ApiOkResponse({
    description: 'modified Notification.',
    schema: {
      example: {
        notification_id: 'f4b94b88-3f6d-4e5d-94c4-e6a32cce8623',
        content: 'you have received a message',
        type: 'message',
        status: 'unread',
        creation_date: '2024-12-23T18:31:46.582Z',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        message:
          'Ocurrió un error al actualizar la notificación. Por favor, verifique los datos.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Notification Not Found',
    schema: {
      example: {
        message: 'Notificación con id ${id} no encontrada.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Notification' })
  @ApiOkResponse({
    description: 'Notification deleted successfully.',
    schema: { example: 'Notificación con id ${id} borrada correctamente.' },
  })
  @ApiBadRequestResponse({
    description: 'Some input value is not found. (uuid is expected)',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error: Internal Server Error',
    schema: {
      example: {
        message: 'Error inesperado al procesar la solicitud.',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationsService.remove(id);
  }
}
