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
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateGroupMemberDto } from '../dto/create-group-member.dto';
import { UpdateGroupMemberDto } from '../dto/update-group-member.dto';
import { GroupMembersService } from '../group-members/group-members.service';

@ApiTags('Group-Menbers')
@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Create group-members' })
  @ApiCreatedResponse({
    description: 'Created group-members',
    schema: {
      example: {
        message: 'Ingreso éxitoso al grupo público: Study Group',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'User Not Found.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Group not Found.',
    schema: {
      example: {
        message:
          'El grupo de chat con el id 148d0f81-4e76-4770-a549-514cc7c0ef94 no fue encontrado.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error when register some data',
    schema: {
      example: {
        message: ['role must be one of the following values: ADMIN, MEMBER'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    return this.groupMembersService.create(createGroupMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all group-members.' })
  @ApiOkResponse({
    description: 'Groups-members list',
    schema: {
      example: {
        group_id: '148d0f81-4e76-4770-a549-514cc7c0ef9d',
        user_id: '1f452184-8889-4caa-989a-494e5b7a1e2c',
        role: 'MEMBER',
        join_date: '2024-12-28T00:09:54.931Z',
        group: {
          name: 'Study Group',
          description: 'A group for discussing course topics',
          creation_date: '2024-12-28T00:09:18.366Z',
          privacy: 'PUBLIC',
        },
      },
    },
  })
  findAll() {
    return this.groupMembersService.findAll();
  }

  @Get(':group_id')
  findAllMemberByGroupId(@Param('group_id', ParseUUIDPipe) group_id: string) {
    return this.groupMembersService.findAllMemberByGroupId(group_id);
  }

  @Get(':group_id/user_id')
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
        message: 'Error en la solicitud. Por favor inténtelo nuevamente.',
        error: 'Internal Server Error',
        statusCode: 500,
      },
    },
  })
  findOne(
    @Param('group_id', ParseUUIDPipe) group_id: string,
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ) {
    return this.groupMembersService.findOne(group_id, user_id);
  }

  @Put(':id/role/:group_id')
  @ApiOperation({ summary: 'Modify Group-members' })
  @ApiOkResponse({
    description: 'modified Group-members.',
    schema: {
      example: {
        message:
          'El rol del miembro con id 1f452184-8889-4caa-989a-494e5b7a1e2c en el grupo 148d0f81-4e76-4770-a549-514cc7c0ef9d ha sido actualizado a ADMIN',
      },
    },
  })
  @ApiUnprocessableEntityResponse({
    description: 'Error: Unprocessable Entity',
    schema: {
      example: {
        message:
          'El rol que se le quiere asignar al usuario con id 1f452184-8889-4caa-989a-494e5b7a1e2c es el mismo rol que ya tiene asignado.',
        error: 'Unprocessable Entity',
        statusCode: 422,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        message: 'Unexpected token \n in JSON at position 19',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User Not Found ',
    schema: {
      example: {
        message:
          'El usuario con el id 1f452184-8889-4caa-989a-494e5b7a1e2c no se encuentra en el grupo con id 148d0f81-4e76-4770-a549-514cc7c0ef9C.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('group_id', ParseUUIDPipe) group_id: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
  ) {
    return this.groupMembersService.update(id, updateGroupMemberDto, group_id);
  }

  @Put('/requests/:requestId')
  @ApiNotFoundResponse({
    description: 'Error: Not Found.',
    schema: {
      example: {
        message:
          'Solicitud con ID 148d0f81-4e76-4770-a549-514cc7c0ef9d no encontrada.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async handleJoinRequest(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Body() body: { status: 'ACCEPTED' | 'REJECTED' },
  ) {
    const updatedRequest = await this.groupMembersService.handleJoinRequest(
      requestId,
      body.status,
    );
    return updatedRequest;
  }

  @Put(':id/remove-from-admin/:group_id')
  removeFromAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('group_id', ParseUUIDPipe) group_id: string,
  ) {
    return this.groupMembersService.removeFromAdmin(id, group_id);
  }

  @Delete(':group_id/leave-group/:user_id')
  leaveGroup(
    @Param('group_id', ParseUUIDPipe) group_id: string,
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ) {
    return this.groupMembersService.leaveGroup(group_id, user_id);
  }
}
