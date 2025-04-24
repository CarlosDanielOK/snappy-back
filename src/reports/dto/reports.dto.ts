import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateReportDto {
    @ApiProperty({
        type: String,
        description: 'UUID of the user who is reporting',
        example: '168bde23-b10d-4af9-807e-7d6405d378a7'
    })
    @IsString()
    reporting: string;

    @ApiProperty({
        type: String,
        description: 'UUID of the user being reported',
        example: 'cd38bd4e-9e39-4278-a930-b63926b47b05'
    })
    @IsString()
    reported: string;

    @ApiProperty({
        type: String,
        description: 'Detailed report description',
        example: 'The user is posting content'
    })
    @IsString()
    description: string;
}
