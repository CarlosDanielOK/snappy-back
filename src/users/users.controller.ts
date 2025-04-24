import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUsersDTO, UpdateLocationDTO, UpdateUserDTO } from './dto/user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Users.' })
  @ApiOkResponse({
    description: 'Users List.',
    schema: {
      example: [
        {
          id: '10ab217c-f4b8-464b-bb1c-10e865e7d1ca',
          fullname: 'Emily Davis',
          username: 'emilydavis',
          email: 'emily@example.com',
          birthdate: '1993-07-30',
          genre: 'female',
          registration_date: '2024-12-17T06:26:12.820Z',
          last_login_date: '2024-12-17T21:17:22.831Z',
          user_type: 'regular',
          status: 'active',
          profile_image: 'https://example.com/profile6.jpg',
          location: 'Austin',
          stories: [],
          interests: [],
          reportedReports: [],
          reportingReports: [],
          posts: [],
          reactions: [],
          comments: [],
          groupMembers: [],
          userChatGroup: [],
        },
      ],
    },
  })
  async getUsers(@Query() filters: GetUsersDTO) {
    return this.usersService.getUsers(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search for Users by ID' })
  @ApiOkResponse({
    description: 'User found by ID.',
    schema: {
      example: [
        {
          id: '10ab217c-f4b8-464b-bb1c-10e865e7d1ca',
          fullname: 'Emily Davis',
          username: 'emilydavis',
          email: 'emily@example.com',
          birthdate: '1993-07-30',
          genre: 'female',
          registration_date: '2024-12-17T06:26:12.820Z',
          last_login_date: '2024-12-17T21:17:22.831Z',
          user_type: 'regular',
          status: 'active',
          profile_image: 'https://example.com/profile6.jpg',
          location: 'Austin',
          stories: [],
          interests: [],
          reportedReports: [],
          reportingReports: [],
          posts: [],
          reactions: [],
          comments: [],
          groupMembers: [],
          userChatGroup: [],
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid User ID.',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      example: {
        message:
          'No se encontró un usuario con el ID 0bc753a0-aff9-4fe2-8e16-18354f30df6e',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('username/:usernameId')
  @ApiOperation({ summary: '"Search username' })
  @ApiOkResponse({
    description: 'username found.',
    schema: {
      example: {
        id: '168bde23-b10d-4af9-807e-7d6405d378a7',
        fullname: 'Michael Johnson',
        username: 'michaeljohnson',
        email: 'michael@example.com',
        birthdate: '1992-11-02',
        genre: 'MASCULINO',
        registration_date: '2024-12-17T06:26:12.820Z',
        last_login_date: '2024-12-17T06:26:12.820Z',
        user_type: 'regular',
        status: 'active',
        profile_image: 'https://example.com/profile3.jpg',
        location: 'Chicago',
        stories: [],
        interests: [
          {
            interest_id: 'fcfe5ef4-4e39-4f8b-ba68-e7e28f0e9574',
            name: 'Música',
          },
        ],
        reportedReports: [],
        reportingReports: [],
        posts: [],
        reactions: [],
        comments: [],
        groupMembers: [],
        userChatGroup: [],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid username.',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'username not found.',
    schema: {
      example: {
        message: 'No se encontró un usuario con el username michaeljohnso',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getUserByUsername(@Param('usernameId') username: string) {
    return this.usersService.getUserByUsername(username);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify User' })
  @ApiOkResponse({
    description: 'modified User.',
    schema: {
      example: {
        status: 'success',
        message: 'User updated successfully',
        data: {
          id: '8c214a4e-8e9d-4d22-9aa7-b9e3e71bf158',
          fullname: 'Abigail Contreras',
          username: 'abiContreras',
          email: 'abi@mail.com',
          birthdate: '1995-05-15',
          genre: 'female',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'property name should not exist',
          'property nDni should not exist',
          'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).',
          'La contraseña debe tener al menos 8 caracteres.',
          'birthdate must be a valid ISO 8601 date string',
        ],
        error: 'Bad Request',
      },
    },
  })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userData: UpdateUserDTO,
  ) {
    this.usersService.updateUser(id, userData);
    return {
      status: 'success',
      message: 'User updated successfully',
      data: { id, ...userData },
    };
  }

  @Put('/saveLocation/:id')
  async saveLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() location: UpdateLocationDTO,
  ) {
    return this.usersService.saveLocation(id, location);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a User' })
  @ApiOkResponse({
    description: 'User deleted successfully.',
    schema: { example: 'Usuario eliminado correctamente.' },
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
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post(':userId/assign-interest/:interestId')
  @ApiOperation({ summary: 'Assign interests to User' })
  @ApiCreatedResponse({
    description: 'Assigned User interests.',
    schema: {
      example: {
        message: 'Interés asignado al usuario',
        usuario: 'michaeljohnson',
        interests: [
          {
            interest_id: 'fcfe5ef4-4e39-4f8b-ba68-e7e28f0e9574',
            name: 'Música',
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'invalid input values.',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Some input value is not found.',
    schema: {
      example: {
        message:
          'Cannot POST /users/168bde23-b10d-4af9-807e-7d6405d378a7/fcfe5ef4-4e39-4f8b-ba68-e7e28f0e9574',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async assignInterestToUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('interestId', ParseUUIDPipe) interestId: string,
  ) {
    return this.usersService.assignInterestToUser(userId, interestId);
  }

  @Post(':userId/remove-interest/:interestId')
  @ApiOperation({ summary: 'Remove interests to User' })
  @ApiCreatedResponse({
    description: 'Remove User interests.',
    schema: {
      example: {
        message: 'Interés removido del usuario',
        usuario: 'michaeljohnson',
        interests: [
          {
            interest_id: 'fcfe5ef4-4e39-4f8b-ba68-e7e28f0e9574',
            name: 'Música',
          },
        ],
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'invalid input values.',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Some input value is not found.',
    schema: {
      example: {
        message:
          'Cannot POST /users/168bde23-b10d-4af9-807e-7d6405d378a7/fcfe5ef4-4e39-4f8b-ba68-e7e28f0e9574',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async removeInterestToUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('interestId', ParseUUIDPipe) interestId: string,
  ) {
    return this.usersService.removeInterestToUser(userId, interestId);
  }

  @Get(':user1/distance/:user2')
  @ApiOperation({ summary: 'Get the distance between two users' })
  @ApiResponse({
    status: 200,
    description: 'The distance in kilometers between two users',
    schema: {
      type: 'object',
      properties: {
        distance: { type: 'number', description: 'The distance in kilometers' },
      },
    },
  })
  @ApiParam({ name: 'user1', description: 'UUID of the first user' })
  @ApiParam({ name: 'user2', description: 'UUID of the second user' })
  async getDistance(
    @Param('user1', ParseUUIDPipe) user1: string,
    @Param('user2', ParseUUIDPipe) user2: string,
  ) {
    return this.usersService.getDistanceBetweenUsers(user1, user2);
  }
}
