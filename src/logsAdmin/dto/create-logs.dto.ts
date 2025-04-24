import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export enum Action {
    CREATED = 'created',
    UPDATED = 'updated',
    DELETED = 'deleted'
}

export class FilterDto {
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

}

export class CreateLogDto {

    @ApiProperty({
        type: String,
        description: 'user uuid',
        example: '1f0aae07-270c-4ad7-9062-a15a866dccd1'
    })
    @IsNotEmpty()
    @IsUUID()
    adminId: string;

    @ApiProperty({
        enum: Action,
        description: 'enum action',
        example: Action.CREATED
    })
    @IsNotEmpty()
    @IsEnum(Action)
    action: Action.CREATED;

    @ApiProperty({
        type: String,
        description: 'Descripción del evento',
        example: 'realizo una modificación'
    })
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: Date,
        description: 'fecha del evento',
        example: '2024-12-31T23:59:59Z'
    })
    @IsDateString()
    logDate: Date


}
