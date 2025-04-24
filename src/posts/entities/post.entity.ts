import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Reaction } from '../../reactions/entities/reaction.entity';
import { Comment } from 'src/comments/entities/comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  post_id: string;

  @Column('text', { nullable: false })
  content: string;

  @CreateDateColumn()
  creation_date: Date;

  @Column({
    nullable: true,
  })
  fileUrl: string;

  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Reaction[];

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.postComment)
  comments: Comment[];
}
