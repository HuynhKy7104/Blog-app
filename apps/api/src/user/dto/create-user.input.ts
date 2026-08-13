import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  name!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password?: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;
}
