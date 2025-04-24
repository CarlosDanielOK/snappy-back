import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mailFrom, mailTransporter } from 'src/config/mail';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class NodemailerService {

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }


  async sendEmail(to: string, subject: string, text: string, html?: string) {

    const user = await this.usersRepository.findOne({ where: { email: to } });

    if (!user) {
      throw new Error(`No se encontró ningún usuario con el correo: ${to}`);
    }

    try {
      const mailOptions = {
        from: mailFrom,
        to,
        subject,
        text,
        html: html || `
        <div style="text-align: center;">
        <img src="https://snappyfriends.vercel.app/_next/image?url=%2Ffavicon.ico&w=64&q=75" alt="Logo" style="display: block; margin: 0 auto; width: 150px; height: auto;">
      <h1>¡Bienvenido, ${user.fullname}!</h1>
      <>
      <p>Hola ${user.fullname}, gracias por unirte a nuestra plataforma SnappyFriends. Si tienes alguna pregunta, no dudes en contactarnos.</p>
      </div>
    `,
      };
      await mailTransporter.sendMail(mailOptions)

    } catch (error) {
      console.error('Error al enviar el correo:', error.message)
      throw new Error('No se pudo enviar el correo. Verifica las credenciales o la configuración.');
    }

  }

}
