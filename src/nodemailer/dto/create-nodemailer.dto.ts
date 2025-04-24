import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SendMailDTO {
    @IsEmail()
    to: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsOptional()
    @IsString()
    html?: string;
}
