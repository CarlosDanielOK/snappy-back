import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';

export class MessageReceiverDTO {
  @IsString()
  receiver_id: string;

  @IsString()
  message_receiver: string;
}

export class MessageDTO {
  @IsString()
  id: string;

  @IsString()
  content: string;

  @IsBoolean()
  is_anonymous: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  messageReceivers: MessageReceiverDTO[];
}
