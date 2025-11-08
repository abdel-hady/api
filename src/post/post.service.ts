import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async findAll({
    skip = 0,
    take = DEFAULT_PAGE_SIZE,
  }: {
    skip?: number;
    take?: number;
  }) {
    return await this.prisma.post.findMany({ take, skip }); // .skip(skip, take);
  }

  async count() {
    return await this.prisma.post.count();
  }

  async findOne(id: number) {
    return await this.prisma.post.findFirst({
      where: { id },
      include: { author: true, tags: true },
    });
  }

  async findByUser({
    userId,
    skip,
    take,
  }: {
    userId: number;
    skip: number;
    take: number;
  }) {
    return await this.prisma.post.findMany({
      where: { author: { id: userId } },
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        thumbnail: true,
        createdAt: true,
        published: true,
        _count: {
          select: { comments: true, likes: true },
        },
      },
      take,
      skip,
    });
  }

  async userPostCount(userId: number) {
    return await this.prisma.post.count({ where: { authorId: userId } });
  }

  async create({
    createPostInput,
    authorId,
  }: {
    createPostInput: any;
    authorId: number;
  }) {
    return await this.prisma.post.create({
      data: {
        ...createPostInput,
        author: {
          connect: { id: authorId },
        },
        tags: {
          connectOrCreate: createPostInput.tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
  }
}
