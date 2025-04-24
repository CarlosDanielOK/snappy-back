import { Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, ParseUUIDPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('/uploadProfileImage/:userId')
  @ApiOperation({ summary: 'Add Files' })
  @ApiCreatedResponse({
    description: 'file added successfully',
    schema: {
      example: {
        "id": "1f452184-8889-4caa-989a-494e5b7a1e2c",
        "fullname": "Liam Moore",
        "username": "liammoore",
        "profile_image": "https://res.cloudinary.com/dz24lee3x/image/upload/v1734988502/hu44vzsmfgyrtd068nfu.png"
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User Not Found ',
    schema: {
      example: {
        "message": "User not found.",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
    schema: {
      example: {
        "message": "File must be maximum 200kb",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  @UseInterceptors(FileInterceptor('fileImg'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    schema: {
      type: 'object',
      properties: {
        fileImg: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @Param('userId', ParseUUIDPipe) userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'File must be maximum 200kb'
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/
          })
        ]
      })
    ) fileImg: Express.Multer.File) {
    return this.filesService.uploadImg(userId, fileImg);
  }
}
