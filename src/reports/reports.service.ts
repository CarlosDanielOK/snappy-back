import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/reports.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly nodemailerService: NodemailerService
  ) { }

  async create(reportsData: CreateReportDto) {
    const { reporting, reported, description } = reportsData;

    const reportingUser = await this.usersRepository.findOne({ where: { id: reporting } });
    if (!reportingUser) throw new NotFoundException('Reporting user not found.');

    const reportedUser = await this.usersRepository.findOne({ where: { id: reported } });
    if (!reportedUser) throw new NotFoundException('Reported user not found.');

    if (reported === reporting) throw new BadRequestException('You cannot report yourself.');

    const report = this.reportsRepository.create({
      description: description,
      reporting_user: { id: reporting },
      reported_user: { id: reported },
    });

    const savedReport = this.reportsRepository.save(report);

    const subject = 'Has sido reportado';
    const text = `Has sido reportado por violar las normas de la comunidad. Motivo del reporte: ${description}`;
    const html = `
      <div style="text-align: center;">
      <img src="https://snappyfriends.vercel.app/_next/image?url=%2Ffavicon.ico&w=64&q=75" alt="Logo" style="display: block; margin: 0 auto; width: 150px; height: auto;">
      <p>Hola <strong>${reportedUser.fullname}</strong>,</p>
      <p>Has sido reportado por violar las normas de la comunidad.</p>
      <p><strong>Motivo del reporte:</strong> ${description}</p>
      <p>Por favor, revisa las normas de la comunidad y asegúrate de cumplirlas para evitar sanciones.</p>
      </div>
    `;

    try {
      await this.nodemailerService.sendEmail(
        reportedUser.email,
        subject,
        text,
        html);
    } catch (error) {
      console.error('Error al enviar el correo:', error.message);
    }

    return savedReport
  }

  async findAll() {
    const reports = await this.reportsRepository.find({ relations: ['reported_user', 'reporting_user'] });

    const resReports = reports.map(report => ({
      ...report,
      reporting_user: {
        id: report.reporting_user.id,
        fullname: report.reporting_user.fullname,
        username: report.reporting_user.username,
        profile_image: report.reporting_user.profile_image,
      },
      reported_user: {
        id: report.reported_user.id,
        fullname: report.reported_user.fullname,
        username: report.reported_user.username,
        profile_image: report.reported_user.profile_image,
      }
    }))

    return resReports;
  }

  async findOne(id: string) {
    const reportFound = await this.reportsRepository.findOne({ where: { report_id: id }, relations: ['reported_user', 'reporting_user'] });
    if (!reportFound) throw new NotFoundException('Report not found.');

    const resReport = {
      ...reportFound,
      reporting_user: {
        id: reportFound.reporting_user.id,
        fullname: reportFound.reporting_user.fullname,
        username: reportFound.reporting_user.username
      },
      reported_user: {
        id: reportFound.reported_user.id,
        fullname: reportFound.reported_user.fullname,
        username: reportFound.reported_user.username
      }
    };

    return resReport;
  }

  async remove(id: string) {
    const reportFound = await this.reportsRepository.findOne({ where: { report_id: id } });
    if (!reportFound) throw new NotFoundException('Report not found.');

    await this.reportsRepository.delete({ report_id: id });

    return "Report deleted successfully.";
  }
}
