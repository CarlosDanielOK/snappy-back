import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Report]), NodemailerModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule { }
