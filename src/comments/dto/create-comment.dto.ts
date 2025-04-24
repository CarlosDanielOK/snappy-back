import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";


export class CreateCommentDto {

    @ApiProperty({
        type: String,
        description: 'Contenido del comentario, es de tipo string',
        example: 'Que fortuna haberte conocido y compartir contigo ♥'
    })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({
        type: String,
        description: 'uuid del user, tipo string',
        example: '168bde23-b10d-4af9-807e-7d6405d378a7'
    })
    @IsNotEmpty()
    @IsUUID()
    user_id: string

    @ApiProperty({
        type: String,
        description: 'uuid del post, tipo string',
        example: '53f2702d-5219-4f5a-b471-0095714ac32c'
    })
    @IsNotEmpty()
    @IsUUID()
    post_id: string

}
