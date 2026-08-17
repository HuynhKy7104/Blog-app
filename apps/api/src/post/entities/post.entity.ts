// src/post/entities/post.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';

@ObjectType()
export class Post {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  slug?: string;

  @Field()
  title!: string;

  @Field()
  content!: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  published!: boolean;

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];

  @Field(() => Int)
  authorId!: number;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => [Like], { nullable: true })
  likes?: Like[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => Int)
  views!: number;

  // ==========================================
  // THÊM TRƯỜNG ẢO
  // ==========================================

  @Field(() => Int, { defaultValue: 0 })
  likeCount?: number;

  @Field(() => Boolean, { defaultValue: false })
  isLiked?: boolean;

  @Field(() => Int, { defaultValue: 0 })
  commentCount?: number;
}
