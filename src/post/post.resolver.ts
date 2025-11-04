import { Resolver, Query } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post], { name: 'post' })
  findAll() {
    return this.postService.findAll();
  }
}
