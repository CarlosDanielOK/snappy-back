import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post-dto';
import { CreatePostDto } from './dto/create-post-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { FilesRepository } from 'src/files/files.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private filesRepository: FilesRepository,
  ) { }
  async create(createPostDto: CreatePostDto, fileImg: Express.Multer.File) {
    const { userId, ...postData } = createPostDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) throw new NotFoundException('El usuario no existe');

    let fileUrl = null;
    if (fileImg) {
      const uploadedFile = await this.filesRepository.uploadImg(fileImg);
      fileUrl = uploadedFile.secure_url;
    }

    const newPost = this.postsRepository.create({
      ...postData,
      user,
      fileUrl,
    });

    const savedPost = await this.postsRepository.save(newPost);

    return {
      ...savedPost,
      user: { id: userId },
    };
  }

  async findAll() {
    try {
      const posts = await this.postsRepository.find({
        relations: ['user', 'reactions', 'reactions.user', 'comments', 'comments.user'],
      });

      const responseObject = posts.map((post) => ({
        ...post,
        user: {
          id: post.user.id,
          username: post.user.username,
          profile_image: post.user.profile_image,
          user_type: post.user.user_type
        },
        reactions: post.reactions.map((reaction) => ({
          id: reaction.reaction_id,
          user: {
            id: reaction.user.id,
            username: reaction.user.username,
            profile_image: reaction.user.profile_image,
            user_type: post.user.user_type
          }
        })),
        comments: post.comments.map((comment) => ({
          id: comment.comment_id,
          content: comment.content,
          user: {
            id: comment.user.id,
            username: comment.user.username,
            profile_image: comment.user.profile_image,
            user_type: post.user.user_type
          },
        }))
      }));
      return responseObject;
    } catch {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer todos los posts. Inténtelo nuevamente.',
      );
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.postsRepository.findOne({
        where: { post_id: id },
        relations: ['user', 'reactions', 'reactions.user', 'comments', 'comments.user'],
      });
      if (!post) {
        throw new NotFoundException('Post not found.');
      }
      const responseObject = {
        ...post,
        user: {
          id: post.user.id,
          username: post.user.username,
          profile_image: post.user.profile_image,
          user_type: post.user.user_type
        },
        reactions: post.reactions.map((reaction) => ({
          id: reaction.reaction_id,
          user: {
            id: reaction.user.id,
            username: reaction.user.username,
            profile_image: reaction.user.profile_image,
            user_type: reaction.user.user_type
          }
        })),
        comments: post.comments.map((comment) => ({
          id: comment.comment_id,
          content: comment.content,
          comment_date: comment.comment_date,
          user: {
            id: comment.user.id,
            username: comment.user.username,
            profile_image: comment.user.profile_image,
            user_type: comment.user.user_type
          },
        }))
      };

      return responseObject;
    } catch {
      throw new NotFoundException('Post not found.');
    }
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post | string> {
    try {
      const post = await this.postsRepository.findOne({
        where: { post_id: id },
      });

      if (!post) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }

      Object.assign(post, updatePostDto);

      return await this.postsRepository.save(post);
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException(
          'Ocurrió un error al actualizar el post. Por favor, verifique los datos.',
        );
      }

      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const post = await this.postsRepository.findOne({
        where: { post_id: id },
      });
      if (!post) {
        throw new BadRequestException('Post not found.');
      }
      await this.postsRepository.remove(post);
      return { message: `Post with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Post not found');
    }
  }
}
