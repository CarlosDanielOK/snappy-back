import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateGroupMemberDto } from '../dto/create-group-member.dto';
import { UpdateGroupMemberDto } from '../dto/update-group-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group_Members } from '../entities/groupMembers.entity';
import { Repository } from 'typeorm';
import { Chat_Groups } from '../entities/chat-group.entity';
import {
  GroupJoinRequest,
  RequestStatus,
} from '../entities/group-join-request.entity';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(Group_Members)
    private groupMembersRepository: Repository<Group_Members>,
    @InjectRepository(Chat_Groups)
    private chatGroupsRepository: Repository<Chat_Groups>,
    @InjectRepository(GroupJoinRequest)
    private groupJoinRequestsRepository: Repository<GroupJoinRequest>,
  ) {}

  async create(createGroupMemberDto: CreateGroupMemberDto) {
    const { group_id, user_id } = createGroupMemberDto;
    const foundGroup = await this.chatGroupsRepository.findOne({
      where: { group_id },
      select: ['group_id', 'name', 'privacy'],
    });

    if (!foundGroup) {
      throw new NotFoundException(
        `El grupo de chat con el id ${group_id} no fue encontrado.`,
      );
    }

    const foundUser = await this.groupMembersRepository.findOne({
      where: { user_id, group_id },
    });
    if (foundUser) {
      throw new ConflictException(
        `El usuario con el id ${user_id} ya se encuentra en el grupo.`,
      );
    }

    if (foundGroup.privacy === 'PUBLIC') {
      const newGroupMember = this.groupMembersRepository.create({
        user_id,
        group_id,
      });

      await this.groupMembersRepository.save(newGroupMember);

      return {
        message: `Ingreso éxitoso al grupo público: ${foundGroup.name}`,
      };
    } else if (foundGroup.privacy === 'PRIVATE') {
      const joinRequest = this.groupJoinRequestsRepository.create({
        user: { id: user_id },
        group: { group_id },
      });
      await this.groupJoinRequestsRepository.save(joinRequest);

      return {
        message: `Solicitud enviada para unirse al grupo privado: ${foundGroup.name}`,
      };
    }
  }

  async findAll() {
    try {
      const allGroupMembers = await this.groupMembersRepository.find({
        relations: ['group'],
        select: {
          group_id: true,
          user_id: true,
          role: true,
          join_date: true,
          group: {
            name: true,
            description: true,
            creation_date: true,
            privacy: true,
          },
        },
      });

      return allGroupMembers;
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer miembros del grupo. Inténtelo nuevamente.',
      );
    }
  }

  async findOne(group_id: string, user_id: string) {
    try {
      const groupMember = await this.groupMembersRepository.find({
        where: { group_id, user_id },
      });

      return groupMember;
    } catch {
      throw new InternalServerErrorException(
        `Error en la solicitud. Por favor inténtelo nuevamente.`,
      );
    }
  }

  async update(
    id: string,
    updateGroupMemberDto: UpdateGroupMemberDto,
    groupId: string,
  ) {
    const groupMemberFound = await this.groupMembersRepository.findOne({
      where: { user_id: id, group_id: groupId },
    });

    if (!groupMemberFound) {
      throw new NotFoundException(
        `El usuario con el id ${id} no se encuentra en el grupo con id ${groupId}.`,
      );
    }

    if (groupMemberFound.role === updateGroupMemberDto.role) {
      throw new UnprocessableEntityException(
        `El rol que se le quiere asignar al usuario con id ${id} es el mismo rol que ya tiene asignado.`,
      );
    }

    groupMemberFound.role = updateGroupMemberDto.role;
    await this.groupMembersRepository.save(groupMemberFound);

    return {
      message: `El rol del miembro con id ${id} en el grupo ${groupId} ha sido actualizado a ${groupMemberFound.role}`,
    };
  }

  async handleJoinRequest(requestId: string, status: 'ACCEPTED' | 'REJECTED') {
    const joinRequest = await this.groupJoinRequestsRepository.findOne({
      where: { id: requestId },
      relations: ['group', 'user'],
    });

    if (!joinRequest) {
      throw new NotFoundException(
        `Solicitud con ID ${requestId} no encontrada.`,
      );
    }

    joinRequest.status = RequestStatus[status];

    if (status === RequestStatus.ACCEPTED) {
      const newMember = this.groupMembersRepository.create({
        user_id: joinRequest.user.id,
        group_id: joinRequest.group.group_id,
      });
      await this.groupMembersRepository.save(newMember);
    }

    await this.groupJoinRequestsRepository.save(joinRequest);

    const responseObject = {
      ...joinRequest,
      user: {
        id: joinRequest.user.id,
        fullname: joinRequest.user.fullname,
        username: joinRequest.user.username,
      },
    };

    return responseObject;
  }

  async removeFromAdmin(id: string, group_id: string) {
    const groupMemberToRemove = await this.groupMembersRepository.findOne({
      where: { user_id: id, group_id },
    });

    if (!groupMemberToRemove) {
      throw new NotFoundException(`El usuario no está en este grupo.`);
    }

    await this.groupMembersRepository.remove(groupMemberToRemove);

    return {
      message: `El usuario con ID ${id} ha sido eliminado del grupo.`,
    };
  }

  async leaveGroup(group_id: string, user_id: string) {
    const groupMemberToLeave = await this.groupMembersRepository.findOne({
      where: { user_id, group_id },
    });

    if (!groupMemberToLeave) {
      throw new NotFoundException(`El usuario no está en este grupo.`);
    }

    await this.groupMembersRepository.remove(groupMemberToLeave);

    return {
      message: `El usuario con ID ${user_id} ha salido del grupo.`,
    };
  }

  async findGroupsByUserId(userId: string) {
    const groupMembers = await this.groupMembersRepository.find({
      where: { user_id: userId },
      relations: ['group'],
    });

    return groupMembers.map((member) => ({
      id: member.group.group_id,
      ...member.group,
    }));
  }

  async findAllMemberByGroupId(group_id: string) {
    const groupMembers = await this.groupMembersRepository.find({
      where: { group_id: group_id },
      relations: ['user'],
    });

    return groupMembers;
  }
}
