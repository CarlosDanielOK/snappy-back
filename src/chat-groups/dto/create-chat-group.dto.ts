import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateChatGroupDto {
  @ApiProperty({
    type: String,
    description: 'The name of the chat group',
    example: 'Study Group',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'A short description of the chat group',
    example: 'A group for discussing course topics',
    required: false,
  })
  @IsString()
  description: string;

  @IsOptional()
  @ApiProperty({
    enum: ['PUBLIC', 'PRIVATE'],
    description: 'The privacy level of the chat group',
    example: 'PUBLIC',
    default: 'PUBLIC',
  })
  @IsEnum(['PUBLIC', 'PRIVATE'])
  privacy: 'PUBLIC' | 'PRIVATE';

  @ApiProperty({
    type: String,
    description: 'UUID of the user creating the chat group',
    example: '1f452184-8889-4caa-989a-494e5b7a1e2c',
  })
  @IsString()
  @IsNotEmpty()
  creator_id: string;

  @IsOptional()
  members: string[];
}
