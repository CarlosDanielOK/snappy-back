import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateStoryDTO } from './dto/stories.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) { }


  @Post()
  @UseInterceptors(FileInterceptor('fileImg'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create stories' })
  @ApiCreatedResponse({
    description: 'Story created successfully.',
    schema: {
      example: {
        content:
          'Hoy estuve en la playa y aprendí como surfear!',
        fileUrl: 'https://example.com/image.png',
        user: {
          id: '168bde23-b10d-4af9-807e-7d6405d378a7',
        },
        story_id: '53f2702d-5219-4f5a-b471-0095714ac32c',
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
  create(@Body() storyData: CreateStoryDTO, @UploadedFile() fileImg: Express.Multer.File) {
    return this.storiesService.create(storyData, fileImg);
  }


  @Get()
  @ApiOperation({ summary: 'Get all stories' })
  @ApiOkResponse({
    description: 'Stories List',
    schema: {
      example: [
        {
          "story_id": "3f8dff88-9530-4a2d-a9a7-d3ef2235a9dd",
          "content": "Hoy estuve en la playa y aprendí como surfear!",
          "fileUrl": null,
          "creation_date": "2024-12-27T00:55:32.052Z",
          "expiration_date": "2024-12-27T00:55:32.052Z",
          "user": {
            "userId": "cb88b2a7-55c5-41fc-aa4a-a8c52ce28ad3",
            "username": "michaeljohnson",
            "fullname": "Michael Johnson"
          }
        },
        {
          "story_id": "768393cf-04a5-4ad9-b998-1f1ca5140af3",
          "content": "Hoy estuve en la playa y aprendí como surfear!",
          "fileUrl": "https://res.cloudinary.com/dz24lee3x/image/upload/v1735260949/jfks7viiimygaveoqeiv.png",
          "creation_date": "2024-12-27T00:55:46.484Z",
          "expiration_date": "2024-12-27T00:55:46.484Z",
          "user": {
            "userId": "cb88b2a7-55c5-41fc-aa4a-a8c52ce28ad3",
            "username": "michaeljohnson",
            "fullname": "Michael Johnson"
          }
        }
      ],
    },
  })
  findAll() {
    return this.storiesService.findAll();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Search stories by ID' })
  @ApiOkResponse({
    description: 'Story found successfully.',
    schema: {
      example: {
        "story_id": "3f8dff88-9530-4a2d-a9a7-d3ef2235a9dd",
        "content": "Hoy estuve en la playa y aprendí como surfear!",
        "fileUrl": null,
        "creation_date": "2024-12-27T00:55:32.052Z",
        "expiration_date": "2024-12-27T00:55:32.052Z",
        "user": {
          "userId": "cb88b2a7-55c5-41fc-aa4a-a8c52ce28ad3",
          "username": "michaeljohnson",
          "fullname": "Michael Johnson"
        }
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid Story ID.',
    schema: {
      example: {
        message: 'Validation failed (uuid is expected)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Story not found.',
    schema: {
      example: {
        message: 'Story not found.',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storiesService.findOne(id);
  }

  @Get('user/:id')
  findByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.storiesService.findByUser(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Story' })
  @ApiOkResponse({
    description: 'Story deleted successfully.',
    schema: {
      example: {
        "message": "Story deleted successfully."
      }
    },
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
    return this.storiesService.remove(id);
  }
}
