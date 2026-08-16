// user-posts-result.type.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from './post.entity';

@ObjectType()
export class UserPostsResult {
  @Field(() => [Post])
  posts!: Post[];

  @Field(() => Int)
  totalCount!: number;
}
