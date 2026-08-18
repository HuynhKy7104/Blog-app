import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../auth/guards/jwt-auth/current-user.decorator';
import type { AuthUser } from '../auth/types/auth-user.type';
import { LikeService } from '../like/like.service';
import { UpdatePostInput } from './dto/update-post.input';
import { GetUserPostsInput } from './dto/get-user-posts.input';
import { UserPostsResult } from './entities/user-posts-result.entity';
import { CommentService } from '../comment/comment.service';
import { GetPostsInput } from './dto/get-posts.input';
import { CreatePostInput } from './dto/create-post.input';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: LikeService,
    private readonly commentService: CommentService,
  ) {}

  @Query(() => UserPostsResult, { name: 'posts' })
  findAll(
    @Args('input', { nullable: true })
    input: GetPostsInput = new GetPostsInput(),
  ) {
    return this.postService.findAll(input);
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
    return this.likeService.likeCount(id);
  }

  @UseGuards(JwtAuthGuard)
  @ResolveField(() => Boolean, { name: 'isLiked' })
  async isLiked(@Parent() { id }: Post, @CurrentUser() user: AuthUser) {
    if (!user || !user.id) {
      return false;
    }

    return this.likeService.isLiked({ postId: id, userId: user.id });
  }

  @ResolveField(() => Int, { name: 'commentCount' })
  async commentCount(@Parent() { id }: Post) {
    return this.commentService.count(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Args('postId', { type: () => Int }) postId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.likeService.likePost(user.id, postId);
  }

  @Query(() => UserPostsResult)
  @UseGuards(JwtAuthGuard)
  async getUserPosts(
    @CurrentUser() user: AuthUser,
    @Args('input', { nullable: true })
    input: GetUserPostsInput = new GetUserPostsInput(),
  ) {
    return this.postService.getUserPosts(user.id, input);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  async createUserPost(
    @CurrentUser() user: AuthUser,
    @Args('createData')
    createData: CreatePostInput,
  ) {
    return this.postService.createUserPost({
      userId: user.id,
      createData,
    });
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

  @Mutation(() => Post, { name: 'incrementViewCount' })
  async incrementViewCount(
    @Args('postId', { type: () => Int }) postId: number,
  ) {
    return this.postService.incrementViewCount(postId);
  }
}
