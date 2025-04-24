import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { registerUserDTO } from 'src/auth/dto/auth.dto';
import { userStatus } from '../entities/user.entity';

export class UpdateUserDTO extends PartialType(registerUserDTO) {
  @IsOptional()
  @IsNotEmpty()
  location?: {
    x: number;
    y: number;
  };

  @IsOptional()
  @IsEnum(userStatus)
  status?: userStatus;

  @IsOptional()
  @IsString()
  last_login_date?: Date;
}

export class UpdateLocationDTO {
  @IsOptional()
  @IsNotEmpty()
  location?: {
    x: number;
    y: number;
  };
}

export class GetUsersDTO {
  @ApiPropertyOptional({
    description: 'The page number for pagination (default: 1)',
    example: 1,
  })
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'The maximum number of users per page (default: 5)',
    example: 5,
  })
  @IsOptional()
  limit: number = 40;

  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'List of interests',
    example: ['Deportes', 'Videojuegos'],
  })
  @IsOptional()
  @IsString({ each: true })
  interests?: string[];
}
