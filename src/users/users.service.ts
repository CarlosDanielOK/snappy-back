/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetUsersDTO, UpdateLocationDTO, UpdateUserDTO } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Interest } from 'src/interests/entities/interests.entity';
import { getDistance } from 'geolib';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async getUsers(filters: GetUsersDTO) {
    const { page = 1, limit = 10, interests, username } = filters;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.interests', 'interest')
      .leftJoinAndSelect('user.chats', 'chats')
      .leftJoinAndSelect('user.followers', 'followers')
      .leftJoinAndSelect('user.following', 'following')
      .skip((page - 1) * limit)
      .take(limit);

    if (interests && Array.isArray(interests) && interests.length > 0) {
      queryBuilder.andWhere('interest.name IN (:...interests)', { interests });
    } else if (interests && !Array.isArray(interests)) {
      queryBuilder.andWhere('interest.name IN (:...interests)', {
        interests: [interests],
      });
    }

    if (username)
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });

    const usersFound = await queryBuilder.getMany();

    if (!usersFound || usersFound.length === 0) return [];

    const usersWithoutPassword = usersFound.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    );

    return usersWithoutPassword;
  }

  async getUserById(id: string) {
    const userFound = await this.usersRepository.findOne({
      where: { id },
      relations: [
        'stories',
        'interests',
        'reportedReports',
        'reportingReports',
        'posts',
        'reactions',
        'comments',
        'groupMembers',
        'followers',
        'following',
      ],
    });

    if (!userFound)
      throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    const { password, ...userWithoutPassword } = userFound;
    return userWithoutPassword;
  }

  async getUserByUsername(username: string) {
    const userFound = await this.usersRepository.findOne({
      where: { username },
      relations: [
        'stories',
        'interests',
        'reportedReports',
        'reportingReports',
        'posts',
        'reactions',
        'comments',
        'groupMembers',
        'followers',
        'followers.follower',
        'following',
        'following.following',
      ],
    });

    if (!userFound)
      throw new NotFoundException(
        `No se encontró un usuario con el username ${username}`,
      );

    const { password, ...userWithoutPassword } = userFound;
    return userWithoutPassword;
  }

  async updateUser(id: string, userData: UpdateUserDTO) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    if(userData.username) {
      const existingUser = await this.usersRepository.findOne({ where: { username: userData.username } });

      if (existingUser && existingUser.id !== id) throw new ConflictException(`El nombre de usuario "${userData.username}" ya está en uso.`);
    }

    const result = await this.usersRepository.update(id, userData);
    if (result.affected === 0)
      throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    const updatedUser = await this.usersRepository.findOne({ where: { id } });

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  async saveLocation(id: string, location: UpdateLocationDTO) {
    const result = await this.usersRepository.update(id, location);
    if (result.affected === 0) throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    return `Localización del usuario ${id} guardada con éxito. (${location})`;
  }

  async deleteUser(id: string) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`No se encontró un usuario con el ID ${id}`);

    return 'Usuario eliminado correctamente.';
  }

  async assignInterestToUser(userId: string, interestId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user)
      throw new NotFoundException(
        `No se encontró el usuario con el ID ${userId}`,
      );

    const interest = await this.interestsRepository.findOne({
      where: { interest_id: interestId },
    });
    if (!interest)
      throw new NotFoundException(
        `No se encontró el interés con el ID ${interestId}`,
      );

    if (
      user.interests.some(
        (existingInterest) => existingInterest.interest_id === interestId,
      )
    )
      throw new NotFoundException(`El usuario ya tiene este interés`);

    user.interests.push(interest);
    await this.usersRepository.save(user);

    return {
      message: 'Interés asignado al usuario',
      usuario: user.username,
      interests: user.interests,
    };
  }

  async removeInterestToUser(userId: string, interestId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });
    if (!user)
      throw new NotFoundException(
        `No se encontró el usuario con el ID ${userId}`,
      );

    const interest = await this.interestsRepository.findOne({
      where: { interest_id: interestId },
    });
    if (!interest)
      throw new NotFoundException(
        `No se encontró el interés con el ID ${interestId}`,
      );

    const userInterest = user.interests.findIndex(
      (existingInterest) => existingInterest.interest_id === interestId,
    );
    if (userInterest === -1)
      throw new NotFoundException(`El usuario no tiene este interés asignado`);

    user.interests.splice(userInterest, 1);

    await this.usersRepository.save(user);

    return {
      message: 'Interés removido del usuario',
      usuario: user.username,
      interests: user.interests,
    };
  }

  async getDistanceBetweenUsers(user1: string, user2: string): Promise<string> {
    const userFound1 = await this.usersRepository.findOne({
      where: { id: user1 },
    });
    const userFound2 = await this.usersRepository.findOne({
      where: { id: user2 },
    });

    if (!userFound1 || !userFound2) {
      throw new NotFoundException('One or both users not found');
    }

    if (
      !userFound1.location ||
      !userFound2.location ||
      !userFound1.location.x ||
      !userFound1.location.y ||
      !userFound2.location.x ||
      !userFound2.location.y
    ) {
      throw new NotFoundException(
        'One or both users do not have location data',
      );
    }

    const distanceInMeters = getDistance(
      { latitude: userFound1.location.x, longitude: userFound1.location.y },
      { latitude: userFound2.location.x, longitude: userFound2.location.y },
    );

    if (distanceInMeters > 1000) {
      return `${distanceInMeters / 1000} km`;
    }

    return `${distanceInMeters} mtrs`;
  }
}

@Injectable()
export class UsersOnlineService {
  private connectedUsers: Map<string, any> = new Map();

  addUser(socketId: string, userData: any) {
    const isUserAlreadyConnected = Array.from(
      this.connectedUsers.values(),
    ).some((user) => user.id === userData.id);
    if (!isUserAlreadyConnected) {
      this.connectedUsers.set(socketId, { ...userData, isOnline: true });
    } else {
      console.log(`Usuario ${userData.id} ya está conectado`);
    }
  }

  removeUser(socketId: string) {
    const user = this.connectedUsers.get(socketId);
    if (user) {
      user.isOnline = false;
      this.connectedUsers.set(socketId, user);
    }
    this.connectedUsers.delete(socketId);
  }

  getAllUsers() {
    return Array.from(this.connectedUsers.values());
  }
}
