import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Request } from 'express';

interface GqlContext {
  req: Request;
}

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findAll(@Context() context: GqlContext) {
    const user = context.req.user;
    console.log({ user });
    return this.postService.findAll();
  }
}
