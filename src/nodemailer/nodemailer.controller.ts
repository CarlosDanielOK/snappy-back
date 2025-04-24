import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { SendMailDTO } from './dto/create-nodemailer.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';


@Controller('nodemailer')
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) { }

  @Post('sendMail')
  async sendEmail(
    @Body() mailData: SendMailDTO) {
    const { to, subject, text, html } = mailData;
    return this.nodemailerService.sendEmail(to, subject, text, html);
  }

}
