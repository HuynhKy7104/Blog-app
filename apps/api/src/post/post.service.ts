import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_PAGE_SIZE } from '../../constants';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip: number = 0, take: number = DEFAULT_PAGE_SIZE) {
    return await this.prisma.post.findMany({
      skip,
      take,
    });
  }

  async count() {
    return await this.prisma.post.count();
  }

  async findPostById(id: number) {
    return await this.prisma.post.findUnique({
      where: {
        id: id,
      },

      include: {
        tags: true,
        author: true,
      },
    });
  }

  async likeCount(id: number) {
    return await this.prisma.like.count({
      where: {
        postId: id,
      },
    });
  }

  async isLiked({ postId, userId }: { postId: number; userId: number }) {
    const likeRecord = await this.prisma.like.findFirst({
      where: {
        postId: postId,
        userId: userId,
      },
    });
    return !!likeRecord;
  }
}
