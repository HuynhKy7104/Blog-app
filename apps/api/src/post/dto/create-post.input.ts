// src/post/dto/create-post.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsUrl,
  IsArray,
  IsInt,
} from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MaxLength(255)
  title!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'thumbnail phải là một URL hợp lệ' })
  thumbnail?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean = false;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}
