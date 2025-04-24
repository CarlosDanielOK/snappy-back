import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { userType } from 'src/users/entities/user.entity';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  @ApiOperation({ summary: 'Create Comment' })
  @ApiCreatedResponse({
    description: 'Comment Created.',
    schema: {
      example: {
        "content": "Que fortuna haberte conocido y compartir contigo ♥",
        "comment_date": "2024-12-18T19:34:33.276Z",
        "user": {
          "id": "168bde23-b10d-4af9-807e-7d6405d378a7",
          "fullname": "Michael Johnson",
          "username": "michaeljohnson",
          "email": "michael@example.com",
          "password": "$2b$10$QiT63r6DaoBoQfZpPmWQou9BFk0TOTsVsasDUSKvG3MX.n93Ezn7a",
          "birthdate": "1992-11-02",
          "genre": "MASCULINO",
          "registration_date": "2024-12-17T06:26:12.820Z",
          "last_login_date": "2024-12-17T06:26:12.820Z",
          "user_type": "regular",
          "status": "active",
          "profile_image": "https://example.com/profile3.jpg",
          "location": "Chicago"
        },
        "postComment": {
          "post_id": "3fb11b1d-c525-494e-88e9-c2cea0625bdc",
          "content": "Estoy feliz!! Quiero compartir esta foto con uds. Espero tengan un bendecido inicio de semana ♥",
          "creation_date": "2024-12-18T18:53:35.392Z",
          "fileUrl": "https://example.com/image.png"
        },
        "comment_id": "96489f9e-180d-40ff-b4d7-2cc77c5b2537"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Unexpected error',
    schema: {
      example: {
        "message": "Ocurrió un error inesperado al crear un comment. Inténtelo de nuevo.",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.createComment(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Comments' })
  @ApiOkResponse({
    description: 'Comments List.',
    schema: {
      example: {
        "comment_id": "f4d37b89-3d49-4905-a68f-4a64b2b271e5",
        "content": "Que fortuna haberte conocido y compartir contigo ♥",
        "comment_date": "2024-12-18T19:19:38.566Z",
        "user": {
          "id": "168bde23-b10d-4af9-807e-7d6405d378a7"
        },
        "postComment": {
          "id": "5b744369-3866-499d-b152-817d6f579bc9"
        }
      }
    }
  })
  findAllComments() {
    return this.commentsService.findAllComments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search for Comment by ID' })
  @ApiOkResponse({
    description: 'Comment search by ID found successfully.',
    schema: {
      example: {
        "comment_id": "f4d37b89-3d49-4905-a68f-4a64b2b271e5",
        "content": "Que fortuna haberte conocido y compartir contigo ♥",
        "comment_date": "2024-12-18T19:19:38.566Z",
        "user": {
          "id": "168bde23-b10d-4af9-807e-7d6405d378a7"
        },
        "postComment": {
          "id": "5b744369-3866-499d-b152-817d6f579bc9"
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Invalid Comment ID.',
    schema: {
      example: {
        "message": "Comment not found.",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Comment not found.',
    schema: {
      example: {
        "message": "Comment not found.",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  findOneComment(@Param('id') id: string) {
    return this.commentsService.findOneComment(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify Comment' })
  @ApiOkResponse({
    description: 'Modified Comment.',
    schema: {
      example: {
        "comment_id": "96489f9e-180d-40ff-b4d7-2cc77c5b2537",
        "content": "Que ♥",
        "comment_date": "2024-12-18T19:34:33.276Z",
        "user_id": "168bde23-b10d-4af9-807e-7d6405d378a7",
        "post_id": "53f2702d-5219-4f5a-b471-0095714ac32c"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        "message": [
          "property post_i should not exist"
        ],
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Comment' })
  @ApiOkResponse({ description: 'Comment deleted successfully.', schema: { example: 'Post with id ${commentId} deleted successfully' } })
  @ApiBadRequestResponse({
    description: 'Some input value is not found. (uuid is expected)',
    schema: {
      example: {
        "message": "Comment not found",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }
}
