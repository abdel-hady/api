import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async likePost(
    @Context() context,
    @Args('postId', { type: () => Int }) postId: number,
  ) {
    const userId = context.req.user.id;
    return await this.likeService.likePost({ userId, postId });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async unlikePost(
    @Context() context,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    const userId = context.req.user.id;
    return await this.likeService.unlikePost({ userId, postId });
  }

  @Query(() => Int)
  async postLikeCount(@Args('postId', { type: () => Int! }) postId: number) {
    return await this.likeService.getPostLikesCount(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  async userLikedPost(
    @Context() context,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    const userId = context.req.user.id;
    return await this.likeService.userLikedPost({ userId, postId });
  }
}
