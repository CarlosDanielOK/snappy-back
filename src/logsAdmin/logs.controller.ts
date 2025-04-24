import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto, FilterDto } from './dto/create-logs.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { userType } from 'src/users/entities/user.entity';

@ApiTags('LogsAdmin')
@Controller('logs')
export class AdminController {
  constructor(private readonly logsService: LogsService) { }

  @Post()
  async createLog(@Body() createLogDto: CreateLogDto) {
    return this.logsService.createLog(createLogDto);
  }


  @Get('/admin')
  async getLogs(@Query() filterLogsDto: FilterDto) {
    return this.logsService.getLogs(filterLogsDto);
  }


  @Get('user-reports')
  async getUserReports() {
    return this.logsService.getUsersReports()
  }

  @Get('/users/metrics')
  async getLogsUsers(@Query() filterLogsDto: FilterDto) {
    return this.logsService.getLogsUsers(filterLogsDto);
  }



}
