import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    private fileRepository: FilesRepository,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async uploadImg(userId: string, fileImg: Express.Multer.File) {
    const userFound = await this.usersRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        username: true,
      },
    });

    if (!userFound) throw new NotFoundException('User not found.');

    const uploadFileImg = await this.fileRepository.uploadImg(fileImg);
    await this.usersRepository.update(userFound.id, {
      profile_image: uploadFileImg.secure_url,
    });

    const updatedUser = {
      id: userFound.id,
      fullname: userFound.fullname,
      username: userFound.username,
      profile_image: uploadFileImg.secure_url,
    };

    return updatedUser;
  }
}
