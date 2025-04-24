/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { registerGoogleDTO, registerUserDTO } from './dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { Roles } from 'src/decorators/roles.decorator';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private nodemailerService: NodemailerService
  ) { }

  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async signUp(registerData: registerUserDTO) {
    const foundEmail = await this.usersRepository.findOneBy({ email: registerData.email });
    if (foundEmail) throw new ConflictException('El email ya se encuentra registrado.');

    const foundUsername = await this.usersRepository.findOneBy({ username: registerData.username });
    if (foundUsername) throw new ConflictException('El nombre de usuario ya está registrado.');

    if (registerData.password) {
      const hashedPassword = await bcrypt.hash(registerData.password, 10);
      const newUser = { ...registerData, password: hashedPassword }

      await this.usersRepository.save(newUser);

      const { password, ...userWithoutPassword } = newUser;

      await this.nodemailerService.sendEmail(
        userWithoutPassword.email,
        registerData.email,
        'Bienvenido A snappyFriends!',
        `<div style="text-align: center;">
        <img src="https://snappyfriends.vercel.app/_next/image?url=%2Ffavicon.ico&w=64&q=75" alt="Logo" style="display: block; margin: 0 auto; width: 150px; height: auto;">
        <h1>¡Bienvenido, !</h1>
        <p>Gracias por unirte a nuestra plataforma SnappyFriends ☺. Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
      `,
      );

      return userWithoutPassword;

    } else {
      await this.usersRepository.save(registerData);

      await this.nodemailerService.sendEmail(
        registerData.email,
        'Bienvenido A snappyFriends!',
        `<div style="text-align: center;">
        <img src="https://snappyfriends.vercel.app/_next/image?url=%2Ffavicon.ico&w=64&q=75" alt="Logo" style="display: block; margin: 0 auto; width: 150px; height: auto;">
        <h1>¡Bienvenido, !</h1>
        <p>Gracias por unirte a nuestra plataforma SnappyFriends ☺. Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
      `,
      );

      return registerData;
    }
  }

  async signIn(email: string, password: string) {
    const foundUser = await this.usersRepository.findOneBy({ email });

    if (!foundUser) throw new BadRequestException('Credenciales invalidas.');

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) throw new BadRequestException('Credenciales invalidas.');

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      user_type: foundUser.user_type,
      user_status: foundUser.status,
      Roles: [foundUser.user_role]
    }

    const token = this.jwtService.sign(payload);

    const userId = payload.id
    const user_type = payload.user_type
    const user_status = payload.user_status
    const roles = payload.Roles

    return { userId, token, user_type, user_status, roles, message: "Iniciaste sesión satisfactoriamente." };
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token de Google no válido');
    }
  }

  async googleLogin(googleToken: string) {
    const payload = await this.verifyGoogleToken(googleToken);

    if (!payload) {
      throw new UnauthorizedException('Credenciales de Google inválidas');
    }

    const { email, name, sub: googleId, picture } = payload;

    const user = await this.usersRepository.findOneBy({ email });

    if (user) {
      const jwtPayload = {
        id: user.id,
        email: user.email,
        user_type: user.user_type,
        user_status: user.status,
        roles: [user.user_role]
      };

      const token = this.jwtService.sign(jwtPayload);

      return { userId: user.id, token, user_type: user.user_type, user_status: user.status };
    }

    return { email, googleId, picture, fullname: name };
  }

  async completeGoogleRegistration(userData: registerGoogleDTO) {
    const existingEmail = await this.usersRepository.findOneBy({ email: userData.email });
    if (existingEmail) throw new BadRequestException('El email ya está registrado.');

    const existingUser = await this.usersRepository.findOneBy({ username: userData.username });
    if (existingUser) throw new BadRequestException('El usuario ya está registrado.');

    const user = this.usersRepository.create(userData);
    await this.usersRepository.save(user);

    const jwtPayload = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    };

    const token = this.jwtService.sign(jwtPayload);

    const emailSubject = '¡Bienvenido a nuestra plataforma!';
    const emailText = `Hola ${user.fullname}, gracias por registrarte con nosotros.`;
    const emailHtml = `
      <div style="text-align: center;">
        <img src="https://snappyfriends.vercel.app/_next/image?url=%2Ffavicon.ico&w=64&q=75" alt="Logo" style="display: block; margin: 0 auto; width: 150px; height: auto;">
      <h1>¡Bienvenido, ${user.fullname}!</h1>
      <p>Gracias por unirte a nuestra plataforma SnappyFriends. Si tienes alguna pregunta, no dudes en contactarnos.</p>
      </div>
    `;

    await this.nodemailerService.sendEmail(
      user.email,
      emailSubject,
      emailText,
      emailHtml);

    return { userId: user.id, token, user_type: user.user_type };

  }
}