import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsInt,
  IsArray,
  Min,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
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

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

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
