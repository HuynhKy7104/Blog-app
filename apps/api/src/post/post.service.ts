import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { UpdatePostInput } from './dto/update-post.input';

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

  async getUserPosts(userId: number) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },

      include: {
        author: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  }

  async updateUserPost({
    userId,
    postId,
    updateData,
  }: {
    userId: number;
    postId: number;
    updateData: UpdatePostInput;
  }) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết này!');
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException(
        'Bạn không có quyền chỉnh sửa bài viết của người khác!',
      );
    }

    return await this.prisma.post.update({
      where: {
        id: postId,
      },

      data: updateData,
    });
  }

  async deleteUserPost({ userId, postId }: { userId: number; postId: number }) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết này!');
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException(
        'Bạn không có quyền chỉnh sửa bài viết của người khác!',
      );
    }

    await this.prisma.$transaction([
      this.prisma.like.deleteMany({
        where: { postId: postId },
      }),

      this.prisma.comment.deleteMany({ where: { postId: postId } }),

      this.prisma.post.delete({
        where: { id: postId },
      }),
    ]);

    return true;
  }
}
