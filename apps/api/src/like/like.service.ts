import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async likePost(userId: number, postId: number) {
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId: userId,
        postId: postId,
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return false;
    } else {
      await this.prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });

      return true;
    }
  }

  // async unlikePost(userId: number, postId: number) {
  //   await this.prisma.like.deleteMany({
  //     where: {
  //       userId: userId,
  //       postId: postId,
  //     },
  //   });

  //   return true;
  // }
}
