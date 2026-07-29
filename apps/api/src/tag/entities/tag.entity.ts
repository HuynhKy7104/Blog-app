// src/tag/entities/tag.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Post } from '../../post/entities/post.entity';

@ObjectType()
export class Tag {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}
