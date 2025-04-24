import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {

  @ApiProperty({
    type: String,
    description: 'message notification',
    example: 'you have received a message'
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    enum: NotificationType,
    description: 'type of notification',
    example: NotificationType.MESSAGE
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    type: String,
    description: 'user UUID',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    type: String,
    description: 'sender user',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  sender_user?: string;
}
