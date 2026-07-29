// src/comment/entities/comment.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id!: number;

  @Field()
  content!: string;

  @Field(() => Int)
  postId!: number;

  @Field(() => Post, { nullable: true })
  post?: Post;

  @Field(() => Int)
  authorId!: number;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
