import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { LikeModule } from '../like/like.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [LikeModule, CommentModule],
  providers: [PostResolver, PostService, PrismaService],
})
export class PostModule {}
