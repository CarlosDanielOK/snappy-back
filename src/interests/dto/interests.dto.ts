import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateInterestDTO {
  @ApiProperty({
    type: String,
    description: 'name of interest',
    example: 'Música'
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateInterestDTO {
  @ApiProperty({
    type: String,
    description: 'name of interest',
    example: 'Música'
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: Boolean,
    description: 'defines if the interest is active',
    example: true,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  active: boolean;
}
