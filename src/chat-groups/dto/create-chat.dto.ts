import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    type: [String],
    description: 'List of user IDs to be included in the chat',
    example: ['1f452184-8889-4caa-989a-494e5b7a1e2c', '1f452184-8889-4caa-989a-494e5b7a1e22'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
