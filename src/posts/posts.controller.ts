import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post-dto';
import { CreatePostDto } from './dto/create-post-dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { userRole, userType } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }


  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({
    description: 'Posts List.',
    schema: {
      example: {
        post_id: '5b744369-3866-499d-b152-817d6f579bc9',
        content: 'Hola, buenos días. ¿Cómo estás?',
        creation_date: '2024-12-18T18:03:12.173Z',
        fileUrl: 'https://example.com/image.png',
        reactions: [],
        user: {
          id: '168bde23-b10d-4af9-807e-7d6405d378a7',
        },
      },
    },
  })
  findAll() {
    return this.postsService.findAll();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Search for Posts by ID' })
  @ApiOkResponse({
    description: 'Post search by ID found successfully.',
    schema: {
      example: {
        post_id: '5b744369-3866-499d-b152-817d6f579bc9',
        content: 'Hola, buenos días. ¿Cómo estás?',
        creation_date: '2024-12-18T18:03:12.173Z',
        fileUrl: 'https://example.com/image.png',
        user: {
          id: '168bde23-b10d-4af9-807e-7d6405d378a7',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid Post ID.',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Post not found.',
    schema: {
      example: {
        message: 'Post not found.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }


  @Post()
  @UseInterceptors(FileInterceptor('fileImg'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create posts' })
  @ApiCreatedResponse({
    description: 'Post Created.',
    schema: {
      example: {
        content:
          'Estoy feliz!! Quiero compartir esta foto con uds. Espero tengan un bendecido inicio de semana ♥',
        fileUrl: 'https://example.com/image.png',
        user: {
          id: '168bde23-b10d-4af9-807e-7d6405d378a7',
        },
        post_id: '53f2702d-5219-4f5a-b471-0095714ac32c',
        creation_date: '2024-12-18T18:43:44.743Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Some input value is not found.',
    schema: {
      example: {
        message: [
          'property conten should not exist',
          'content should not be empty',
          'content must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  create(@Body() createPostDto: CreatePostDto, @UploadedFile() fileImg: Express.Multer.File) {
    return this.postsService.create(createPostDto, fileImg);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify Post' })
  @ApiOkResponse({
    description: 'Modified Post.',
    schema: {
      example: {
        post_id: '5b744369-3866-499d-b152-817d6f579bc9',
        content: 'Hola ♥ ',
        creation_date: '2024-12-18T18:03:12.173Z',
        fileUrl: 'https://example.com/image.png',
        userId: 'b070ed7b-217e-4294-91f3-e17be09d3fb7',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        message: ['property file should not exist', 'fileUrl must be a string'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @ApiBearerAuth()
  @Roles(userRole.ADMIN, userRole.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Post' })
  @ApiOkResponse({
    description: 'Post deleted successfully.',
    schema: { example: 'Post with id ${id} deleted successfully' },
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
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.remove(id);
  }
}
