// src/posts/dto/get-user-posts.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { PostSortBy } from './post-sort-by.enum';
import { DEFAULT_PAGE_SIZE } from '../../../constants';

@InputType()
export class GetUserPostsInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @Field(() => PostSortBy, { nullable: true })
  @IsOptional()
  @IsEnum(PostSortBy)
  sortBy?: PostSortBy;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @Field(() => Int, { nullable: true, defaultValue: DEFAULT_PAGE_SIZE })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number = DEFAULT_PAGE_SIZE;
}
