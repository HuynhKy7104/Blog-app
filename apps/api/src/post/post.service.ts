import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_PAGE_SIZE, DEFAULT_POSTS_SIZE } from '../../constants';
import { UpdatePostInput } from './dto/update-post.input';
import { PostSortBy } from './dto/post-sort-by.enum';
import { Prisma } from '../generated/prisma/client';
import { GetUserPostsInput } from './dto/get-user-posts.input';
import { GetPostsInput } from './dto/get-posts.input';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(input: GetPostsInput) {
    const { skip = 0, take = DEFAULT_PAGE_SIZE, ...filters } = input;

    // Gọi hàm dùng chung, nhưng BẮT BUỘC gán isPublished: true
    const { where, orderBy } = this.buildPostQueryOptions({
      ...filters,
    });

    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        where,
        include: {
          author: true,
          tags: true,
          _count: { select: { likes: true, comments: true } },
        },
        orderBy,
      }),
      this.prisma.post.count({ where }),
    ]);

    return { posts, totalCount };
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

  async getUserPosts(userId: number, input: GetUserPostsInput) {
    const { skip = 0, take = DEFAULT_POSTS_SIZE, ...filters } = input;

    // Gọi hàm dùng chung, truyền thông số người dùng và buộc tìm theo userId
    const { where, orderBy } = this.buildPostQueryOptions({
      ...filters,
      authorId: userId,
    });

    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        where,
        include: {
          author: true,
          tags: true,
          _count: { select: { likes: true, comments: true } },
        },
        orderBy,
      }),
      this.prisma.post.count({ where }),
    ]);

    return { posts, totalCount };
  }

  private async findPostAndVerifyOwnership(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết này!');
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException(
        'Bạn không có quyền chỉnh sửa bài viết của người khác!',
      );
    }

    return post;
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
    await this.findPostAndVerifyOwnership(postId, userId);

    const { tagIds, ...rest } = updateData;

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        ...rest,
        ...(tagIds !== undefined && {
          tags: { set: tagIds.map((id) => ({ id })) },
        }),
      },
    });
  }

  async deleteUserPost({ userId, postId }: { userId: number; postId: number }) {
    await this.findPostAndVerifyOwnership(postId, userId);

    await this.prisma.$transaction([
      this.prisma.like.deleteMany({ where: { postId } }),
      this.prisma.comment.deleteMany({ where: { postId } }),
      this.prisma.post.delete({ where: { id: postId } }),
    ]);

    return true;
  }

  private buildPostQueryOptions(params: {
    search?: string;
    authorId?: number;
    isPublished?: boolean;
    tagIds?: number[];
    startDate?: Date;
    endDate?: Date;
    sortBy?: PostSortBy;
  }) {
    // A. Tạo điều kiện lọc (where)
    const where: Prisma.PostWhereInput = {
      ...(params.authorId && { authorId: params.authorId }),
      ...(params.search && {
        OR: [
          { title: { contains: params.search } },
          { content: { contains: params.search } },
        ],
      }),
      ...(params.isPublished !== undefined && {
        published: params.isPublished,
      }),
      ...(params.tagIds &&
        params.tagIds.length > 0 && {
          tags: { some: { id: { in: params.tagIds } } },
        }),
      ...((params.startDate || params.endDate) && {
        createdAt: {
          ...(params.startDate && { gte: params.startDate }),
          ...(params.endDate && { lte: params.endDate }),
        },
      }),
    };

    // B. Tạo điều kiện sắp xếp (orderBy)
    let orderBy: Prisma.PostOrderByWithRelationInput;

    switch (params.sortBy) {
      case PostSortBy.OLDEST:
        orderBy = { createdAt: 'asc' };
        break;
      case PostSortBy.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case PostSortBy.RECENTLY_UPDATED:
        orderBy = { updatedAt: 'desc' };
        break;
      case PostSortBy.MOST_LIKES:
        orderBy = { likes: { _count: 'desc' } };
        break;
      case PostSortBy.MOST_VIEWS:
        orderBy = { views: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Trả về cả hai đối tượng để hàm cha sử dụng
    return { where, orderBy };
  }
}
