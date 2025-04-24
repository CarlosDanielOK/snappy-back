import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsArray,
  IsString,
} from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  ANONYMOUS = 'anonymous',
}

export class CreateMessageDto {
  @IsOptional()
  send_date: Date;

  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    description: 'Message content',
    example: 'Hi, how are you?',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Is it anonymous?',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_anonymous: boolean;

  @ApiProperty({
    enum: MessageType,
    description: 'Type of message sent or received.',
    example: MessageType.TEXT,
  })
  @IsNotEmpty()
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty({
    type: String,
    description: 'User UUID',
    example: '1f0aae07-270c-4ad7-9062-a15a866dccd1',
  })
  @IsNotEmpty()
  @IsUUID()
  sender_id: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'chat UUID',
    example: 'hf0aae07-270c-4ad7-9062-a15a866dccd1',
    default: null,
  })
  @IsOptional()
  @IsUUID()
  chatId?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Group UUID',
    example: 'ff0aae07-270c-4ad7-9062-a15a866dccd1',
    default: null,
  })
  @IsOptional()
  @IsUUID()
  groupId?: string;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'List of UUID identifiers of message receivers.',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  messageReceivers?: string[];
}
