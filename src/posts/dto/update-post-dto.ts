import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    type: String,
    description: 'uuid de user tipo string. Atributo opcional',
    example: 'b070ed7b-217e-4294-91f3-e17be09d3fb7'
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    type: String,
    description: 'Contenido del post, de tipo string. Atributo opcional',
    example: 'Buenos días. Espero tengan un bendecido inicio de semana ♥'
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    type: String,
    description: 'URL o link del video o imagen a postear. Atributo opcional',
    example: 'https://example.com/image.png'
  })
  @IsString()
  fileUrl?: string;
}
