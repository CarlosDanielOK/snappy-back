import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO, registerGoogleDTO, registerUserDTO } from './dto/auth.dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiCreatedResponse({
    description: 'successful user registration',
    schema: {
      example: {
        "fullname": "Abigail Contreras",
        "username": "abiContrerass",
        "email": "abi1@mail.com",
        "birthdate": "1995-05-15",
        "genre": "female",
        "id": "83361500-fc55-4ada-8e97-4e3bd403c9ab",
        "registration_date": "2024-12-18T01:24:56.328Z",
        "last_login_date": "2024-12-18T01:24:56.328Z",
        "user_type": "regular",
        "status": "active",
        "profile_image": "no_img.png",
        "location": "no-location"
      }
    }
  })
  @ApiConflictResponse({
    description: 'error creating user',
    schema: {
      example: {
        "message": "El email ó nombre de usuario ya se encuentra registrado.",
        "error": "Conflict",
        "statusCode": 409
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'invalid input',
    schema: {
      example: {
        "message": [
          "property user should not exist",
          "El nombre de usuario no debe contener espacios ni caracteres especiales.",
          "username must be a string",
          "username should not be empty"
        ],
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })

  signUp(@Body() userData: registerUserDTO) {
    return this.authService.signUp(userData);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    description: 'successful user login',
    schema: {
      example: {
        "userId": "83361500-fc55-4ada-8e97-4e3bd403c9ab",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgzMzYxNTAwLWZjNTUtNGFkYS04ZTk3LTRlM2JkNDAzYzlhYiIsImVtYWlsIjoiYWJpMUBtYWlsLmNvbSIsInVzZXJfdHlwZSI6InJlZ3VsYXIiLCJpYXQiOjE3MzQ0ODUzNTQsImV4cCI6MTczNDUyODU1NH0.DhnIC-Pg6TFmt7S9tKQwPwuC-TfxpfuJ_LpZ04GIb5A",
        "message": "Iniciaste sesión satisfactoriamente."
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Invalid credentials',
    schema: {
      example: {
        "message": "Credenciales invalidas.",
        "error": "Bad Request",
        "statusCode": 400
      }
    }
  })
  @HttpCode(200)
  @Post('signin')
  signIn(@Body() loginData: LoginUserDTO) {
    return this.authService.signIn(loginData.email, loginData.password);
  }

  @Post('google')
  async googleLogin(@Body('token') googleToken: string) {
    return this.authService.googleLogin(googleToken);
  }

  @Post('google/register')
  async completeGoogleRegistration(@Body() userData: registerGoogleDTO) {
    return this.authService.completeGoogleRegistration(userData);
  }
}
