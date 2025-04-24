import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({
    type: String,
    description: 'User UUID',
    example: '10ab217c-f4b8-464b-bb1c-10e865e7d1ca'
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    enum: ['like', 'dislike'],
    description: 'reaction',
    example: 'like'
  })
  @IsEnum(['like', 'dislike'])
  @IsNotEmpty()
  reaction: 'like' | 'dislike';

  @ApiProperty({
    enum: ['comment', 'post'],
    description: 'type of reaction',
    example: 'comment'

  })
  @IsEnum(['comment', 'post'])
  @IsNotEmpty()
  reaction_type: 'comment' | 'post';
}

export class UpdateReactionDto extends PartialType(CreateReactionDto) { }
