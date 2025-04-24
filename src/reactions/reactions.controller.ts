import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto, UpdateReactionDto } from './dto/reaction.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { userType } from 'src/users/entities/user.entity';

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) { }

  @Post(':post_id')
  @ApiOperation({ summary: 'Create Reactions' })
  @ApiCreatedResponse({
    description: 'Created Reaction',
    schema: {
      example: {
        "reaction_id": "dfba91c6-e9bd-42f1-9f82-e2ff19d00598",
        "reaction": "like",
        "reaction_date": "2024-12-19T21:08:26.429Z",
        "post": {
          "post_id": "14daf396-1f16-42bc-a094-e9618a7bb4d6",
          "content": "Estoy feliz!! Quiero compartir esta foto con uds. Espero tengan un bendecido inicio de semana ♥",
          "creation_date": "2024-12-19T20:58:36.858Z",
          "fileUrl": "https://example.com/image.png"
        },
        "user": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1"
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Reactions Not Found ',
    schema: {
      example: {
        "message": "No se encontró el comentario con ID 14daf396-1f16-42bc-a094-e9618a7bb4d6",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Error: Bad Request',
    schema: {
      example: {
        "message": [
          "reaction must be one of the following values: "
        ],
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  create(
    @Param('post_id', ParseUUIDPipe) id: string,
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.reactionsService.create(id, createReactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Reactions.' })
  @ApiOkResponse({
    description: 'Reactions list',
    schema: {
      example: {
        "reaction_id": "dfba91c6-e9bd-42f1-9f82-e2ff19d00598",
        "reaction": "like",
        "reaction_date": "2024-12-19T21:08:26.429Z",
        "post": {
          "post_id": "14daf396-1f16-42bc-a094-e9618a7bb4d6",
          "content": "Estoy feliz!! Quiero compartir esta foto con uds. Espero tengan un bendecido inicio de semana ♥",
          "creation_date": "2024-12-19T20:58:36.858Z",
          "fileUrl": "https://example.com/image.png"
        },
        "user": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1",
        }
      }
    }
  })
  findAll() {
    return this.reactionsService.findAll();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Search for Reactions by ID' })
  @ApiOkResponse({
    description: 'Reactions search by ID successfully',
    schema: {
      example: {
        "reaction_id": "dfba91c6-e9bd-42f1-9f82-e2ff19d00598",
        "reaction": "like",
        "reaction_date": "2024-12-19T21:08:26.429Z",
        "post": {
          "post_id": "14daf396-1f16-42bc-a094-e9618a7bb4d6",
          "content": "Estoy feliz!! Quiero compartir esta foto con uds. Espero tengan un bendecido inicio de semana ♥",
          "creation_date": "2024-12-19T20:58:36.858Z",
          "fileUrl": "https://example.com/image.png"
        },
        "user": {
          "id": "1f0aae07-270c-4ad7-9062-a15a866dccd1",
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Reaction Not Found',
    schema: {
      example: {
        "message": "No se encontró la reacción con ID dfba91c6-e9bd-42f1-9f82-e2ff19d00594",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reactionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modify Reaction' })
  @ApiOkResponse({
    description: 'modified Reaction.',
    schema: {
      example: {
        "reaction_id": "dfba91c6-e9bd-42f1-9f82-e2ff19d00598",
        "reaction": "like",
        "reaction_date": "2024-12-19T21:08:26.429Z",
        "user_id": "1f0aae07-270c-4ad7-9062-a15a866dccd1",
        "reaction_type": "comment"
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'your request has incorrect parameters.',
    schema: {
      example: {
        "message": [
          "reaction must be one of the following values: ",
          "reaction_type must be one of the following values: "
        ],
        "error": "Bad Request",
        "statusCode": 400
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReactionDto: UpdateReactionDto,
  ) {
    return this.reactionsService.update(id, updateReactionDto);
  }



  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Reaction' })
  @ApiOkResponse({ description: 'Reaction deleted successfully.', schema: { example: 'Reacción con ID ${id} eliminada correctamente' } })
  @ApiBadRequestResponse({
    description: 'Some input value is not found. (uuid is expected)',
    schema: {
      example: {
        "message": "Validation failed (uuid is expected)",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Reaction not found',
    schema: {
      example: {
        "message": "No se encontró la reacción con ID dfba91c6-e9bd-42f1-9f82-e2ff19d00595",
        "error": "Not Found",
        "statusCode": 404
      }
    }
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reactionsService.remove(id);
  }
}
