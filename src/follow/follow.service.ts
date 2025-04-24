import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entities/notification.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new NotFoundException('One or both users do not exist');
    }

    const alreadyFollowing = await this.isFollowing(followerId, followingId);

    if (alreadyFollowing) {
      throw new BadRequestException('You are already following this user');
    }

    const follow = this.followRepository.create({
      follower,
      following,
      createdAt: new Date(),
    });

    await this.followRepository.save(follow);

    this.notificationsService.create({
      content: 'ha comenzado a seguirte',
      type: NotificationType.FOLLOWER,
      user_id: following.id,
      sender_user: follower.id,
    });

    return 'Successfully followed the user';
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new NotFoundException('One or both users do not exist');
    }

    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new BadRequestException('You are not following this user');
    }

    await this.followRepository.delete(follow.id);
  }

  async getFollowers(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.followRepository
      .createQueryBuilder('follow')
      .innerJoin('follow.follower', 'follower')
      .where('follow.followingId = :userId', { userId })
      .select([
        'follower.id AS id',
        'follower.username AS username',
        'follower.profile_image AS profile_image',
        'follower.user_type AS user_type',
      ])
      .getRawMany();
  }

  async getFollowing(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.followRepository
      .createQueryBuilder('follow')
      .innerJoin('follow.following', 'following')
      .where('follow.followerId = :userId', { userId })
      .select([
        'following.id AS id',
        'following.username AS username',
        'following.profile_image AS profile_image',
        'following.user_type AS user_type',
      ])
      .getRawMany();
  }

  async getFriends(userId: string) {
    const followers = await this.getFollowers(userId);
    const following = await this.getFollowing(userId);

    return following.filter((followedUser) =>
      followers.some((follower) => follower.id === followedUser.id),
    );
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    return !!follow;
  }
}
