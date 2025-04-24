import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) { }

  @Post(':followerId/:followingId')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiCreatedResponse({
    description: 'Successfully followed the user.',
    schema: {
      example: {
        id: '2cbb7d0f-d8a4-423d-8b58-d83be139b01b',
        follower: { id: 'follower-uuid', username: 'john_doe' },
        following: { id: 'following-uuid', username: 'jane_doe' },
        createdAt: '2025-01-01T00:00:00Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Bad request, e.g., trying to follow yourself or already following.',
    schema: {
      example: {
        message: 'You cannot follow yourself',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'One or both users not found.',
    schema: {
      example: {
        message: 'One or both users do not exist',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async followUser(
    @Param('followerId', ParseUUIDPipe) followerId: string,
    @Param('followingId', ParseUUIDPipe) followingId: string,
  ) {
    return this.followService.followUser(followerId, followingId);
  }

  @Delete(':followerId/:followingId')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiOkResponse({
    description: 'Successfully unfollowed the user.',
    schema: {
      example: 'Successfully unfollowed the user.',
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request, e.g., not following the user.',
    schema: {
      example: {
        message: 'You are not following this user',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'One or both users not found.',
    schema: {
      example: {
        message: 'One or both users do not exist',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async unfollowUser(
    @Param('followerId', ParseUUIDPipe) followerId: string,
    @Param('followingId', ParseUUIDPipe) followingId: string,
  ) {
    return this.followService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiOkResponse({
    description: 'List of users following the specified user.',
    schema: {
      example: [
        {
          id: '240c6254-b9e0-4110-bfd7-06e2e93618d7',
          username: 'cosmeFulanit0',
          profile_image:
            'https://lh3.googleusercontent.com/a/ACg8ocJFwlkf_u0db45oe1Ws_iOc68YH-tHmVYzqfpI17Un721a5',
          user_type: 'regular',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getFollowers(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'Get users followed by a user' })
  @ApiOkResponse({
    description: 'List of users followed by the specified user.',
    schema: {
      example: [
        {
          id: '240c6254-b9e0-4110-bfd7-06e2e93618d7',
          username: 'cosmeFulanit0',
          profile_image:
            'https://lh3.googleusercontent.com/a/ACg8ocJFwlkf_u0db45oe1Ws_iOc68YH-tHmVYzqfpI17Un721a5',
          user_type: 'regular',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getFollowing(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.followService.getFollowing(userId);
  }

  @Get(':userId/friends')
  @ApiOperation({ summary: 'Get friends of a user' })
  @ApiOkResponse({
    description:
      'List of friends (users both following and followed by the specified user).',
    schema: {
      example: [
        {
          id: 'f2ebba9f-1ec7-43aa-a031-109c03c14844',
          username: 'johndoe',
          profile_image: '/no_img.png',
          user_type: 'regular',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
    schema: {
      example: {
        message: 'User not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async getFriends(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.followService.getFriends(userId);
  }

  @Get(':followerId/:followingId')
  @ApiOperation({ summary: 'Check if a user is following another user' })
  @ApiOkResponse({
    description: 'Returns whether the first user is following the second user.',
    schema: {
      example: true,
    },
  })
  @ApiNotFoundResponse({
    description: 'One or both users not found.',
    schema: {
      example: {
        message: 'One or both users do not exist',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async isFollowing(
    @Param('followerId', ParseUUIDPipe) followerId: string,
    @Param('followingId', ParseUUIDPipe) followingId: string,
  ): Promise<boolean> {
    return this.followService.isFollowing(followerId, followingId);
  }
}
