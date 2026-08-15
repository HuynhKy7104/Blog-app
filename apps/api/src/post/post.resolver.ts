import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Request } from 'express';
import { CurrentUser } from '../auth/guards/jwt-auth/current-user.decorator';
import type { AuthUser } from '../auth/types/auth-user.type';
import { LikeService } from '../like/like.service';
import { UpdatePostInput } from './dto/update-post.input';

interface GqlContext {
  req: Request;
}

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: LikeService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findAll(
    @Context() context: GqlContext,
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    // const user = context.req.user;
    // console.log({ user });

    return this.postService.findAll(skip, take);
  }

  @Query(() => Int, { name: 'postCount' })
  count() {
    return this.postService.count();
  }

  @Query(() => Post)
  findPostById(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findPostById(id);
  }

  @ResolveField(() => Int, { name: 'likeCount' })
  async likeCount(@Parent() { id }: Post) {
    return this.postService.likeCount(id);
  }

  // @UseGuards(JwtAuthGuard)
  @ResolveField(() => Boolean, { name: 'isLiked' })
  async isLiked(@Parent() { id }: Post, @CurrentUser() user: AuthUser) {
    if (!user || !user.id) {
      return false;
    }

    return this.postService.isLiked({ postId: id, userId: user.id });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Args('postId', { type: () => Int }) postId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.likeService.likePost(user.id, postId);
  }

  @Query(() => [Post])
  @UseGuards(JwtAuthGuard)
  async getUserPosts(@CurrentUser() user: AuthUser) {
    return await this.postService.getUserPosts(user.id);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async updateUserPost(
    @CurrentUser() user: AuthUser,
    @Args('postId', { type: () => Int }) postId: number,
    @Args('updateData')
    updateData: UpdatePostInput,
  ) {
    return this.postService.updateUserPost({
      postId,
      userId: user.id,
      updateData,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteUserPost(
    @CurrentUser() user: AuthUser,
    @Args('postId', { type: () => Int }) postId: number,
  ) {
    return this.postService.deleteUserPost({
      postId,
      userId: user.id,
    });
  }
}
