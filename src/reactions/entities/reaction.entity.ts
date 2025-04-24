import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity('reactions')
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  reaction_id: string;

  @Column({
    type: 'enum',
    enum: ['like', 'dislike'],
    nullable: false,
  })
  reaction: 'like' | 'dislike';

  @CreateDateColumn()
  reaction_date: Date;

  @ManyToOne(() => Post, (post) => post.reactions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.reactions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.reactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
