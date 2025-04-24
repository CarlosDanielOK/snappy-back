import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateStoryDTO {
    @ApiProperty({
        type: String,
        description: 'uuid de user tipo string',
        example: 'b070ed7b-217e-4294-91f3-e17be09d3fb7'
      })
      @IsUUID()
      @IsNotEmpty()
      userId: string;
    
      @ApiProperty({
        type: String,
        description: 'Contenido del post, de tipo string',
        example: 'Hoy estuve en la playa y aprendí como surfear!'
      })
      @IsOptional()
      content: string;
    
      @ApiProperty({
        type: String,
        format: 'binary',
        required: false,
        default: null
      })
      @IsOptional()
      fileImg?: Express.Multer.File;
}
