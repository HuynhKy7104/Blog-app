import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_PAGE_SIZE } from '../../constants';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  async findManyPyPost({
    postId,
    take,
    skip,
  }: {
    postId: number;
    take?: number;
    skip?: number;
  }) {
    return await this.prisma.comment.findMany({
      where: {
        postId,
      },

      include: {
        author: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

      skip: skip ?? 0,
      take: take ?? DEFAULT_PAGE_SIZE,
    });
  }

  async count(postId: number) {
    return await this.prisma.comment.count({
      where: {
        postId,
      },
    });
  }

  async createPostComment({
    postId,
    content,
    userId,
  }: {
    postId: number;
    content: string;
    userId: number;
  }) {
    return await this.prisma.comment.create({
      data: {
        content: content,
        post: {
          connect: { id: postId },
        },
        author: {
          connect: { id: userId },
        },
      },
    });
  }
}
