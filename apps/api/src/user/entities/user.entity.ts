// src/user/entities/user.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  avatar?: string;

  // Không expose password / hashedRefreshToken ra GraphQL
  @Field(() => Role)
  role!: Role;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => [Like], { nullable: true })
  likes?: Like[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
