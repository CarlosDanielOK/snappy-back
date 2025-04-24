import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class registerUserDTO {
    @ApiProperty({
        example: 'Abigail Contreras',
        description: 'Nombre completo del usuario, solo letras y espacios. Min: 3, Max: 80 caracteres',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @Matches(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, {
        message: 'El nombre completo solo puede contener letras y espacios.',
    })
    fullname: string;

    @ApiProperty({
        example: 'abiContreras',
        description: 'El username del usuario, sin espacios ni caracteres especiales',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z0-9_]+$/, {
        message: 'El nombre de usuario no debe contener espacios ni caracteres especiales.',
    })
    username: string;

    @ApiProperty({
        example: 'abi@mail.com',
        description: 'Correo electrónico válido del usuario',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'AbiContrera$2024',
        description: 'La contraseña debe tener minimo 8 caracteres, máximo 8 caracteres y debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).'
    })
    @IsOptional()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(20, { message: 'La contraseña debe tener como máximo 20 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
        message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (por ejemplo, !@#$%^&*).',
    })
    password: string;

    @ApiProperty({
        example: '1995-05-15',
        description: 'Fecha de nacimiento del usuario en formato ISO (YYYY-MM-DD)',
    })
    @IsNotEmpty()
    @IsDateString()
    birthdate: string;

    @ApiProperty({
        example: 'female',
        description: 'Género del usuario, puede ser male, female u otros',
    })
    @IsNotEmpty()
    @IsString()
    genre: string;

    @ApiProperty({
        type: String,
        description: 'Descripción del usuario, máximo 255 caracteres.',
        example: 'Soy una persona muy alegre y me gusta mucho bailar.',
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description: string;
}

export class registerGoogleDTO {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    genre: string;

    @IsDateString()
    birthdate: string;

    @IsOptional()
    @IsString()
    profile_image: string;

    @IsOptional()
    @IsString()
    googleId: string;
}

export class LoginUserDTO extends PickType(registerUserDTO, [
    'email',
    'password']) { }

