// src/like/entities/like.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';

@ObjectType()
export class Like {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Int)
  postId!: number;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field()
  createdAt!: Date;
}
