import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, userStatus } from 'src/users/entities/user.entity';
import { Between, Repository } from 'typeorm';
import { Log } from './entities/logs.entity';
import { CreateLogDto, FilterDto } from './dto/create-logs.dto';
import { Report } from 'src/reports/entities/report.entity';


@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
  ) { }

  async createLog(createLogDto: CreateLogDto): Promise<Log> {
    const { adminId, action, description } = createLogDto

    const admin = await this.usersRepository.findOne(
      {
        where: {
          id: adminId,
        }
      });

    if (!admin || (admin.user_role !== 'admin' && admin.user_role !== 'superadmin')) {
      throw new Error('Solo los admin o superAdmin pueden crear registros');
    }

    const log = this.logRepository.create({
      action,
      description,
      createdAT: new Date(),
      admin: { id: adminId }
    })

    return this.logRepository.save(log)

  }

  async getLogs(filterLogsDto: FilterDto) {

    const { startDate, endDate } = filterLogsDto;
    const query = this.logRepository.createQueryBuilder('log');

    if (startDate) {
      query.andWhere('log.createdAT >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('log.createdAT <= :endDate', { endDate });
    }

    const logs = await query.leftJoinAndSelect('log.admin', 'admin').getMany();

    const resultObjet = logs.map((log) => ({
      id: log.id,
      action: log.action,
      description: log.description,
      createdAT: log.createdAT,
      admin: { id: log.admin.id },
    }))

    return resultObjet
  }


  async getLogsUsers(filterLogsDto: FilterDto) {

    const { startDate, endDate } = filterLogsDto;

    const fromDate = startDate
      ? new Date(`${startDate}T00:00:00.000Z`)
      : new Date(0);
    const toDate = endDate
      ? new Date(`${endDate}T23:59:59.999Z`)
      : new Date();


    const totalUsers = await this.usersRepository.count({
      where: { registration_date: Between(fromDate, toDate) }
    })

    console.log(totalUsers)

    const inactiveUsers = await this.usersRepository.count({
      where: {
        status: userStatus.inactive,
        registration_date: Between(fromDate, toDate)
      }
    })

    console.log(inactiveUsers)

    const activeUsers = await this.usersRepository.count({
      where: {
        status: userStatus.ACTIVE,
        registration_date: Between(fromDate, toDate)
      }
    })

    console.log(activeUsers)

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await this.usersRepository.count({
      where: { registration_date: Between(sevenDaysAgo, toDate) },
    });

    console.log(sevenDaysAgo)

    const userTypeDistribution = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.user_type', 'user_type')
      .addSelect('COUNT(*)', 'count')
      .where('user.registration_date BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .groupBy('user.user_type')
      .getRawMany();

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsers,
      userTypeDistribution,

    };


  }

  async getUsersReports() {

    const reports = await this.reportRepository.find({
      relations: ['reported_user', 'reporting_user']
    })

    const users = await this.usersRepository.find();

    const usersWhoReport = users.map((user) => {
      const reportCount = reports.filter((report) => report.reporting_user.id === user.id).length;
      return { id: user.id, fullname: user.fullname, reportCount };
    })
      .filter((user) => user.reportCount > 0)
      .sort((a, b) => b.reportCount - a.reportCount);

    const mostReportedUsers = users
      .map((user) => {
        const reportedCount = reports.filter((report) => report.reported_user.id === user.id).length;
        return { id: user.id, fullname: user.fullname, reportedCount };
      })
      .filter((user) => user.reportedCount > 0)
      .sort((a, b) => b.reportedCount - a.reportedCount);

    const reportedUsers = reports.map((report) => report.reported_user.id);
    const uniqueReportedUsers = Array.from(new Set(reportedUsers));
    const totalReportedUsers = uniqueReportedUsers.length;

    const totalUnreportedUsers = users.length - totalReportedUsers;

    return {
      usersWhoReport,
      mostReportedUsers,
      totalReportedUsers,
      totalUnreportedUsers,
    };
  }


}

