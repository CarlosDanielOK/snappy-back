import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FollowStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED'
}

@Entity('follows')
export class Follow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })  
    @JoinColumn({ name: 'followerId' })
    follower: User;

    @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })  
    @JoinColumn({ name: 'followingId' })
    following: User;

    @Column({
        type: 'enum',
        enum: FollowStatus,
        default: FollowStatus.ACCEPTED,
    })
    status: FollowStatus;

    @CreateDateColumn()
    createdAt: Date;
}
