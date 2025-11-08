import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost({ postId, userId }: { postId: number; userId: number }) {
    try {
      return await !!this.prisma.like.create({
        data: { postId, userId },
      });
    } catch (err) {
      throw new BadRequestException('You have already liked this post.');
    }
  }

  async unlikePost({ postId, userId }: { postId: number; userId: number }) {
    try {
      await this.prisma.like.delete({
        where: {
          userId_postId: { userId, postId },
        },
      });
      return true;
    } catch (err) {
      throw new BadRequestException('like does not exist.');
    }
  }

  async getPostLikesCount(postId: number) {
    return await this.prisma.like.count({ where: { postId } });
  }

  async userLikedPost({ postId, userId }: { postId: number; userId: number }) {
    const like = await this.prisma.like.findFirst({
      where: { postId, userId },
    });
    return !!like;
  }
}
