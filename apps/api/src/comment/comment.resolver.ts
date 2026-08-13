import { Args, Int, Query, Resolver, Mutation } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../auth/guards/jwt-auth/current-user.decorator';
import type { AuthUser } from '../auth/types/auth-user.type';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}
  @Query(() => [Comment])
  getPostComments(
    @Args('postId', { type: () => Int }) postId: number,
    @Args('take', {
      type: () => Int,
      nullable: true,
      defaultValue: DEFAULT_PAGE_SIZE,
    })
    take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ) {
    return this.commentService.findManyPyPost({ postId, take, skip });
  }

  @Query(() => Int)
  postCommentCount(@Args('postId', { type: () => Int }) postId: number) {
    return this.commentService.count(postId);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  createPostComment(
    @Args('postId', { type: () => Int }) postId: number,
    @Args('content', { type: () => String }) content: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentService.createPostComment({
      postId: postId,
      content: content,
      userId: user.id,
    });
  }
}
