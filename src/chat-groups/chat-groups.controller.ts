import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ChatGroupsService } from './chat-groups.service';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { UpdateChatGroupDto } from './dto/update-chat-group.dto';

@ApiTags('Chat-Groups')
@Controller('chat-groups')
export class ChatGroupsController {
  constructor(private readonly chatGroupsService: ChatGroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Chat-Groups' })
  @ApiCreatedResponse({
    description: 'Created Chat-Groups',
    schema: {
      example: {
        name: 'Study Group',
        description: 'A group for discussing course topics',
        privacy: 'PUBLIC',
        creator: {
          id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
          fullname: 'Liam Moore',
          username: 'liammoore',
        },
        group_id: '21f61bc4-98bd-466e-af53-70312a3cb6c2',
        creation_date: '2024-12-23T20:31:17.814Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User Not Found ',
    schema: {
      example: {
        message:
          'El creador con id 1f452184-8889-4caa-989a-494e5b7a1e25 no se ha encontrado.',
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
          'property creator_i should not exist',
          'creator_id should not be empty',
          'creator_id must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  create(@Body() createChatGroupDto: CreateChatGroupDto) {
    return this.chatGroupsService.create(createChatGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Chat-Groups.' })
  @ApiOkResponse({
    description: 'Chat-Groups list',
    schema: {
      example: {
        group_id: '21f61bc4-98bd-466e-af53-70312a3cb6c2',
        name: 'Study Group',
        description: 'A group for discussing course topics',
        creation_date: '2024-12-23T20:31:17.814Z',
        privacy: 'PUBLIC',
        groupMembers: [],
      },
    },
  })
  findAll() {
    return this.chatGroupsService.findAll();
  }

  @Get(':user_id/chats')
  getAllGroupsByUserId(@Param('user_id', ParseUUIDPipe) user_id: string) {
    return this.chatGroupsService.getAllGroupsByUserId(user_id);
  }

  @Get('chats/:group_id')
  getAllMessagesByGroupId(@Param('group_id', ParseUUIDPipe) group_id: string) {
    return this.chatGroupsService.getAllMessagesByGroupId(group_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search for Chat-Groups by ID' })
  @ApiOkResponse({
    description: 'Chat-Groups search by ID successfully',
    schema: {
      example: {
        group_id: '21f61bc4-98bd-466e-af53-70312a3cb6c2',
        name: 'Study Group',
        description: 'A group for discussing course topics',
        creation_date: '2024-12-23T20:31:17.814Z',
        privacy: 'PUBLIC',
        groupMembers: [],
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
        message:
          'Ocurrió un error al ejecutar la solicitud. Revise los datos e intente nuevamente.',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatGroupsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify Chat-Groups' })
  @ApiOkResponse({
    description: 'modified Chat-Groups.',
    schema: {
      example: {
        group_id: '21f61bc4-98bd-466e-af53-70312a3cb6c2',
        name: 'Study Group 1',
        description: 'A group for discussing course topics',
        creation_date: '2024-12-23T20:31:17.814Z',
        privacy: 'PUBLIC',
        groupMembers: [],
        creator_id: '1f452184-8889-4caa-989a-494e5b7a7',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        message: ['property nam should not exist'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChatGroupDto: UpdateChatGroupDto,
  ) {
    return this.chatGroupsService.update(id, updateChatGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Chat-Groups' })
  @ApiOkResponse({
    description: 'Chat-Groups deleted successfully.',
    schema: { example: 'Chat de grupo con id ${id} borrado de forma exitosa.' },
  })
  @ApiBadRequestResponse({
    description: 'Some input value is not found. Error: Bad Request',
    schema: {
      example: {
        message: 'Chat de grupo no encontrado.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatGroupsService.remove(id);
  }
}
