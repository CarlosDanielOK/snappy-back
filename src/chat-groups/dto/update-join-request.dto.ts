import { IsEnum } from 'class-validator';
import { RequestStatus } from '../entities/group-join-request.entity';

export class UpdateJoinRequestDto {
  @IsEnum(RequestStatus, { message: 'El status debe ser ACCEPTED o REJECTED.' })
  status: RequestStatus;
}
