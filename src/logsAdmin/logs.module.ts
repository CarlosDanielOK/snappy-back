import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AdminController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/logs.entity';
import { User } from 'src/users/entities/user.entity';
import { Report } from 'src/reports/entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log, User, Report])],
  controllers: [AdminController],
  providers: [LogsService,],
})
export class LogsModule { }
