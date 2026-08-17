// get-posts.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsInt } from 'class-validator';
import { GetUserPostsInput } from './get-user-posts.input';

@InputType()
export class GetPostsInput extends GetUserPostsInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  authorId?: number;
}
