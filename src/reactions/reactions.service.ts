import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReactionDto, UpdateReactionDto } from './dto/reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entities/notification.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionsRepository: Repository<Reaction>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private readonly notificationsService: NotificationsService
  ) { }

  async create(id: string, createReactionDto: CreateReactionDto) {
    const { reaction_type, reaction, user_id } = createReactionDto;

    if (reaction_type === 'comment') {
      const comment = await this.commentsRepository.findOne({
        where: { comment_id: id },
        relations: ['user'],
        select: {
          user: {
            id: true
          }
        }
      });
      if (!comment) {
        throw new NotFoundException(
          `No se encontró el comentario con ID ${id}`,
        );
      }

      const existingReaction = await this.reactionsRepository.findOne({
        where: { comment, user: { id: user_id } },
      });
      if (existingReaction) {
        throw new BadRequestException('Ya has reaccionado a este comentario!');
      }

      const newReaction = this.reactionsRepository.create({
        reaction: reaction,
        comment,
        user: { id: user_id },
      });

      if(user_id != comment.user.id) {
        this.notificationsService.create({
          content: "ha reaccionado a tu comentario",
          type: NotificationType.REACTION,
          user_id: comment.user.id,
          sender_user: user_id
        })
      }

      return await this.reactionsRepository.save(newReaction);
    }

    if (reaction_type === 'post') {
      const post = await this.postsRepository.findOne({
        where: { post_id: id },
        relations: ['user'],
        select: {
          user: {
            id: true
          }
        }
      });
      if (!post) {
        throw new NotFoundException(`No se encontró el post con ID ${id}`);
      }

      const existingReaction = await this.reactionsRepository.findOne({
        where: { post, user: { id: user_id } },
      });
      if (existingReaction) {
        throw new BadRequestException('Ya has reaccionado a esta publicación!');
      }

      const newReaction = this.reactionsRepository.create({
        reaction: reaction,
        post,
        user: { id: user_id },
      });

      if(user_id != post.user.id) {
        this.notificationsService.create({
          content: "ha reaccionado a tu publicación",
          type: NotificationType.REACTION,
          user_id: post.user.id,
          sender_user: user_id
        })
      }

      return await this.reactionsRepository.save(newReaction);
    }

    throw new BadRequestException(
      'El tipo de reacción proporcionado no es válido. Debe ser "comment" o "post".',
    );
  }

  async findAll() {
    const reactions = await this.reactionsRepository.find({
      relations: ['post', 'user'],
    });
    if (reactions.length === 0) {
      throw new NotFoundException('No hay reacciones disponibles.');
    }

    const resulReactions = reactions.map((reaction) => ({
      reaction: {
        ...reaction,
        post: {
          post: reaction.post.post_id,
          content: reaction.post.content,
          creation_date: reaction.post.creation_date,
          fileUrl: reaction.post.fileUrl
        },
        user: {
          user: reaction.user.id
        }
      }
    }))
    return resulReactions;
  }

  async findOne(id: string) {
    const reaction = await this.reactionsRepository.findOne({
      where: { reaction_id: id },
      relations: ['post', 'user'],
    });
    if (!reaction) {
      throw new NotFoundException(`No se encontró la reacción con ID ${id}`);
    }

    const resulReactions = {
      reaction: {
        ...reaction,
        post: {
          post: reaction.post.post_id,
          content: reaction.post.content,
          creation_date: reaction.post.creation_date,
          fileUrl: reaction.post.fileUrl
        },
        user: {
          user: reaction.user.id
        }
      }
    }
    return resulReactions;
  }

  async update(
    id: string,
    updateReactionDto: UpdateReactionDto,
  ): Promise<Reaction> {
    const reaction = await this.reactionsRepository.findOne({
      where: { reaction_id: id },
    });
    if (!reaction) {
      throw new NotFoundException(`No se encontró la reacción con ID ${id}`);
    }

    Object.assign(reaction, updateReactionDto);
    return await this.reactionsRepository.save(reaction);
  }

  async remove(id: string): Promise<{ message: string }> {
    const reaction = await this.reactionsRepository.findOne({
      where: { reaction_id: id },
    });
    if (!reaction) {
      throw new NotFoundException(`No se encontró la reacción con ID ${id}`);
    }

    await this.reactionsRepository.remove(reaction);
    return { message: `Reacción con ID ${id} eliminada correctamente` };
  }
}
