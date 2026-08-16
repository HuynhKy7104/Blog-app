import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { UpdatePostInput } from './dto/update-post.input';
import { GetUserPostsInput } from './dto/get-user-posts.dto';
import { PostSortBy } from './dto/post-sort-by.enum';
import { Prisma } from '../generated/prisma/client';

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

  async getUserPosts(userId: number, input: GetUserPostsInput) {
    const {
      search,
      isPublished,
      sortBy,
      tagIds,
      startDate,
      endDate,
      skip = 0,
      take = DEFAULT_PAGE_SIZE,
    } = input;

    // 2. TẠO WHERE CLAUSE VỚI KIỂU DỮ LIỆU CHUẨN CỦA PRISMA VÀ CÚ PHÁP SPREAD
    const whereClause: Prisma.PostWhereInput = {
      authorId: userId,

      // Nếu có search thì mới thêm khối OR vào object
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      }),

      // Nếu isPublished khác undefined thì mới thêm vào
      ...(isPublished !== undefined && { published: isPublished }),

      // Nếu có tagIds thì mới thêm điều kiện lọc Tag
      ...(tagIds &&
        tagIds.length > 0 && {
          tags: { some: { id: { in: tagIds } } },
        }),

      // Lọc theo khoảng thời gian
      ...((startDate || endDate) && {
        createdAt: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate }),
        },
      }),
    };

    // 3. TẠO ORDER BY CLAUSE VỚI KIỂU DỮ LIỆU CHUẨN
    let orderByClause: Prisma.PostOrderByWithRelationInput;

    switch (sortBy) {
      case PostSortBy.OLDEST:
        orderByClause = { createdAt: 'asc' };
        break;
      case PostSortBy.NEWEST:
        orderByClause = { createdAt: 'desc' };
        break;
      case PostSortBy.RECENTLY_UPDATED:
        orderByClause = { updatedAt: 'desc' };
        break;
      case PostSortBy.MOST_LIKES:
        orderByClause = { likes: { _count: 'desc' } };
        break;
      case PostSortBy.MOST_COMMENTS:
        orderByClause = { comments: { _count: 'desc' } };
        break;
      default:
        orderByClause = { createdAt: 'desc' };
    }

    // 4. THỰC THI TRUY VẤN
    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take,
        where: whereClause,
        include: {
          author: true,
          tags: true,
          _count: {
            select: { likes: true, comments: true },
          },
        },
        orderBy: orderByClause,
      }),
      this.prisma.post.count({ where: whereClause }),
    ]);

    return { posts, totalCount };
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
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết này!');
    }

    if (post.authorId !== userId) {
      throw new UnauthorizedException(
        'Bạn không có quyền chỉnh sửa bài viết của người khác!',
      );
    }

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
