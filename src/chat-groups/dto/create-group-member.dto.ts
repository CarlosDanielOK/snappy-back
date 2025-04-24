import { IsUUID, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../entities/groupMembers.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupMemberDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'group UUID',
    example: '0883cdc3-a945-474e-bdb9-f07969a42c31',
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'user UUID being added to the group',
    example: '1f452184-8889-4caa-989a-494e5b7a1e2c',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    enum: Role,
    description: 'The role assigned to the user in the group',
    example: 'ADMIN',
    required: false,
    default: 'MEMBER',
  })
  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  creator_id: string;
}
