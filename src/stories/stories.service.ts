import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoryDTO } from './dto/stories.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stories } from './entities/stories.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { FilesRepository } from 'src/files/files.repository';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Stories) private storiesRepository: Repository<Stories>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private filesRepository: FilesRepository,
  ) { }

  async create(createStoryDTO: CreateStoryDTO, fileImg: Express.Multer.File) {
    const { userId, ...storyData } = createStoryDTO;

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('El usuario no existe');

    let fileUrl = null;
    if (fileImg) {
      const uploadedFile = await this.filesRepository.uploadImg(fileImg);
      fileUrl = uploadedFile.secure_url;
    }

    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    expirationDate.setHours(currentDate.getHours() + 24);

    const newStory = this.storiesRepository.create({
        ...storyData,
        user,
        fileUrl,
        creation_date: currentDate,
        expiration_date: expirationDate,
    });

    const savedStory = await this.storiesRepository.save(newStory);

    return {
      ...savedStory,
      user: { id: userId },
    };
  }

  async findAll() {
    const storiesFound = await this.storiesRepository.find({ relations: ['user'] });

    const stories = storiesFound.map(story => ({
      ...story,
      user: { 
        userId: story.user.id,
        username: story.user.username,
        fullname: story.user.fullname,
        profile_image: story.user.profile_image,
        user_type: story.user.user_type,
      },
    }));

    return stories;
  }

  async findOne(id: string) {
    const storyFound = await this.storiesRepository.findOne({
      where: { story_id: id },
      relations: ['user']
    });
    if (!storyFound) throw new NotFoundException('Story not found.');

    return {
      ...storyFound,
      user: {
        userId: storyFound.user.id,
        username: storyFound.user.username,
        fullname: storyFound.user.fullname,
        profile_image: storyFound.user.profile_image,
        user_type: storyFound.user.user_type,
      },
    };
  }

  async findByUser(id:string) {
    const userFound = await this.usersRepository.findOne({ where: { id } });
    if(!userFound) throw new NotFoundException('User not found.');

    const stories = await this.storiesRepository.find({ 
      where: { user: { id } },
      relations: ['user']
    })

    return stories.map(story => ({
      ...story,
      user: {
        userId: story.user.id,
        username: story.user.username,
        fullname: story.user.fullname,
        profile_image: story.user.profile_image,
        user_type: story.user.user_type,
      },
    }));
  }

  async remove(id: string) {
    const storyFound = await this.storiesRepository.findOne({ where: { story_id: id } });
    if (!storyFound) throw new NotFoundException('Story not found.');

    await this.storiesRepository.delete({ story_id: id });

    return {
      message: "Story deleted successfully."
    };
  }
}
